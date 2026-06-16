#!/usr/bin/env node

const { publishDraft } = require("./text-workflow");

const target = process.argv[2];

if (!target) {
    console.error("Usage: node scripts/publish-text.js <draft-path>");
    process.exit(1);
}

try {
    const draft = publishDraft(target);
    console.log(`Published ${draft.data.slug}.`);
} catch (error) {
    console.error(error.message);
    process.exit(1);
}
