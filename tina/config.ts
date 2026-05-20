import { defineConfig } from 'tinacms';

// Branch detection: prefer explicit env var, then Vercel's commit ref, then 'main'
const branch =
  process.env.TINA_BRANCH ||
  process.env.VERCEL_GIT_COMMIT_REF ||
  'main';

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
          router: () => '/',
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
          { name: 'heroVideoMp4',   label: 'Hero video — MP4',    type: 'image' },
          { name: 'heroVideoWebm',  label: 'Hero video — WebM',   type: 'image' },
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
          router: () => '/',
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
          router: () => '/',
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

      // ── ⚡ Capabilities ──────────────────────────────────────────────────
      {
        name:   'capabilities',
        label:  '⚡ Capabilities',
        path:   'content',
        format: 'json',
        ui: {
          allowedActions: { create: false, delete: false },
          router: () => '/',
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
              { name: 'key',         label: 'Key (unique, no spaces)',  type: 'string' },
              { name: 'label',       label: 'Label',                    type: 'string' },
              { name: 'img',         label: 'Background image',         type: 'image'  },
              { name: 'description', label: 'Description',              type: 'string', ui: { component: 'textarea' } },
            ],
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
          router: () => '/',
        },
        match: { include: 'process' },
        fields: [
          { name: 'heading',          label: 'Heading',                 type: 'string' },
          { name: 'headingHighlight', label: 'Heading highlight (italic)', type: 'string' },
          { name: 'intro',            label: 'Intro text',              type: 'string', ui: { component: 'textarea' } },
          {
            name:  'items',
            label: 'Process cards',
            type:  'object',
            list:  true,
            ui:    { itemProps: (item: any) => ({ label: item?.title }) },
            fields: [
              { name: 'title', label: 'Title', type: 'string' },
              { name: 'text',  label: 'Body text', type: 'string', ui: { component: 'textarea' } },
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
          router: () => '/',
        },
        match: { include: 'cta' },
        fields: [
          {
            name:        'marqueeItems',
            label:       'Marquee items',
            type:        'string',
            list:        true,
            description: 'Services listed in the scrolling ticker tape',
          },
          { name: 'barText',        label: 'CTA bar text',          type: 'string' },
          { name: 'barButtonLabel', label: 'CTA bar button label',  type: 'string' },
          {
            name:  'ctaImages',
            label: 'Slideshow images',
            type:  'image',
            list:  true,
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
          router: () => '/',
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
              { name: 'name',    label: 'Name',       type: 'string', isTitle: true, required: true },
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
                name:  'quoteAfter',
                label: 'Quote — closing text',
                type:  'string',
                ui:    { component: 'textarea' },
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
                label:       'Campaign video — MP4 path (leave blank to hide Play button)',
                type:        'string',
                description: 'e.g. /wenborn-campaign.mp4',
              },
              {
                name:        'campaignVideoWebm',
                label:       'Campaign video — WebM path',
                type:        'string',
                description: 'e.g. /wenborn-campaign.webm',
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

      // ── ⚙️ Global settings ───────────────────────────────────────────────
      {
        name:   'globalSettings',
        label:  '⚙️ Global settings',
        path:   'content',
        format: 'json',
        ui: {
          allowedActions: { create: false, delete: false },
          router: () => '/',
        },
        match: { include: 'global' },
        fields: [
          { name: 'contactEmail',  label: 'Contact email',  type: 'string' },
          { name: 'instagramUrl',  label: 'Instagram URL',  type: 'string' },
          { name: 'copyrightText', label: 'Copyright text', type: 'string' },
        ],
      },

    ],
  },
});
