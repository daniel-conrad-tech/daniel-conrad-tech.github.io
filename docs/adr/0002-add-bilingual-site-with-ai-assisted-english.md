---
title: "ADR 0002: Add Bilingual Site with AI-Assisted English"
adr: 2
status: accepted
date: 2026-06-16
---

# ADR 0002: Add Bilingual Site with AI-Assisted English

## Context

The site is currently written in German and serves a public audience through
GitHub Pages.

There is now a clear need to offer an English version as well:

- some visitors will not read German
- the site should remain approachable for international readers
- the implementation should stay lightweight and compatible with static hosting
- the English version should be transparent about being AI-assisted

The language switch should feel visible and intentional without introducing a
large internationalization framework.

## Decision

We will add a bilingual German and English experience to the existing static
site.

The implementation should follow these rules:

- German remains the primary source language.
- English is offered as an AI-assisted translation layer.
- The site should not hard-redirect users based on browser language.
- Browser language may be used to suggest English, but the user keeps control.
- The selected language should be remembered locally in the browser.

## Language Switch UI

The language switch may use the German and US flags as visual shortcuts, but
not as the only language signal.

The switch should therefore include:

- a German flag for the German version
- a US flag for the English version
- hover text that clearly explains the action of each switch
- accessible labels that identify the actual language, not just the country

This means the flags are treated as interface symbols, not as sufficient
language identifiers on their own.

## Translation Transparency

When English is active, the site should show a visible but unobtrusive notice
that the English version is AI-assisted and may contain minor inaccuracies.

The notice should:

- be placed in or near the language switch area
- be easy to understand at a glance
- avoid sounding defensive or distracting

## Why

This approach is a good fit for the project for the following reasons:

- it expands accessibility without requiring a second site
- it stays consistent with the repository's pragmatic scope
- it preserves a single static deployment model
- it gives international readers useful access while remaining honest about translation quality
- it avoids aggressive redirects that often feel wrong or brittle

## Technical Direction

The first implementation should remain lightweight:

- keep one static page
- store German and English copy in a simple local translation structure
- use a small JavaScript layer to swap visible text
- use browser language only for initial suggestion logic
- persist the selected language in local storage

## Consequences

### Positive

- international visitors can understand the site more easily
- the site remains easy to host on GitHub Pages
- the implementation cost stays low
- the German source remains authoritative
- the UI makes translation status explicit

### Negative

- English content can drift if German copy changes and translation is not updated
- even with flags and tooltips, some users may still read flags as country markers
- a translation layer adds a small amount of client-side complexity

## Alternatives Considered

### German only

Rejected.

This keeps the site simpler, but unnecessarily limits accessibility for
non-German readers.

### Separate English site or subdomain

Rejected for now.

This would increase maintenance cost and add structural complexity that is not
yet justified by the scope of the site.

### Automatic redirect to English for non-German browsers

Rejected.

This removes user control and increases the chance of wrong or annoying
behavior.

### Flag-only language switch

Rejected.

Flags alone are not clear enough as language controls and should be supported by
hover text and accessible labels.

## Follow-up

Implementation should define:

- the translation data structure
- the DOM strategy for swapping copy
- the exact wording of the English AI-translation notice
- the visual design of the language banner and switch
