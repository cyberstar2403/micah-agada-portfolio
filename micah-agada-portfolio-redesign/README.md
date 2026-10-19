# Micah Agada — Portfolio

A responsive single-page portfolio in plain HTML, CSS and vanilla JavaScript. No build step, no dependencies (Google Fonts only, with system fallbacks).

## Preview
1. Keep `index.html`, `style.css`, `script.js` and the `assets/` folder together.
2. Double-click `index.html`, or open the folder in VS Code and use Live Server.
   Optional: `python3 -m http.server 8000` in this folder, then visit http://localhost:8000

## Still needed from the owner
- **Sharesat image quality** — `assets/sharesat.jpg` is only 325×703px, so it looks soft when enlarged. Export it from Figma at 2× or 3× and replace the file (same name).
- **WhatsApp number** — the WhatsApp icon is hidden until a confirmed number is set. In `script.js`, set `WHATSAPP_NUMBER` (digits only, international format, e.g. `234XXXXXXXXXX`). The phone icon currently calls `+234 814 860 6250`; please confirm that number and whether it is on WhatsApp.
- Replace `assets/micah-portrait.webp` with a professional square portrait (plain background, eye contact; about 800×800).
- Confirm permission to publish each artwork (some show third-party brand names and phone numbers). Unused originals (crypto, birthday, bursary posters) remain in `assets/`.

## Enquiry form and email
- The email icon opens a compose window addressed to Micah (Gmail on computers, the mail app on phones), like the WhatsApp icon opens a chat.
- "Email Micah" validates the form, then opens a ready-written message with the visitor's details. The visitor presses Send.
- **To send straight to Micah's inbox with no extra step**, a form service is needed (a website cannot send email by itself). Free route: create a form at formspree.io using micahagada8@gmail.com, copy its URL, and paste it into `FORM_ENDPOINT` at the top of `script.js`. The button then becomes "Send enquiry" and shows a real success or failure message.

## Files
- `index.html`, `style.css` (design tokens at the top), `script.js`
- `assets/micah-portrait.webp` — square crop of `micah.jpg` used in the hero (original kept)
