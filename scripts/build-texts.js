#!/usr/bin/env node

const { writePublishedSite } = require("./text-workflow");

const articles = writePublishedSite();
console.log(`Built ${articles.length} published text(s).`);
