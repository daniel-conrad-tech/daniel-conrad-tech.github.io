---
title: "ADR 0001: Adopt Tailwind CSS for Styling"
adr: 1
status: accepted
date: 2026-06-08
---

# ADR 0001: Adopt Tailwind CSS for Styling

## Context

This repository is a public GitHub Pages site with a static HTML/CSS setup.

The current CSS is small and readable, but a few needs are becoming clearer:

- The site should scale beyond a one-page landing page.
- Mobile behavior should be intentional, not an afterthought.
- Typography, spacing, and component rhythm should follow a reusable system.
- Design decisions should be easy to express without growing a large hand-written CSS file.
- The site must remain compatible with GitHub Pages and static hosting.

Tailwind CSS is being considered because it provides a strong abstraction for spacing, typography, layout, and responsive variants while still producing static assets for deployment.

An additional concern has become explicit: the project should make styling decisions pragmatically, with a clear bias toward time, cost, and maintenance efficiency. The styling approach should narrow the decision space enough to keep effort proportional to the value of the site.

## Decision

We will adopt Tailwind CSS as the primary styling layer for this repository.

The implementation should follow these rules:

- Tailwind is used to express layout, spacing, typography, color, and responsive behavior.
- The site remains a static GitHub Pages project.
- Tailwind output is compiled into a normal CSS file before deployment.
- Tailwind is used first as a constraint system, and the project's visual system is built within that constraint space.
- The repository should keep a small set of design tokens in Tailwind configuration rather than scattering one-off values through markup.
- Custom CSS should be used only where Tailwind utilities are not the clearest or most maintainable option.
- We will prefer Tailwind defaults and conventions before inventing custom abstractions.
- We will make styling choices with explicit attention to implementation time, maintenance cost, and practical benefit.

## Why

Tailwind is a good fit for this project for the following reasons:

- It gives a clear abstraction for design decisions instead of ad hoc CSS growth.
- It makes responsive behavior easier to apply consistently.
- It supports a reusable typographic and spacing system.
- It works well for a site that may grow with more sections or pages.
- It stays compatible with static hosting because the final result is still plain CSS.
- It reduces upfront design and implementation cost while still leaving room for a strong visual result.
- It allows the design system to emerge incrementally, based on actual needs and payoff.

## Build and Deploy Approach

The project should use a simple build workflow:

- Source files use Tailwind classes.
- Tailwind compiles to a generated CSS file committed or deployed as a static asset.
- GitHub Pages serves the generated HTML, CSS, and assets only.

This means GitHub Pages does not need to execute Tailwind itself.

## Implementation Notes

The repository now uses this concrete setup:

- `assets/css/tailwind.css` is the Tailwind source file.
- `assets/css/style.css` is the generated stylesheet served by GitHub Pages.
- `package.json` defines `build:css` and `dev:css` scripts.
- Generated CSS is kept in the repository so GitHub Pages can serve it directly as a static asset.

## Consequences

### Positive

- Faster iteration on layout and visual structure.
- Stronger consistency in spacing and typography.
- Better mobile-first discipline.
- Easier future expansion without rewriting the styling approach.
- Better alignment between implementation effort and practical value.

### Negative

- A build step becomes necessary.
- HTML can become denser with utility classes.
- Team discipline is needed to avoid inconsistent utility usage.

## Alternatives Considered

### Keep hand-written CSS only

Rejected for now.

This keeps the project simple, but it becomes harder to maintain a consistent system as the site grows.

### Use a component or JS framework first

Rejected for now.

The current project does not need React, Vue, or a larger application framework just to improve styling discipline.

### Maintain separate mobile and desktop versions

Rejected.

This would increase maintenance cost and weaken the single-source responsive model that fits GitHub Pages better.

## Follow-up

Next evolution should focus on:

- refining the design tokens for typography, spacing, and surface hierarchy
- deciding when a component should stay utility-driven versus moving into a named system class
- documenting any future deployment changes if CSS generation moves out of the repository and into CI
