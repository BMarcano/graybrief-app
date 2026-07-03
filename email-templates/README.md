# GrayBrief — Supabase auth email templates

Branded templates for the auth emails sent from `Hello@graybrief.com`.
Copy uses Ashley's requested wording, signed "— The GrayBrief Team".

## How to apply

In the Supabase Dashboard (the GrayBrief project) → **Authentication → Emails → Templates**:

| Template | File | Suggested subject |
|---|---|---|
| Confirm sign up | `confirm-signup.html` | `Welcome to GrayBrief — confirm your email` |
| Reset password | `reset-password.html` | `Reset your GrayBrief password` |

Paste the full file contents into the **Message body (HTML)** field (the HTML comments at
the top are harmless, but you can strip them). Save, then send yourself a test signup and
a test reset to confirm rendering in Gmail.

`{{ .ConfirmationURL }}` is the Supabase template variable for the action link — leave it as is.

## Logo

Both templates load the wordmark from `https://app.graybrief.com/email-logo.png`
(the file lives in `public/email-logo.png` and deploys with the app), with "GrayBrief"
as styled alt text if the client blocks images.

**Note:** if a text-logo version of these templates was pasted earlier, re-paste the
current files so the emails pick up the image logo.
