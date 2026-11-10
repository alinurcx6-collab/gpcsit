# GPCS launch checklist

Work through this top to bottom before sharing the site publicly. Items marked **required** should not be skipped.

## 1. Verify it works
- [ ] **Required:** `npm run build` passes locally, and the GitHub Actions CI run is green.
- [ ] **Required:** run migrations `0001` to `0005` on the production Supabase project, in order.
- [ ] Click through every environment signed in and signed out: register, create research, add a source, create a project and tasks, create a workspace, join with a second account, send a message, save an item, report an item.
- [ ] **Required:** privacy test with two accounts. Account B must not be able to open Account A's private research, project or workspace by URL, and must not see its documents.

## 2. Email (Supabase's built-in sender is rate-limited and for testing only)
- [ ] **Required:** Authentication → SMTP Settings → connect a real provider (Resend, Postmark, SendGrid, Amazon SES). Use a domain you own and add SPF, DKIM and DMARC records.
- [ ] Authentication → Email Templates: set a clear sender name and keep the link-based templates (`{{ .ConfirmationURL }}`). The app has no field for typing a numeric code.
- [ ] Decide whether to require email confirmation (Authentication → Providers → Email). For a public launch, keep it on.

## 3. Domain and URLs
- [ ] Deploy to Vercel or Netlify (see README) and set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
- [ ] Attach your custom domain.
- [ ] **Required:** Supabase → Authentication → URL Configuration: set **Site URL** to the live address and add it, plus `/**`, to **Redirect URLs**. Remove `localhost` entries you no longer need.

## 4. Abuse protection
- [ ] **Required:** Authentication → Attack Protection: turn on CAPTCHA (Cloudflare Turnstile or hCaptcha). Note: the sign-up form would then need the captcha token added in code.
- [ ] Authentication → Rate Limits: review sign-up, sign-in and email limits.
- [ ] Per-account rate limits on posting are already in migration `0005`. Adjust the numbers there if they are too tight or too loose.
- [ ] Decide who moderates. Reports land in the `reports` table. Review them with:
  ```sql
  select r.created_at, r.target_type, r.target_id, r.reason, r.details, p.username as reporter
  from reports r join profiles p on p.id = r.reporter_id
  where r.status = 'open' order by r.created_at;
  ```
  To hide reported research or a project, set `visibility = 'private'`. Mark handled reports: `update reports set status = 'actioned' where id = '…';`.

## 5. Data safety
- [ ] **Required:** confirm backups. Supabase Pro includes daily backups and optional point-in-time recovery. The free plan has no backups you can rely on.
- [ ] Keep the `service_role` key out of the frontend and out of GitHub. Only the anon key is used by the app.
- [ ] Choose the Supabase region closest to most users, because it cannot be changed later.

## 6. Legal
- [ ] **Required:** have a lawyer review `Terms`, `Privacy` and `Community Guidelines` for the countries you serve. They are plain-language drafts, not legal advice. GDPR (EU/UK), and local rules elsewhere, may need extra details such as a named data controller and address.
- [ ] Set `VITE_CONTACT_EMAIL` so the legal pages show a working contact address.
- [ ] Pick a software license for the code (see the `LICENSE` question) if the repository is public.

## 7. Monitoring
- [ ] Add error tracking (for example Sentry) and uptime monitoring.
- [ ] Watch Supabase usage (database size, storage, monthly active users) so plan limits do not surprise you.

## 8. Known gaps (not done yet)
- **Languages:** the interface is English only. A global launch will want translations (react-i18next is the usual choice).
- **Search:** uses simple text matching. For large volumes, add Postgres full-text search or a search service.
- **Moderation tools:** review happens in the Supabase dashboard. A small admin page would be a good next step.
- **Content Security Policy:** basic security headers are set. A strict CSP should be tested against the live site before enabling.
- **Automated tests:** only utility functions have tests. Add end-to-end tests (Playwright) for sign-up and the main flows.
