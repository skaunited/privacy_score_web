import { getCollection, type CollectionEntry } from 'astro:content';
import { localizedPath, type Locale, type LocaleLink } from '../i18n/utils';

export async function publishedPosts(locale?: Locale): Promise<CollectionEntry<'blog'>[]> {
  const all: CollectionEntry<'blog'>[] = await getCollection('blog');
  return all.filter((post) => post.data.status === 'published'
    && (!locale || post.data.language === locale)
    && post.data.publishedAt <= new Date())
    .sort((a, b) => b.data.publishedAt.valueOf() - a.data.publishedAt.valueOf());
}
export function postPath(post: CollectionEntry<'blog'>): string {
  return localizedPath(post.data.language, `blog/${post.data.slug}`);
}
export function postAlternates(post: CollectionEntry<'blog'>, all: CollectionEntry<'blog'>[]): LocaleLink[] {
  if (!post.data.translationKey) return [];
  const group = all.filter((other) => other.data.translationKey === post.data.translationKey);
  if (new Set(group.map((other) => other.data.language)).size !== group.length) {
    throw new Error(`Duplicate language in blog translation group: ${post.data.translationKey}`);
  }
  return group.length > 1 ? group.map((other) => ({ locale: other.data.language, url: postPath(other) })) : [];
}
