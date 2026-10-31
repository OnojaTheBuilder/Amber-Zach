# Amber's Dream: website

A fast, static, multi-page site. No build step, no dependencies. Open `index.html` to preview,
or drop the folder on Vercel, Netlify or any static host.

## Pages
Home, How it works (with the rules), Prizes (with charity and winners), Enter (3-step entry wizard), FAQ,
About (our story and contact), and a 404. Old addresses (#rules, #winners, #contact, #readers) still work and
land on the right page. All pages use hash routes, so no server setup is needed.

## Where to edit things
- `js/content.js`: all contest facts (fee, deadline, rules table, FAQ answers, steps, genres, contact email).
  Change the deadline once and it updates everywhere.
- `js/pages.js`: page layouts and wording.
- `css/styles.css`: colors and type (see the `:root` block at the top).
- `assets/logo.png`: swap in the final logo (keep the filename, or update the path in `js/pages.js`).

## Before going live (not connected yet)
The site is a complete front end. These three things are placeholders:

1. **Payments.** The entry wizard shows a payment step, but charges nothing. Connect Stripe Checkout or PayPal
   (use a payment link or hosted checkout so card details never touch this site). The payment account must be
   in the contest owner's name.
2. **File uploads and form emails.** `AD.submit()` in `js/forms.js` is the single place to connect a backend
   (for example Formspree, Netlify Forms, or a small serverless function that saves the two pages and emails the owner).
   When connected, set `demo: false` in `js/content.js` to remove the "Preview build" notes.
3. **Placeholders in [square brackets]**: contact email, charity name, prize amounts, file rules, eligibility,
   how readers score entries. Search the project for `[` to find them. These need the contest owner's answers.

## Notes
- The deadline in `content.js` is Mar 31, 2027 (the owner asked for the end of March 2027).
- Fonts (Kaushan Script, Courier Prime, Lora) load from Google Fonts. If offline, readable fallbacks are used.
- Motion respects the "reduce motion" setting. Keyboard focus, skip link and form labels are included.
- Entry fees and the 5% charity line in the prize slider are an illustration, not a prize promise.


## Update, October 30
- Light turquoise theme with little brown or black, new logo (transparent background) on the home page with FADE IN and FADE OUT sheets.
- Pages merged from 10 to 6; reader application form removed for now (can be added back later).
- Charity text: the first contest assists struggling single mothers. Membership fee range shown as $35 to $95.
- Contest email is still the placeholder `[contest email address]` in `js/content.js` (AD.config.email).
