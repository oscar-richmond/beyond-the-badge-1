import React from 'react';
import { defineConfig, wrapFieldsWithMeta } from 'tinacms';

// ─── Brand Font Injection ─────────────────────────────────────────────────
//
// Injects the project's own typefaces into the Tina admin SPA so the quote
// preview renders in the actual brand fonts. Font files are served from the
// same origin (/fonts/), so no CORS issues. Playfair Display is loaded from
// Google Fonts as a web fallback on machines without Awesome Serif installed.
// Idempotent: guarded by the style element's id so it only runs once.
//
if (typeof document !== 'undefined') {
  if (!document.getElementById('btb-admin-fonts')) {
    // Web fallback — Playfair Display (editorial serif, closest match)
    const gfLink = document.createElement('link');
    gfLink.rel  = 'stylesheet';
    gfLink.href = 'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,400;1,500;1,600&display=swap';
    document.head.appendChild(gfLink);

    // Self-hosted variable fonts — mirrors the @font-face rules in global.css
    const style = document.createElement('style');
    style.id = 'btb-admin-fonts';
    style.textContent = [
      '@font-face {',
      "  font-family: 'Awesome Serif VAR';",
      "  src: url('/fonts/awesome-serif-var.woff2') format('woff2 supports variations'),",
      "       url('/fonts/awesome-serif-var.woff2') format('woff2');",
      '  font-weight: 1 700;',
      '  font-style: normal;',
      '  font-display: swap;',
      '}',
      '@font-face {',
      "  font-family: 'Awesome Serif Italic VAR';",
      "  src: url('/fonts/awesome-serif-italic-var.woff2') format('woff2 supports variations'),",
      "       url('/fonts/awesome-serif-italic-var.woff2') format('woff2');",
      '  font-weight: 300 700;',
      '  font-style: italic;',
      '  font-display: swap;',
      '}',
    ].join('\n');
    document.head.appendChild(style);
  }
}

// ─── Custom Field Components ────────────────────────────────────────────────
//
// These components enhance the TinaCMS editing experience without changing
// any data format or content files. The live site is completely unaffected.
//

// ── 1. MARQUEE ITEM FIELD ──────────────────────────────────────────────────
//
// Renders each marquee string as a dark pill-styled input with a character
// count badge. Applies per-item to cta.marqueeItems (string list).
// Note: NOT wrapped with wrapFieldsWithMeta — list items don't have per-item labels.
//
const MarqueeItemField = (props: any) => {
  const { input } = props;
  const len: number = (input.value ?? '').length;
  const isLong = len > 32;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '2px 0' }}>
      <input
        {...input}
        placeholder="Tag text…"
        style={{
          flex: 1,
          padding: '6px 14px',
          borderRadius: '20px',
          border: `1.5px solid ${isLong ? '#f59e0b' : '#374151'}`,
          background: '#0f0f1a',
          color: '#f9fafb',
          fontSize: '13px',
          fontFamily: 'system-ui, sans-serif',
          outline: 'none',
          transition: 'border-color 0.15s',
        }}
      />
      <span
        title={isLong ? 'Tag is quite long — may wrap in the ticker' : 'Character count'}
        style={{
          fontSize: '11px',
          fontVariantNumeric: 'tabular-nums',
          color: isLong ? '#f59e0b' : '#6b7280',
          minWidth: '28px',
          textAlign: 'right',
          flexShrink: 0,
        }}
      >
        {len}
      </span>
    </div>
  );
};

