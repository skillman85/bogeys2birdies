# Comment approval notifications

New comments are saved to Sanity with a `pending` status. After the save succeeds, the server sends an approval notification email through Resend. Email failures are logged but never discard the reader's comment.

## One-time setup

1. Create or sign in to a Resend account and add `bogeys2birdies.co.uk` as a sending domain.
2. Add the DNS records supplied by Resend to the domain, then wait until Resend marks the domain as verified.
3. Create a Resend API key with sending access.
4. Add these variables to the Vercel project for the Production environment:

```env
RESEND_API_KEY=re_replace_with_the_real_key
COMMENT_NOTIFICATION_EMAIL=hello@bogeys2birdies.co.uk
COMMENT_NOTIFICATION_FROM=Bogeys2Birdies <comments@bogeys2birdies.co.uk>
SANITY_STUDIO_URL=https://bogeys2birdies.sanity.studio/structure/comment
```

5. Redeploy the latest production deployment so the variables are available to the comment API.

`RESEND_API_KEY` is server-only. Never prefix it with `NEXT_PUBLIC_`, paste it into client code, or commit its real value to Git.

For local testing, add the same variables to `.env.local`, which is ignored by Git. Resend may initially restrict recipients until the sending domain is verified.
