/**
 * src/content.config.ts — Content Collections schema definitions.
 *
 * The `legal` collection holds the canonical legal markdown files (Mentions
 * légales, Politique de confidentialité, CGU and their EN counterparts) under
 * `src/content/legal/{fr,en}/`. These files are the single source of truth
 * for the website. The corresponding review reports live in
 * `docs/legal-review/` and the internal ROPA in `compliance/`.
 *
 * Schema is intentionally permissive because the source documents carry
 * additional French-language metadata keys (`url_canonique`, `liens_croises`).
 * Astro's strict mode would reject those otherwise.
 *
 * The glob pattern excludes any README.md or top-level non-locale files so
 * that documentation files (if added later) won't be parsed as legal entries
 * and fail schema validation.
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

export const collections = { legal };
