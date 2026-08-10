# Dirt Girls Garden Design — Website

A vanilla HTML, CSS, and JavaScript website for Dirt Girls Garden Design, a woman-owned
landscape design business in St. Petersburg, Florida, specializing in sustainable,
Florida-native plant landscapes.

## Structure

```
dg_website_vanilla/
├── index.html              # Home
├── portfolio.html          # Portfolio (with lightbox)
├── services.html           # Services — Consultation, Design, Installation
├── contact.html            # Contact form + details
├── DEPLOY.md               # VPS deployment guide (Nginx, SSL, DNS)
├── css/
│   └── styles.css          # All styles and design tokens
├── js/
│   ├── navigation.js       # Mobile nav drawer
│   ├── gallery.js          # Portfolio lightbox
│   └── contactForm.js      # Contact form validation + submission
└── assets/
    └── images/             # Logo, transparent footer logo, photos, hero-garden
```

## Running locally

Open `index.html` directly in a browser, or serve the folder with any static server:

```bash
npx serve .
# or
python -m http.server 8000
```

## Configuration

### Contact form (Web3Forms)

The contact form submits to [Web3Forms](https://web3forms.com) via AJAX,
which forwards submissions directly to `dirtgirlsdesigns@gmail.com`. No signup
or backend server is required.

The form's `action` is already configured in `contact.html`:

```html
<form ... action="https://api.web3forms.com/submit" ...>
```
The access key is provided as a hidden field in `contact.html`:

```html
<input type="hidden" name="access_key" value="8c0f2733-2ece-413c-acfc-e7cbd12ebd72">
```

The access key is not secret — it is safe to expose in client-side code and acts as an alias for the delivery email address. It can be managed from the [Web3Forms dashboard](https://web3forms.com).

The subject hidden field controls the email subject line. A hidden botcheck honeypot field provides basic spam protection. See `contactForm.js` for the AJAX submission logic.

### Social media links

In `contact.html`, replace the `href="#"` placeholders in the `.contact-social` block
with the real Dirt Girls Instagram and Facebook URLs.

## Design notes

- **Brand colors** (sampled from the logo): pink `#E886B5`, green `#45734D`.
- **Fonts:** Cormorant Garamond (headings) + Lato (body), loaded from Google Fonts.
- **Watermarks:** the hero-garden image is used as a background in page headers
  across all pages, cropped to the upper portion (butterfly and caterpillar).

## Deployment

The site is fully static. For Contabo VPS deployment with Nginx, SSL, and DNS
instructions, see **[DEPLOY.md](DEPLOY.md)**.

Alternatively, the `dg_website_vanilla/` folder can be deployed to any static
host (Netlify, Cloudflare Pages, Vercel, GitHub Pages). Point the
`dirtgirlsgardendesign.com` domain at the host once deployed.
