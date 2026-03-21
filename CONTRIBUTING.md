# Contributing to 1AM App Registry

Thanks for your interest in listing your DApp on 1AM Wallet!

## Quick Start

1. **Fork** this repository
2. **Edit** `registry.json` — add your app to the `apps` array
3. **Submit** a pull request

## Submission Template

Copy this and fill in your details:

```json
{
  "id": "my-app",
  "name": "My App",
  "description": "A brief description of what my app does on Midnight",
  "icon": "https://my-app.com/icon-128.png",
  "url": "https://my-app.com",
  "category": "defi",
  "networks": ["preview"],
  "new": true
}
```

## Checklist

Before submitting, make sure:

- [ ] `id` is unique, lowercase, alphanumeric + hyphens only
- [ ] `name` is 40 characters or less
- [ ] `description` is 120 characters or less
- [ ] `icon` is HTTPS, 128x128px PNG or SVG, under 50KB
- [ ] `url` is HTTPS and publicly accessible
- [ ] `category` is one of: `defi`, `tools`, `gaming`, `social`, `nft`, `other`
- [ ] `networks` lists at least one supported network
- [ ] Your app implements the Midnight DApp Connector API (v4.0+)
- [ ] Your app works with the 1AM Wallet
- [ ] `registry.json` is valid JSON (run `npx jsonlint registry.json`)
- [ ] Do NOT set `featured` — this is managed by maintainers

## What Happens Next

1. We review your PR within 24 hours
2. We test your app with 1AM Wallet
3. If approved, we merge and your app appears in the wallet within 1 hour
4. New apps get a "New" badge for 30 days

## Updating Your Listing

Submit a PR with the updated fields. Same review process applies.

## Removing Your Listing

Submit a PR removing your entry, or email team@1am.xyz.

## Questions?

- Open an [issue](https://github.com/webisoftSoftware/1AM-app-registery/issues)
- Email [team@1am.xyz](mailto:team@1am.xyz)
