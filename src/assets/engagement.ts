/** First-party interaction measurement. Created only while audience consent is granted. */
export type EventParams = Record<string, string | number>;
type SendEvent = (name: string, params?: EventParams) => void;

export function measureEngagement(send: SendEvent) {
  const controller = new AbortController();
  const { signal } = controller;
  const article = document.querySelector<HTMLElement>('[data-analytics-article]');
  const end = article?.querySelector<HTMLElement>('[data-article-end]');
  const scrollSteps = [25, 50, 75, 90, 100];
  const readingSteps = [30, 60, 120, 180, 300];
  const sentReading = new Set<number>();
  let maxScroll = 0;
  let activeMs = 0;
  let reportedMs = 0;
  let viewed = false;
  let endReached = false;
  let completed = false;
  let suspended = false;
  let lastTick = performance.now();
  let lastActivity = lastTick;
  let frame = 0;

  const depth = () => {
    const height = document.documentElement.scrollHeight;
    if (height <= innerHeight + 1) return 0; // A short page has no scroll journey.
    const bottom = scrollY + innerHeight;
    return bottom >= height - 2 ? 100 : Math.min(100, bottom / height * 100);
  };
  // Do not reconstruct scrolling that took place before consent was granted.
  let previousDepth = depth();

  const articleVisible = () => {
    if (!article || !end) return false;
    return article.getBoundingClientRect().top < innerHeight && end.getBoundingClientRect().top > 0;
  };
  const foreground = () => !suspended && document.visibilityState === 'visible' && document.hasFocus();
  const snapshot = (): EventParams => ({
    max_scroll_percent: maxScroll,
    ...(article ? {
      active_read_seconds: Math.floor(activeMs / 1000), article_end_reached: Number(endReached),
      read_seconds: readingSteps.findLast((seconds) => activeMs >= seconds * 1000) ?? 0,
    } : {}),
  });
  const milestones = () => {
    for (const seconds of readingSteps) {
      if (activeMs >= seconds * 1000 && !sentReading.has(seconds)) {
        sentReading.add(seconds);
        send('article_read_time', { read_seconds: seconds });
      }
    }
    if (endReached && activeMs >= 60_000 && !completed) {
      completed = true;
      send('article_complete', snapshot());
    }
  };
  const reportTime = () => {
    const total = Math.floor(activeMs);
    const delta = total - reportedMs;
    if (delta < 1) return;
    reportedMs = total;
    send('article_engagement', { reading_time_msec: delta, active_read_seconds: Math.floor(total / 1000) });
  };
  // Each interval is counted according to the state at its start. Visibility/focus/
  // intersection changes settle the old interval before starting the new state.
  let reading = foreground() && articleVisible();
  const tick = () => {
    const now = performance.now();
    const wasReading = reading;
    if (reading) {
      // Pause after 60s without interaction; do not turn a suspended browser into reading time.
      activeMs += Math.max(0, Math.min(now - lastTick, 5000, lastActivity + 60_000 - lastTick));
      milestones();
      if (activeMs - reportedMs >= 15_000) reportTime();
    }
    lastTick = now;
    reading = foreground() && articleVisible() && now - lastActivity < 60_000;
    if (wasReading && !reading) reportTime();
  };
  const observeArticle = () => {
    if (!article || !end || !foreground()) return;
    if (articleVisible() && !viewed) {
      viewed = true;
      send('article_view');
    }
    const endTop = end.getBoundingClientRect().top;
    if (viewed && endTop >= 0 && endTop <= innerHeight && !endReached) {
      endReached = true;
      send('article_end', snapshot());
      milestones();
    }
  };
  const activity = () => {
    tick();
    lastActivity = performance.now();
    reading = foreground() && articleVisible();
  };
  const scroll = () => {
    activity();
    if (frame) return;
    frame = requestAnimationFrame(() => {
      frame = 0;
      if (!foreground()) return;
      const current = depth();
      for (const percent of scrollSteps) {
        if (previousDepth < percent && current >= percent && maxScroll < percent) {
          maxScroll = percent;
          send('page_scroll', { scroll_percent: percent });
        }
      }
      previousDepth = current;
      observeArticle();
    });
  };
  const pause = () => {
    tick();
    reportTime();
    reading = false;
  };
  const resume = () => {
    lastTick = performance.now();
    lastActivity = lastTick;
    previousDepth = depth();
    reading = foreground() && articleVisible();
    observeArticle();
  };
  const timer = article ? window.setInterval(tick, 1000) : undefined;
  window.addEventListener('scroll', scroll, { passive: true, signal });
  window.addEventListener('resize', () => {
    tick();
    previousDepth = depth(); // A viewport resize is not a user scrolling through content.
    observeArticle();
  }, { passive: true, signal });
  for (const type of ['pointerdown', 'keydown', 'touchstart', 'wheel']) {
    document.addEventListener(type, activity, { passive: true, signal });
  }
  window.addEventListener('blur', pause, { signal });
  window.addEventListener('focus', resume, { signal });
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') pause();
    else resume();
  }, { signal });
  window.addEventListener('pagehide', () => { pause(); suspended = true; }, { signal });
  window.addEventListener('pageshow', () => { suspended = false; resume(); }, { signal });
  observeArticle();

  return {
    snapshot,
    flush: () => { tick(); reportTime(); },
    stop: () => {
      // Withdrawal deliberately drops unreported time instead of sending a final event.
      controller.abort();
      clearInterval(timer);
      cancelAnimationFrame(frame);
    },
  };
}
