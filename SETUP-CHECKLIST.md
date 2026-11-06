# Setup checklist — Naama Melzer portfolio refresh

## Before publishing
1. Open a Vercel Preview deployment for branch `website-refresh-2026-11` and review desktop and mobile.
2. In Vercel, open the project Analytics section and enable Web Analytics. Static HTML tracking is included on the home, video and contact pages. Vercel Hobby currently includes 50,000 Web Analytics events/month (page views; custom events are not included).
3. The contact form uses FormSubmit's free AJAX endpoint and sends to `naamamelzer@gmail.com`. The mailbox owner must click the one-time activation link sent by FormSubmit. Check Inbox and Spam.
4. After activation, submit a second test message and confirm it arrives. Reply to it to verify the sender address is in Reply-To.
5. Confirm WhatsApp and telephone links open `+972528644592`.
6. Test link previews and the full contact flow before merging this branch into production.

## Notes
- No EmailJS SDK, server function, API key, password or `.env` file is needed for this form.
- FormSubmit may use reCAPTCHA and spam filtering; the form also has a honeypot.
- The success state appears only after a successful AJAX response.
- `archive-original/` holds an unchanged snapshot of all tracked source files; `.vercelignore` excludes it from deployments.