// ── 2. QUOTE AFTER WITH LIVE PREVIEW ─────────────────────────────────────
//
// Renders the closing quote textarea and, below it, a live assembled preview
// of the full quote (before + italic highlight + after). Reads sibling fields
// from form.getState() so no React state is needed.
//
// Applies to: testimonials.items[N].quoteAfter
//
const QuoteAfterWithPreview = wrapFieldsWithMeta((props: any) => {
  const { input, form } = props;

  // Extract the list index from field path e.g. "items.0.quoteAfter"
  const indexMatch = (input.name as string).match(/(\d+)/);
  const index = indexMatch ? parseInt(indexMatch[1], 10) : 0;

  const items: any[] = form.getState()?.values?.items ?? [];
  const sibling = items[index] ?? {};

  const before: string    = sibling.quoteBefore    ?? '';
  const highlight: string = sibling.quoteHighlight ?? '';
  const after: string     = input.value            ?? '';
  const hasContent        = before || highlight || after;

  return (
    <div>
      <textarea
        {...input}
        rows={3}
        style={{
          width: '100%',
          padding: '8px 10px',
          borderRadius: '6px',
          border: '1.5px solid #d1d5db',
          fontSize: '14px',
          lineHeight: 1.55,
          resize: 'vertical',
          boxSizing: 'border-box',
          fontFamily: 'inherit',
        }}
      />

      {hasContent && (
        <div
          style={{
            marginTop: '12px',
            padding: '16px 20px',
            background: '#f5f3ff',
            borderLeft: '3px solid #7c3aed',
            borderRadius: '0 8px 8px 0',
          }}
        >
          {/* Label — always sans-serif regardless of brand font load status */}
          <div
            style={{
              fontSize: '10px',
              fontWeight: 700,
              letterSpacing: '0.09em',
              textTransform: 'uppercase',
              color: '#7c3aed',
              marginBottom: '10px',
              fontFamily: 'system-ui, -apple-system, sans-serif',
            }}
          >
            Live quote preview
          </div>

          {/* Blockquote rendered in the actual brand typeface stack */}
          <blockquote
            style={{
              margin: 0,
              fontFamily: [
                "'Awesome Serif VAR'",
                "'Awesome Serif'",
                "'Playfair Display'",
                "'Cormorant Garamond'",
                'georgia',
                'serif',
              ].join(', '),
              fontSize: '16px',
              fontWeight: 300,
              lineHeight: 1.8,
              letterSpacing: '-0.01em',
              color: '#1f2937',
            }}
          >
            <span>{before}</span>
            {highlight && (
              <em
                style={{
                  fontFamily: [
                    "'Awesome Serif Italic VAR'",
                    "'Awesome Serif Italic'",
                    "'Awesome Serif'",
                    "'Playfair Display'",
                    "'Cormorant Garamond'",
                    'georgia',
                    'serif',
                  ].join(', '),
                  fontStyle: 'italic',
                  fontWeight: 400,
                  color: '#4f46e5',
                }}
              >
                {highlight}
              </em>
            )}
            <span>{after}</span>
          </blockquote>
        </div>
      )}
    </div>
  );
});

// ── 3. CAPABILITY KEY FIELD ───────────────────────────────────────────────
//
// Auto-slugifies input (lowercase, hyphens only) as the user types, and
// validates uniqueness across all capability keys using form.getState().
//
// Applies to: capabilities.items[N].key
//
const CapabilityKeyField = wrapFieldsWithMeta((props: any) => {
  const { input, form } = props;

  const handleChange = (e: any) => {
    const slugified = (e.target.value as string)
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '');
    input.onChange(slugified);
  };

  const indexMatch = (input.name as string).match(/(\d+)/);
  const currentIndex = indexMatch ? parseInt(indexMatch[1], 10) : -1;
  const allItems: any[] = form.getState()?.values?.items ?? [];

  const isDuplicate = allItems.some(
    (item, i) => i !== currentIndex && item?.key === input.value && !!input.value,
  );
  const isEmpty  = !(input.value as string);
  const isValid  = !isEmpty && !isDuplicate;

  const borderColor = isDuplicate ? '#ef4444' : isValid ? '#22c55e' : '#d1d5db';
  const icon        = isValid ? '✅' : isDuplicate ? '❌' : null;

  return (
    <div>
      <div style={{ position: 'relative' }}>
        <input
          {...input}
          onChange={handleChange}
          placeholder="e.g. brand-partnerships"
          style={{
            width: '100%',
            padding: '7px 38px 7px 10px',
            borderRadius: '6px',
            border: `1.5px solid ${borderColor}`,
            fontFamily: 'ui-monospace, "Cascadia Code", monospace',
            fontSize: '13px',
            boxSizing: 'border-box',
            letterSpacing: '0.02em',
            transition: 'border-color 0.15s',
          }}
        />
        {!isEmpty && icon && (
          <span
            style={{
              position: 'absolute',
              right: '10px',
              top: '50%',
              transform: 'translateY(-50%)',
              fontSize: '14px',
              lineHeight: 1,
              pointerEvents: 'none',
            }}
          >
            {icon}
          </span>
        )}
      </div>

      {isDuplicate && (
        <p style={{ color: '#ef4444', fontSize: '12px', margin: '5px 0 0', lineHeight: 1.4 }}>
          ⚠️ This key is already used by another capability — keys must be unique.
        </p>
      )}

      <p style={{ color: '#6b7280', fontSize: '12px', margin: '5px 0 0', lineHeight: 1.4 }}>
        Lowercase letters and hyphens only — auto-formatted as you type.
        This value is used as a JavaScript identifier on the live site.
      </p>
    </div>
  );
});

