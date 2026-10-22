# 0002 — Contact form without JavaScript posts to the home route

Date: 2026-10-22 · Status: accepted · PRD §9.4

## Context
PRD §9.4 step 6 asks for field errors with kept values when JavaScript is off. A resource
route (`/api/contact`) cannot render the home page with errors.

## Decision
- With JavaScript, the form submits to `POST /api/contact` through a fetcher and shows an
  inline success state.
- The form's native `action` is `/?index`, so without JavaScript the browser posts to the home
  route's `action`. It runs the same `handleContactSubmission`, re-renders the page with field
  errors and values on failure, and redirects to `/?sent=1#contact` on success.
- Turnstile needs JavaScript, so a no-JS submission that passes validation is rejected at the
  Turnstile step with a message pointing to the email address. We keep Turnstile as the primary
  defence (PRD §9.4) rather than accept unverified posts.
