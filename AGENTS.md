# AGENTS.md

This repository is a public GitHub Pages site for Daniel Conrad.

## Purpose

- Keep the site static and easy to maintain.
- Use the repository to show technical taste, clarity, and execution.
- Prefer small, readable changes over complex setups.
- Make decisions with a clear sense of time, cost, and practical benefit.

## Project Structure

- `index.html` is the main page.
- `assets/css/tailwind.css` is the Tailwind source file.
- `assets/css/style.css` is the generated stylesheet served by GitHub Pages.
- `assets/js/code-showcase.js` enhances shared code examples into the site's reusable code UI.
- Keep additional assets organized under `assets/`.

## Editing Guidelines

- Preserve semantic HTML.
- Keep the layout responsive on desktop and mobile.
- Prefer styling approaches that keep effort proportional to the value of the result.
- Prefer Tailwind defaults and utilities before introducing custom styling layers.
- Avoid unnecessary JavaScript unless the feature really needs it.
- Keep content direct, intentional, and professional.
- Prefer correct German spelling with umlauts in user-facing copy and documentation when the file format supports it.
- Treat mobile as a first-class reading experience, not as a reduced desktop layout.
- Follow `docs/ui-guidelines.md` for button behavior, icon controls, tooltips, and code example presentation.
- Do not hand-build one-off code showcase markup when the shared code example pattern can be used instead.
- For article content, prefer normal Markdown code fences and let the publishing pipeline render reusable code examples.

## Public Repo Notes

- Everything committed here is public.
- Do not add secrets, private notes, or internal-only prompts.
- If a file is meant to demonstrate process or thinking, it should be written clearly enough for public readers.
- Never commit private SSH keys, tokens, passwords, or any other live credentials.

## GitHub Pages

- Keep the site compatible with static hosting.
- Build steps are acceptable when they clearly improve consistency and maintainability.
- Make sure links, assets, and paths work from the repository root.
- After changes to page content, generated text pages, or styling, rebuild the site before considering the work done.
- Use the local HTTP preview for verification instead of `file://` because the site uses root-based asset paths.
- For local verification, prefer `npm run preview:full`. It should rebuild the site and start the local server for LAN access.
- Restart the local preview server only when it is not already running or when the preview setup itself has changed. For ordinary HTML, CSS, and generated page changes, rebuilding and reloading the browser is sufficient.
- `npm run preview` should start the local server with LAN access enabled.
- When starting local preview, detect the active local IP address and report the full reachable URL explicitly.
- After rebuilding and starting local preview, always print the exact reachable LAN URL so the user can open the site immediately on other devices.

## Style Direction

- The site should feel deliberate, modern, and personal.
- Typography, spacing, and contrast matter more than visual clutter.
- Prefer simple, strong section structure over decorative noise.
- Favor pragmatic constraints over unlimited flexibility when that leads to faster, clearer decisions.
- Prefer shared UI patterns over local visual exceptions, especially for buttons, utility controls, and code blocks.

## Mobile Principles

- Hero sections should stay bold on small screens without overwhelming the first viewport.
- Navigation must be easy to tap, with enough spacing and clear mobile behavior.
- Primary actions should feel comfortable for thumb use and should not rely on tight inline layouts.
- Responsive design should adapt to viewport size, not depend on device detection or mobile-only subdomains.