// ── 4. VIDEO PATH FIELDS ──────────────────────────────────────────────────
//
// Factory that creates a validated path input for a specific video extension.
// Validates: path must start with "/" and end with the given extension.
// Empty values are allowed (leave blank to hide the Play button).
//
// Applies to: hero + testimonial campaign video path fields.
//
const makeVideoPathField = (ext: 'mp4' | 'webm') =>
  wrapFieldsWithMeta((props: any) => {
    const { input } = props;
    const value: string = input.value ?? '';
    const isEmpty  = !value.trim();
    const isValid  =
      isEmpty || (value.startsWith('/') && value.toLowerCase().endsWith(`.${ext}`));

    const borderColor = !isValid ? '#ef4444' : value ? '#22c55e' : '#d1d5db';
    const icon        = value ? (isValid ? '✅' : '❌') : null;

    return (
      <div>
        <div style={{ position: 'relative' }}>
          <input
            {...input}
            placeholder={`/your-video.${ext}   (leave blank to hide)`}
            style={{
              width: '100%',
              padding: '7px 38px 7px 10px',
              borderRadius: '6px',
              border: `1.5px solid ${borderColor}`,
              fontFamily: 'ui-monospace, "Cascadia Code", monospace',
              fontSize: '13px',
              boxSizing: 'border-box',
              transition: 'border-color 0.15s',
            }}
          />
          {icon && (
            <span
              style={{
                position: 'absolute',
                right: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                fontSize: '14px',
                lineHeight: 1,
                pointerEvents: 'none',
              }}
            >
              {icon}
            </span>
          )}
        </div>

        {!isValid && (
          <p style={{ color: '#ef4444', fontSize: '12px', margin: '5px 0 0', lineHeight: 1.4 }}>
            Path must start with <code style={{ background: '#fee2e2', padding: '0 3px', borderRadius: '3px' }}>/</code> and end with{' '}
            <code style={{ background: '#fee2e2', padding: '0 3px', borderRadius: '3px' }}>.{ext}</code>
          </p>
        )}
      </div>
    );
  });

const VideoMp4Field  = makeVideoPathField('mp4');
const VideoWebmField = makeVideoPathField('webm');

// ── 5a. EMAIL FIELD ───────────────────────────────────────────────────────
//
// Validates email format with a live coloured border + icon.
// Applies to: globalSettings.contactEmail
//
const EmailField = wrapFieldsWithMeta((props: any) => {
  const { input } = props;
  const value: string = input.value ?? '';
  const isEmpty  = !value.trim();
  const isValid  = isEmpty || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  const borderColor = !isValid ? '#ef4444' : value ? '#22c55e' : '#d1d5db';
  const icon        = value ? (isValid ? '✅' : '❌') : null;

  return (
    <div>
      <div style={{ position: 'relative' }}>
        <input
          {...input}
          type="text"
          placeholder="hello@beyondthebadge.agency"
          style={{
            width: '100%',
            padding: '7px 38px 7px 10px',
            borderRadius: '6px',
            border: `1.5px solid ${borderColor}`,
            fontSize: '13px',
            boxSizing: 'border-box',
            transition: 'border-color 0.15s',
          }}
        />
        {icon && (
          <span
            style={{
              position: 'absolute',
              right: '10px',
              top: '50%',
              transform: 'translateY(-50%)',
              fontSize: '14px',
              lineHeight: 1,
              pointerEvents: 'none',
            }}
          >
            {icon}
          </span>
        )}
      </div>

      {!isValid && (
        <p style={{ color: '#ef4444', fontSize: '12px', margin: '5px 0 0', lineHeight: 1.4 }}>
          Please enter a valid email address — e.g. hello@domain.com
        </p>
      )}
    </div>
  );
});

