#!/usr/bin/env node

const {
    removePreviewDraftSite,
    writePreviewDraftSite,
    writePublishedSite,
} = require("./text-workflow");

// Public pages never contain local draft navigation, including in preview mode.
const articles = writePublishedSite();
const includeDrafts = process.argv.includes("--include-drafts");

if (includeDrafts) {
    const previewArticles = writePreviewDraftSite();
    console.log(`Built ${articles.length} published text(s) and ${previewArticles.length} local draft preview(s).`);
} else {
    removePreviewDraftSite();
    console.log(`Built ${articles.length} published text(s), without draft previews.`);
}
