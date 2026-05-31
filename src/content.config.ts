/**
 * src/content.config.ts - Content Collections schema definitions.
 *
 * The `legal` collection holds the canonical legal markdown files (Mentions
 * légales, Politique de confidentialité, CGU and their EN counterparts) under
 * `src/content/legal/{fr,en}/`. These files are the single source of truth
 * for the website. The corresponding review reports live in
 * `docs/legal-review/` and the internal ROPA in `compliance/`.
 *
 * The `blog` collection holds the multilingual blog posts under
 * `src/content/blog/{fr,en}/`. Each post is a native, locale-specific article
 * (never a translation). Frontmatter is shared across locales for consistency
 * with the rest of the project's SEO stack.
 *
 * The `about` collection holds the About page content per locale under
 * `src/content/about/{fr,en}.md`.
 *
 * Schemas are intentionally permissive because the source documents carry
 * additional French-language metadata keys (`url_canonique`, `liens_croises`).
 * Astro's strict mode would reject those otherwise.
 *
 * The legal glob pattern excludes any README.md or top-level non-locale files
 * so that documentation files (if added later) won't be parsed as legal
 * entries and fail schema validation.
 */
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const legal = defineCollection({
  loader: glob({
    pattern: ['{fr,en}/**/*.md'],
    base: './src/content/legal',
  }),
  schema: z.object({
    title: z.string(),
    language: z.enum(['fr', 'en']),
    version: z.coerce.string(),
    last_updated: z.coerce.date(),
    publisher: z.string(),
    // Optional French-side keys
    url_canonique: z.string().url().optional(),
    liens_croises: z.array(z.record(z.string(), z.string())).optional(),
    // Optional English-side keys
    canonical_url: z.string().url().optional(),
    cross_links: z.array(z.record(z.string(), z.string())).optional(),
  }),
});

const blog = defineCollection({
  loader: glob({
    pattern: ['{fr,en}/**/*.md'],
    base: './src/content/blog',
  }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    publishedAt: z.coerce.date(),
    updatedAt: z.coerce.date().optional(),
    author: z.string(),
    language: z.enum(['fr', 'en']),
    slug: z.string(),
    tags: z.array(z.string()).default([]),
    hero: z
      .object({
        src: z.string().optional(),
        alt: z.string(),
      })
      .optional(),
  }),
});

const about = defineCollection({
  loader: glob({
    pattern: ['*.md'],
    base: './src/content/about',
  }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    language: z.enum(['fr', 'en']),
    author: z.string(),
    publishedAt: z.coerce.date(),
    updatedAt: z.coerce.date().optional(),
  }),
});

export const collections = { legal, blog, about };
