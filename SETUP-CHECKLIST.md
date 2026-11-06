# Setup checklist — Naama Melzer portfolio refresh

## 1. Contact form (one-time activation)
1. The form sends enquiries to `naamamelzer@gmail.com` using FormSubmit's free AJAX endpoint.
2. The Gmail owner must click the one-time activation link sent by FormSubmit. Check Inbox and Spam.
3. After activation, submit a test message and confirm it arrives in Gmail. Reply to the message and verify that the sender's address is used for Reply-To.
4. The form includes a honeypot and leaves FormSubmit's default spam protection enabled.

## 2. Analytics (free, privacy-first)
1. Create/sign in to a Cloudflare account.
2. Open **Web Analytics** and choose **Add a site**.
3. Enter `naamamelzer.studio` as the hostname and complete the setup. Do not change DNS or turn on Cloudflare proxy for the domain.
4. Open **Manage site** and copy the generated JavaScript beacon snippet.
5. Replace the Cloudflare comment at the end of each active page — `index.html`, `Video.html` and `ContactUs.html` — with that exact snippet. The same root-domain tag works for its www subdomain.
6. Commit and deploy this branch again. Check the Cloudflare Web Analytics dashboard after traffic arrives.

Cloudflare Web Analytics is free and does not collect or use visitors' personal data, according to Cloudflare's documentation. Manual snippet setup supports sites that are not proxied through Cloudflare.

## 3. Preview and launch
1. Review the Vercel Preview for branch `website-refresh-2026-11` on desktop and mobile.
2. Confirm WhatsApp and telephone links open `+972528644592`.
3. Confirm the form sends a message after FormSubmit activation.
4. Check page titles, descriptions, and social sharing previews.
5. Only after approval, merge this branch into `main` to publish the changes.

## Notes
- The old EmailJS integration has been removed. No EmailJS SDK, API key or server function is required for the new form.
- `archive-original/` contains an unchanged snapshot of all 57 original tracked files. `.vercelignore` excludes that folder from Vercel deployments while preserving it in GitHub.
- Art Design and Costume Design files remain in the repository but are hidden from active navigation and marked `noindex, nofollow`.
- No credentials, API keys, passwords or `.env` files were added.
