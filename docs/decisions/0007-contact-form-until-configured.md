# 0007 — Contact form refuses messages until storage and inbox exist

Date: 2026-10-23 · Status: accepted · PRD §9.4

## Context
The first Workers deploy happens before the D1 database exists (the deploy token had no D1
permission) and before `CONTACT_INBOX` is set. The handler would otherwise either crash on the
insert or tell the visitor "message received" for a message nobody can read.

## Decision
`processContactRequest` checks for a D1 binding and a non-empty `CONTACT_INBOX`. If either is
missing it returns `rejected / unavailable`, and the form asks the visitor to email
hello@veek.me instead. Once both exist the normal flow (PRD §9.4) runs with no code change.
