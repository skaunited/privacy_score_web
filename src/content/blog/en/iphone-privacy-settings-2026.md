---
title: "iPhone Privacy Settings 2026: The 7 That Actually Matter"
description: "A 2026-current guide to iPhone privacy settings, organized by impact. Audit your iOS 17 or 18 device in 10 minutes, with the 4 settings that are theater."
publishedAt: "2026-06-01"
updatedAt: "2026-06-01"
author: "Skander Bahri"
language: "en"
slug: "iphone-privacy-settings-2026"
tags: ["iphone-privacy", "ios-17", "app-tracking-transparency"]
hero:
  alt: "An iPhone in hand, Settings app open on the Privacy and Security screen"
---

In January 2024, reporters at Wired and 404 Media bought a commercial advertising dataset. Less than a dinner's worth of money. Inside that file, they identified <a href="https://www.wired.com/story/secret-service-phone-location-data-babel-street/" rel="external">26 Secret Service agents</a> guarding the White House, mapped by their phones' ad IDs. No leak. No hack. Just a legal purchase from a data broker, made possible by ad SDKs sitting inside ordinary apps on ordinary iPhones.

That's the gap your iPhone privacy settings are trying to close. Apple has shipped a real toolkit since 2021. But the toolkit only helps if you know which seven switches matter, which four are mostly marketing, and how to audit yourself without spending an afternoon in Settings. This guide walks through exactly that, for iOS 17 and iOS 18 (the baseline as of mid-2026).

## Why iPhone privacy settings changed in 2024 to 2026

Three policy shifts at Apple reshaped what's possible on an iPhone in the last few years.

**App Tracking Transparency (2021).** Apps that want to use your IDFA for cross-app tracking have to ask, in a system prompt you can see and refuse. By the end of 2023, <a href="https://www.adjust.com/blog/att-opt-in-rate/" rel="external">roughly 75% of users said no</a>. That broke a lot of the ad-tech industry, which is why your social feed started feeling less eerily targeted that year.

**Advanced Data Protection for iCloud (2022).** End-to-end encryption for almost everything you back up to iCloud: Photos, Notes, Reminders, Safari bookmarks, Wallet passes. Apple itself cannot read it once you turn this on. The catch: you become responsible for your recovery key, and a few categories (Mail, Contacts, Calendars) stay readable to Apple because of legacy interoperability.

**Lockdown Mode (2022) and the App Privacy Report (2021 to 2022).** Lockdown Mode is a paranoia-grade switch for people targeted by spyware vendors. The App Privacy Report is the opposite: a quiet diary, in Settings, that records which apps used your camera, mic, photos, location, and contacts in the last seven days, plus the domains they pinged. Most iPhone users have never opened it.

Together, these three changes mean the meaningful privacy controls on a 2026 iPhone exist. They just aren't on by default, and the labels don't always make their importance obvious.

## The 7 settings that actually move the needle

Ranked by how much exposure they remove, not by where Apple puts them in the menu.

### 1. Allow Apps to Request to Track: Off

**Where:** Settings, Privacy &amp; Security, Tracking.

**What it does:** flips a global kill-switch so apps cannot show the ATT prompt at all. Every new app launches as if you tapped "Ask App Not to Track." Your IDFA stays zeroed out across the system.

**What it doesn't do:** it doesn't stop apps from tracking you with their own SDKs using non-IDFA signals (device fingerprint, IP address, email). It just removes the most efficient identifier the ad industry runs on. That alone is worth a lot. <a href="https://www.eff.org/deeplinks/2022/03/how-disable-ad-id-tracking-ios-and-android-and-why-you-should-do-it-now" rel="external">EFF has called this the single highest-impact iPhone privacy toggle</a>.

### 2. Significant Locations: Off (or at least, audit it)

**Where:** Settings, Privacy &amp; Security, Location Services, scroll all the way down to System Services, then Significant Locations.

**What it does:** iOS keeps a private, on-device log of places you visit often, with timestamps, used to power "you might like restaurants near your usual route" type suggestions. If you have never seen this list, brace yourself. It typically goes back months and reads like a stalker's notebook.

**What it doesn't do:** turning this off doesn't erase the log retroactively unless you also tap Clear History. And Significant Locations is end-to-end encrypted in Apple's design, so the privacy concern is mostly local: anyone with your unlocked phone can browse it. Worth turning off if you don't actively use the feature.

### 3. Apple Advertising: Personalized Ads off

**Where:** Settings, Privacy &amp; Security, Apple Advertising.

**What it does:** stops Apple's own advertising platform (mostly in the App Store and Apple News) from segmenting you based on your behavior in those apps. It also resets the advertising identifier Apple uses internally.

**What it doesn't do:** you still see ads. You just see less-relevant ones, which most people find improves rather than degrades the App Store experience.

### 4. Encrypted DNS

**Where:** there is no first-class iOS setting for this. You either install a DNS profile from a provider like NextDNS, Quad9, or Cloudflare 1.1.1.1, or you turn on iCloud Private Relay (Settings, your name, iCloud, Private Relay) which encrypts DNS plus a layer of routing for Safari.

**What it does:** stops your network provider, your hotel Wi-Fi, your employer, and anyone sniffing the link between your phone and the wider internet from seeing which domains you look up. This is a much bigger deal than people realize: unencrypted DNS leaks every website you visit, every app server you talk to, in plain text.