// ── 5b. INSTAGRAM URL FIELD ───────────────────────────────────────────────
//
// Validates that the URL is a properly formed Instagram profile link.
// Applies to: globalSettings.instagramUrl
//
const InstagramUrlField = wrapFieldsWithMeta((props: any) => {
  const { input } = props;
  const value: string = input.value ?? '';
  const isEmpty  = !value.trim();
  const isValid  = isEmpty || /^https:\/\/(www\.)?instagram\.com\/.+/.test(value);

  const borderColor = !isValid ? '#ef4444' : value ? '#22c55e' : '#d1d5db';
  const icon        = value ? (isValid ? '✅' : '❌') : null;

  return (
    <div>
      <div style={{ position: 'relative' }}>
        <input
          {...input}
          type="text"
          placeholder="https://www.instagram.com/beyondthebadge"
          style={{
            width: '100%',
            padding: '7px 38px 7px 10px',
            borderRadius: '6px',
            border: `1.5px solid ${borderColor}`,
            fontSize: '13px',
            boxSizing: 'border-box',
            transition: 'border-color 0.15s',
          }}
        />
        {icon && (
          <span
            style={{
              position: 'absolute',
              right: '10px',
              top: '50%',
              transform: 'translateY(-50%)',
              fontSize: '14px',
              lineHeight: 1,
              pointerEvents: 'none',
            }}
          >
            {icon}
          </span>
        )}
      </div>

      {!isValid && (
        <p style={{ color: '#ef4444', fontSize: '12px', margin: '5px 0 0', lineHeight: 1.4 }}>
          Must be a full Instagram URL — e.g. https://www.instagram.com/yourhandle
        </p>
      )}
    </div>
  );
});

// ─── Branch Detection ─────────────────────────────────────────────────────

// Branch detection: prefer explicit env var, then Vercel's commit ref, then 'main'
const branch =
  process.env.TINA_BRANCH ||
  process.env.VERCEL_GIT_COMMIT_REF ||
  'main';

// ─── TinaCMS Config ───────────────────────────────────────────────────────

