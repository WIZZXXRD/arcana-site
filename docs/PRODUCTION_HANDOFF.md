# Production handoff — unresolved requirements

The owner has approved this early public website preview for sharing with friends. Preview publication does not constitute the Android app commercial launch or legal approval. The separate Android repository is outside this release scope. The app is not publicly available on Google Play. No Google authentication, billing, cloud or deletion infrastructure has been provisioned or certified by this work.

## Operator/legal approval

Both language versions visibly carry a review notice and no effective date. Before app release, an authorized operator/legal reviewer must approve and supply:

- Legal operator/controller identity and approved privacy/support/deletion contacts. Wrong Wizard is a developer brand, not an invented legal entity. Do not publish personal email without explicit approval.
- Effective date, supported countries, minimum age and children's/audience policy.
- Lawful bases, rights and request procedures, consent, incident handling, processors and international transfer terms.
- Implemented retention periods and operational TTL, log/backup regions, retention, access controls, deletion propagation and restore procedures. Code-level expiry is not instant erasure of every backup.
- Support, refund and dispute procedures, governing law, mandatory consumer rights, acceptable use, termination, warranties and qualified liability terms.
- Consistency of final SDK versions/regions/consent/collection with the Privacy Policy and submitted Google Play Data Safety questionnaire.
- Final bilingual editorial accuracy and artwork/content provenance acceptance for the Android app. Website SVGs are original and do not establish provenance for Android assets.

Do not turn these pending items into confident published legal guarantees. The review drafts may be hosted for review, but the website is not a substitute for operator approval.

## External authenticated deletion — NOT IMPLEMENTED

Public informational pages are implemented:

- `https://wizzxxrd.github.io/arcana-site/account-deletion.html`
- `https://wizzxxrd.github.io/arcana-site/ru/account-deletion.html`

The integration placeholder is `#web-deletion-integration` on each page. It is an informational panel, with no form, endpoint call, credential collection or success claim. GitHub Pages cannot process authenticated deletion. Publishing this page alone does not complete the external request requirement.

A separately authorized production project must:

1. Define and review the web identity/session protocol. The mobile service contract uses device proof and a session created within five minutes at `/v1/account/delete`; do not simply POST an ID/email from a public site. A web-specific trusted session/proof design is needed.
2. Integrate genuine Google authentication for the correct Arcana identity, verify issuer/audience/signature/expiry/nonce server-side, and require recent sign-in. Keep OAuth secrets, service credentials and tokens off GitHub Pages and out of this repository.
3. Provide HTTPS, protected session handling, CSRF/state and replay defenses, explicit origin/CORS policy, rate/abuse limits, redacted logs and access control. Do not authorize by email, public account ID or purchase token alone.
4. Show deletion scope, local-device limitations, temporary retention and subscription warning before explicit confirmation. Use accessible EN/RU loading, cancellation, error/retry and final-result states.
5. Connect to authoritative deletion of live account index, indexed sessions, purchase ciphertext/ownership/replacement data and observations. Ensure delayed purchase events cannot resurrect the account; approve TTL, backups and deletion propagation.
6. Return success only after the real service confirms completion; distinguish server completion, local-cleanup failure and unavailable service. Test wrong-account requests, stale/replayed sessions, concurrent requests, outages and delayed events against configured services.
7. Make clear that a web flow cannot remotely erase another device's Journal, cancel Play subscriptions or delete the Google account. Provide Play management guidance before deletion.
8. Deploy and independently validate the secure flow, publish its approved URL and operator contact, then replace the panel with a truthful link to that flow. Configure the Android deletion URL only through the separate release process.

There is no email fallback because none is approved. The current page documents the Android Profile deletion flow with explicit production-service availability qualifications. It never implies an external request has been submitted.

## Product boundaries to retain

Google-only authentication is mandatory. Free local content may work offline with a validated session up to 30 days; no immediate offline revocation promise. Premium is separately verified online, memory-only at most 15 minutes/subscription expiry. Purchase recovery is account-bound and depends on authoritative Play binding and retained/rediscovered records. Journal and local inputs do not upload to account/advertising services, but authentication/billing/UMP/AdMob and cloud metadata are separate network processing. Journal has no cloud sync or reinstall/new-device recovery and no extra database encryption. Device backup/transfer excludes local stores. Account deletion does not cancel subscriptions. No public Play listing, hardcoded price, trial or launch date has been invented.