**What it doesn't do:** it doesn't encrypt the content of your traffic (HTTPS already does that), and it doesn't hide your traffic from the apps themselves. It just removes one of the most boring and most exploited side channels.

### 5. App Privacy Report: On

**Where:** Settings, Privacy &amp; Security, App Privacy Report, then Turn On App Privacy Report.

**What it does:** starts a rolling 7-day log of every sensor access (camera, mic, location, photos, contacts) and every network domain each app contacted. You can scroll it, filter it, and screenshot it. It is the closest thing iOS offers to a "show your work" button for apps.

**What it doesn't do:** it does not block anything. It is purely observational. But you cannot fix what you cannot see, and most users discover at least three apps doing something unexpected within the first week of having the report on. <a href="https://support.apple.com/guide/iphone/iphd34a4cdf7/ios" rel="external">Apple's own documentation</a> walks through the report format.

### 6. Mail Privacy Protection

**Where:** Settings, Apps, Mail, Privacy Protection.

**What it does:** the Apple Mail app pre-fetches images through anonymizing relays. Senders cannot see when you opened their email or your IP address when you did. Marketers' open-tracking pixels go blind.

**What it doesn't do:** if you use Gmail's app, Outlook, Spark, or another third-party mail client, this setting is bypassed. You'd need the equivalent setting (or none, in many cases) inside that app.

### 7. Hide My Email (iCloud+)

**Where:** Settings, your name, iCloud, Hide My Email. Available with any paid iCloud+ tier (starts at €0.99 per month).

**What it does:** generates throwaway forwarding aliases on demand. You sign up for newsletters, store accounts, and questionable apps with `xkz9...@icloud.com`. Mail arrives in your real inbox; you can disable the alias the minute it gets sold to a data broker.

**What it doesn't do:** it doesn't help with information you already gave to the breach-prone places. But for everything from this point forward, it's the single cleanest way to control which lists you're on.

## The 4 settings that look private but aren't

Not everything labeled "Privacy" in iOS is doing what you think.

**Find My iPhone location sharing leftovers.** If you ever shared your location with a family member or friend and forgot to turn it off, that sharing is still active. Audit it in Find My, then People. Not a setting, a residue.

**Safari Prefetch Top Hit.** Marketed as a privacy-friendly setting because of caching benefits, this option actually causes Safari to pre-load pages you might tap on. The pre-load fires real network requests, including to tracking pixels on those pages. Off, in Settings, Apps, Safari, Search.

**Siri Suggestions in Search.** "Allow Apps Before Searching" sounds harmless, but it leaks every keystroke of every Spotlight search into a relevance model fed by your installed apps. The privacy theater is the "everything stays on-device" framing. The local model still shapes what the system thinks you want, which can leak into Maps, App Store, and Safari suggestions. Decide whether the convenience is worth the modeling.

**Predictive Keyboard "Learn from this app."** Apple's autocorrect learns from what you type, which is reasonable. The per-app version of this learning, however, has no audit surface. You cannot see what was learned, by which app, or delete it selectively. Off if you'd rather not feed it.

## How to audit yourself in 10 minutes

A short checklist, in order:

1. Settings, Privacy &amp; Security, Tracking. Allow Apps to Request to Track: **Off**.
2. Settings, Privacy &amp; Security, Location Services, System Services, Significant Locations. Tap Clear History. Turn the toggle **Off** unless you actively use the feature.
3. Settings, Privacy &amp; Security, Apple Advertising. Personalized Ads: **Off**.
4. Settings, Wi-Fi (or Cellular), tap the (i) on your network, scroll to DNS. Set up an encrypted provider, or turn on iCloud Private Relay if you have iCloud+.
5. Settings, Privacy &amp; Security, App Privacy Report. **Turn On**. Come back in 7 days.
6. Settings, Apps, Mail, Privacy Protection. **On**.
7. Settings, your name, iCloud, Hide My Email. Use it for every new sign-up.

The next time you have a quiet ten minutes, do all seven. The audit ages well. Most of these settings rarely change once you set them.

## Where Privacy Score fits in

The App Privacy Report is brilliant. It's also a wall of JSON-style entries, ordered chronologically, without any sense of which domains are tracking infrastructure and which are legitimate app backends. Reading it raw is like reading server logs: possible, useful, exhausting.

That's what we built [Privacy Score](/en/) for. You export the report from iOS (Settings, Privacy &amp; Security, App Privacy Report, Share). Privacy Score reads it on your iPhone, cross-references every domain against the open DuckDuckGo Tracker Radar database, and gives you a score out of 100 plus three to five concrete fixes ranked by how many points they earn back. No server, no account, no cloud. Search the public iOS codebase for `URLSession` and you'll find zero active calls.

We charge €23.88 per year or €20.94 per six months for new scans. The first scan is free for life. The point is to make iPhone privacy auditing something you do in 60 seconds, not 60 minutes, and to give you a number that climbs over time as you apply fixes. Read more about [how we treat your data](/en/privacy-policy/) (we don't).

## Conclusion

iPhone privacy settings in 2026 are real, and the highest-impact ones take ten minutes to set. The harder problem isn't the toggles, it's knowing which apps are doing what with the permissions you already granted. That's a job for the App Privacy Report, plus a tool that makes the report readable. Start with the seven settings above. Then come back to the [Privacy Score homepage](/en/) when you're ready to see what your installed apps are actually doing behind the scenes.