export default defineConfig({
  branch,

  // TinaCloud credentials — set as Vercel environment variables.
  // When undefined (local dev), Tina runs in local file-system mode.
  clientId: process.env.TINA_CLIENT_ID,
  token:    process.env.TINA_TOKEN,

  build: {
    outputFolder: 'admin',   // serves the CMS at /admin
    publicFolder: 'public',
  },

  media: {
    tina: {
      mediaRoot:   '',
      publicFolder: 'public',
    },
  },

  schema: {
    collections: [

      // ── 🏠 Hero ─────────────────────────────────────────────────────────
      {
        name:   'hero',
        label:  '🏠 Hero',
        path:   'content',
        format: 'json',
        ui: {
          allowedActions: { create: false, delete: false },
        },
        match: { include: 'hero' },
        fields: [
          {
            name:        'statementPrefix',
            label:       'Statement — opening text',
            type:        'string',
            description: 'Text before "Beyond the Badge" (include trailing space)',
          },
          {
            name:        'statementLine1',
            label:       'Statement — line 1 text (after brand name)',
            type:        'string',
            description: 'Text after "Beyond the Badge" up to the line break (e.g. ", we believe cultural")',
          },
          {
            name:        'statementLine2',
            label:       'Statement — line 2 text',
            type:        'string',
            description: 'Text on the second line (e.g. "relevance isn\'t earned through logos.")',
          },
          { name: 'heroPosterImage', label: 'Hero poster image',   type: 'image' },
          {
            name:        'heroVideoMp4',
            label:       'Hero video — MP4',
            type:        'string',
            description: 'Path to the .mp4 hero video in /public (e.g. /hero.mp4). Leave blank to hide.',
            ui:          { component: VideoMp4Field as any },
          },
          {
            name:        'heroVideoWebm',
            label:       'Hero video — WebM',
            type:        'string',
            description: 'Path to the .webm hero video in /public (e.g. /hero.webm). Leave blank to hide.',
            ui:          { component: VideoWebmField as any },
          },
        ],
      },

      // ── 🏠 Homepage — About section ──────────────────────────────────────
      {
        name:   'homepageAbout',
        label:  '🏠 Homepage — About section',
        path:   'content',
        format: 'json',
        ui: {
          allowedActions: { create: false, delete: false },
        },
        match: { include: 'about-section' },
        fields: [
          {
            name:  'introPrefix',
            label: 'Intro text — before name link',
            type:  'string',
            ui:    { component: 'textarea' },
          },
          { name: 'lauraLinkText', label: 'Link text',  type: 'string' },
          { name: 'lauraLinkHref', label: 'Link URL',   type: 'string' },
          {
            name:  'introSuffix',
            label: 'Intro text — after name link',
            type:  'string',
            ui:    { component: 'textarea' },
          },
          {
            name:  'images',
            label: 'Section images (3)',
            type:  'image',
            list:  true,
          },
        ],
      },

      // ── 📋 Services — Our Approach ───────────────────────────────────────
      {
        name:   'services',
        label:  '📋 Services — Our Approach',
        path:   'content',
        format: 'json',
        ui: {
          allowedActions: { create: false, delete: false },
        },
        match: { include: 'services' },
        fields: [
          { name: 'sectionHeading', label: 'Section heading', type: 'string' },
          {
            name:  'items',
            label: 'Service rows',
            type:  'object',
            list:  true,
            ui:    { itemProps: (item: any) => ({ label: `${item?.number} ${item?.title}` }) },
            fields: [
              { name: 'number',     label: 'Number (e.g. "(01)")',     type: 'string' },
              { name: 'title',      label: 'Title',                    type: 'string' },
              { name: 'beyondText', label: 'Text after "beyond"',      type: 'string' },
              { name: 'category',   label: 'Category tag',             type: 'string' },
              { name: 'image',      label: 'Hover image',              type: 'image'  },
            ],
          },
        ],
      },

      // ── 💬 Testimonials ──────────────────────────────────────────────────
      {
        name:   'testimonials',
        label:  '💬 Testimonials',
        path:   'content',
        format: 'json',
        ui: {
          allowedActions: { create: false, delete: false },
        },
        match: { include: 'testimonials' },
        fields: [
          { name: 'sectionHeading', label: 'Section heading', type: 'string' },
          {
            name:  'items',
            label: 'Testimonials',
            type:  'object',
            list:  true,
            ui: {
              itemProps: (item: any) => ({
                label: item?.name ? `${item.name} — ${item.title || ''}` : 'New testimonial',
              }),
            },
            fields: [
              { name: 'name',    label: 'Name',         type: 'string', isTitle: true, required: true },
              { name: 'title',   label: 'Title / role', type: 'string' },
              {
                name:        'quoteBefore',
                label:       'Quote — opening text',
                type:        'string',
                ui:          { component: 'textarea' },
                description: 'Text before the italic highlight phrase',
              },
              {
                name:        'quoteHighlight',
                label:       'Quote — highlighted phrase (italic)',
                type:        'string',
                description: 'Leave blank for no highlight',
              },
              {
                name:        'quoteAfter',
                label:       'Quote — closing text',
                type:        'string',
                description: 'Text after the italic phrase. A live assembled preview appears below.',
                ui:          { component: QuoteAfterWithPreview as any },
              },
              { name: 'desktopImage', label: 'Portrait — desktop', type: 'image' },
              { name: 'mobileImage',  label: 'Portrait — mobile',  type: 'image' },
              {
                name:  'paragraphs',
                label: 'Full story paragraphs',
                type:  'string',
                list:  true,
                ui:    { component: 'textarea' },
              },
              {
                name:        'popupImages',
                label:       'Full story popup images (max 5)',
                type:        'image',
                list:        true,
                description: 'Shown in the left column of the full story modal',
              },
              {
                name:        'campaignVideoMp4',
                label:       'Campaign video — MP4 path',
                type:        'string',
                description: 'Leave blank to hide the Play button.',
                ui:          { component: VideoMp4Field as any },
              },
              {
                name:        'campaignVideoWebm',
                label:       'Campaign video — WebM path',
                type:        'string',
                description: 'Leave blank to hide the Play button.',
                ui:          { component: VideoWebmField as any },
              },
              {
                name:        'campaignVideoLabel',
                label:       'Campaign video — accessibility label',
                type:        'string',
                description: 'e.g. "Play EON Bond film campaign video"',
              },
            ],
          },
        ],
      },

      // ── ⚡ Capabilities ──────────────────────────────────────────────────
      {
        name:   'capabilities',
        label:  '⚡ Capabilities',
        path:   'content',
        format: 'json',
        ui: {
          allowedActions: { create: false, delete: false },
        },
        match: { include: 'capabilities' },
        fields: [
          { name: 'eyebrow',                label: 'Eyebrow text',            type: 'string' },
          { name: 'defaultBackgroundImage', label: 'Default background image', type: 'image'  },
          {
            name:  'items',
            label: 'Capabilities',
            type:  'object',
            list:  true,
            ui:    { itemProps: (item: any) => ({ label: item?.label }) },
            fields: [
              {
                name:  'key',
                label: 'Key (unique, no spaces)',
                type:  'string',
                ui:    { component: CapabilityKeyField as any },
              },
              { name: 'label',       label: 'Label',             type: 'string' },
              { name: 'img',         label: 'Background image',  type: 'image'  },
              {
                name: 'description',
                label: 'Description',
                type: 'string',
                ui: { component: 'textarea' },
              },
            ],
          },
        ],
      },

      // ── 📣 CTA Section ───────────────────────────────────────────────────
      {
        name:   'cta',
        label:  '📣 CTA section',
        path:   'content',
        format: 'json',
        ui: {
          allowedActions: { create: false, delete: false },
        },
        match: { include: 'cta' },
        fields: [
          {
            name:        'marqueeItems',
            label:       'Marquee items',
            type:        'string',
            list:        true,
            description: 'Services listed in the scrolling ticker tape. Character count shown per tag — aim to keep each under 32 chars.',
            ui:          { component: MarqueeItemField as any },
          },
          { name: 'barText',        label: 'CTA bar text',         type: 'string' },
          { name: 'barButtonLabel', label: 'CTA bar button label', type: 'string' },
          {
            name:  'ctaImages',
            label: 'Slideshow images',
            type:  'image',
            list:  true,
          },
        ],
      },

      // ── 🔄 Process ───────────────────────────────────────────────────────
      {
        name:   'process',
        label:  '🔄 Process',
        path:   'content',
        format: 'json',
        ui: {
          allowedActions: { create: false, delete: false },
        },
        match: { include: 'process' },
        fields: [
          { name: 'heading',          label: 'Heading',                   type: 'string' },
          { name: 'headingHighlight', label: 'Heading highlight (italic)', type: 'string' },
          { name: 'intro',            label: 'Intro text',                type: 'string', ui: { component: 'textarea' } },
          {
            name:  'items',
            label: 'Process cards',
            type:  'object',
            list:  true,
            ui:    { itemProps: (item: any) => ({ label: item?.title }) },
            fields: [
              { name: 'title', label: 'Title',     type: 'string' },
              { name: 'text',  label: 'Body text', type: 'string', ui: { component: 'textarea' } },
            ],
          },
        ],
      },

      // ── 📬 Contact page ──────────────────────────────────────────────────
      {
        name:   'contact',
        label:  '📬 Contact page',
        path:   'content',
        format: 'json',
        ui: {
          allowedActions: { create: false, delete: false },
        },
        match: { include: 'contact' },
        fields: [

          // ── Page header ──────────────────────────────────────────────────
          {
            name:        'eyebrow',
            label:       'Eyebrow tag',
            type:        'string',
            description: 'Small all-caps label above the heading (e.g. "GET IN TOUCH").',
          },
          {
            name:        'headingMain',
            label:       'Heading — main line',
            type:        'string',
            description: 'First line of the large heading.',
          },
          {
            name:        'headingItalic',
            label:       'Heading — italic line',
            type:        'string',
            description: 'Second line rendered in the italic serif font.',
          },
          {
            name:  'subtext',
            label: 'Intro paragraph',
            type:  'string',
            ui:    { component: 'textarea' },
            description: 'The short paragraph beneath the heading on the left side.',
          },

          // ── Contact details ──────────────────────────────────────────────
          {
            name:        'phone',
            label:       'Phone number',
            type:        'string',
            description: 'Display value shown on the page (e.g. "+4473 4202 6099"). Spaces are stripped automatically for the tel: link.',
          },
          {
            name:  'email',
            label: 'Email address (shown on page)',
            type:  'string',
            ui:    { component: EmailField as any },
            description: 'Email shown as a clickable link on the contact page. Should match Global Settings → Contact email.',
          },

          // ── Form fields (grouped) ────────────────────────────────────────
          {
            name:   'form',
            label:  'Form fields',
            type:   'object',
            fields: [
              { name: 'nameLabel',          label: 'Name — label',                    type: 'string' },
              { name: 'namePlaceholder',    label: 'Name — placeholder text',          type: 'string' },
              { name: 'emailLabel',         label: 'Email — label',                   type: 'string' },
              { name: 'emailPlaceholder',   label: 'Email — placeholder text',         type: 'string' },
              { name: 'companyLabel',       label: 'Company — label',                 type: 'string' },
              { name: 'companyPlaceholder', label: 'Company — placeholder text',       type: 'string' },
              { name: 'messageLabel',       label: 'Message — label',                 type: 'string' },
              {
                name:  'messagePlaceholder',
                label: 'Message — placeholder text',
                type:  'string',
                ui:    { component: 'textarea' },
              },
              {
                name:        'privacyNote',
                label:       'Privacy note',
                type:        'string',
                description: 'Small text shown above the submit button.',
                ui:          { component: 'textarea' },
              },
              { name: 'submitLabel', label: 'Submit button text', type: 'string' },
            ],
          },

          // ── Success state ────────────────────────────────────────────────
          {
            name:        'successHeadline',
            label:       'Success headline',
            type:        'string',
            description: 'Large italic text shown after the form is submitted successfully.',
          },
          {
            name:  'successSub',
            label: 'Success subtext',
            type:  'string',
            ui:    { component: 'textarea' },
            description: 'Smaller text shown below the success headline.',
          },

          // ── SEO ──────────────────────────────────────────────────────────
          {
            name:        'pageTitle',
            label:       'Page title (browser tab / SEO)',
            type:        'string',
            description: 'Shown in the browser tab and search engine results.',
          },
          {
            name:  'pageDescription',
            label: 'Meta description (SEO)',
            type:  'string',
            ui:    { component: 'textarea' },
            description: 'Used by search engines. Aim for 120–160 characters.',
          },

        ],
      },

      // ── ⚙️ Global settings ───────────────────────────────────────────────
      {
        name:   'globalSettings',
        label:  '⚙️ Global settings',
        path:   'content',
        format: 'json',
        ui: {
          allowedActions: { create: false, delete: false },
        },
        match: { include: 'global' },
        fields: [
          {
            name:  'contactEmail',
            label: 'Contact email',
            type:  'string',
            ui:    { component: EmailField as any },
          },
          {
            name:  'instagramUrl',
            label: 'Instagram URL',
            type:  'string',
            ui:    { component: InstagramUrlField as any },
          },
          { name: 'copyrightText', label: 'Copyright text', type: 'string' },
        ],
      },

    ],
  },
});
