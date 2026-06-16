#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const repoRoot = path.resolve(__dirname, "..");
const draftsDir = path.join(repoRoot, "drafts");
const textsDir = path.join(repoRoot, "texte");
const indexPath = path.join(repoRoot, "index.html");

const requiredPublishFields = [
    "title",
    "slug",
    "date",
    "status",
    "language",
    "format",
    "summary",
    "tags",
    "thesis",
    "pattern",
    "mechanism",
    "counterargument",
    "action",
    "check_question",
    "signal",
];

function escapeHtml(value) {
    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#39;");
}

function renderInline(text) {
    return escapeHtml(text).replace(
        /`([^`]+)`/g,
        (_, code) => `<code>${escapeHtml(code)}</code>`,
    );
}

const headingIconMap = new Map([
    [
        "△",
        {
            label: "Diagnose",
            svg: `<svg class="section-heading-icon" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5 19 18H5Z"></path></svg>`,
        },
    ],
    [
        "◌",
        {
            label: "Muster",
            svg: `<svg class="section-heading-icon" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="4.5" y="4.5" width="6" height="6" rx="1.2"></rect><rect x="13.5" y="4.5" width="6" height="6" rx="1.2"></rect><rect x="4.5" y="13.5" width="6" height="6" rx="1.2"></rect><rect x="13.5" y="13.5" width="6" height="6" rx="1.2"></rect></svg>`,
        },
    ],
    [
        "⚙",
        {
            label: "Mechanik",
            svg: `<svg class="section-heading-icon" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3.1"></circle><path d="M12 3.8v2.1"></path><path d="M12 18.1v2.1"></path><path d="m18.2 5.8-1.5 1.5"></path><path d="m7.3 16.7-1.5 1.5"></path><path d="M20.2 12h-2.1"></path><path d="M5.9 12H3.8"></path><path d="m18.2 18.2-1.5-1.5"></path><path d="m7.3 7.3-1.5-1.5"></path><circle cx="12" cy="12" r="7.1"></circle></svg>`,
        },
    ],
    [
        "↔",
        {
            label: "Gegenargument",
            svg: `<svg class="section-heading-icon" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 8h13"></path><path d="m14 4 4 4-4 4"></path><path d="M20 16H7"></path><path d="m10 12-4 4 4 4"></path></svg>`,
        },
    ],
    [
        "✓",
        {
            label: "Handlungsvorschlag",
            svg: `<svg class="section-heading-icon" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12 4 4 10-10"></path></svg>`,
        },
    ],
    [
        "?",
        {
            label: "Prüffrage",
            svg: `<svg class="section-heading-icon" viewBox="0 0 28 28" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M11 10.6a3.6 3.6 0 1 1 5.7 3c-1.1.8-2.1 1.6-2.1 3"></path><path d="M14 20.6h.01"></path><circle cx="14" cy="14" r="11"></circle></svg>`,
        },
    ],
    [
        "!",
        {
            label: "Signal",
            svg: `<svg class="section-heading-icon" viewBox="0 0 28 28" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14 8.5v7"></path><path d="M14 20.2h.01"></path><circle cx="14" cy="14" r="11"></circle></svg>`,
        },
    ],
]);

function renderHeading(level, text) {
    const markerMatch = text.match(/^(\S)\s+(.+)$/);

    if (level === 2 && markerMatch) {
        const [, marker, label] = markerMatch;
        const config = headingIconMap.get(marker);

        if (config) {
            return `<h2 class="section-heading"><span class="section-heading-mark">${config.svg}</span><span class="section-heading-label">${renderInline(label)}</span></h2>`;
        }
    }

    return `<h${level}>${renderInline(text)}</h${level}>`;
}

function parseScalar(rawValue) {
    const value = rawValue.trim();
    if (!value) {
        return "";
    }

    if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
    ) {
        return value.slice(1, -1);
    }

    if (value === "true") {
        return true;
    }

    if (value === "false") {
        return false;
    }

    return value;
}

function parseFrontmatter(raw) {
    if (!raw.startsWith("---\n")) {
        throw new Error("Missing frontmatter block.");
    }

    const endIndex = raw.indexOf("\n---\n", 4);
    if (endIndex === -1) {
        throw new Error("Unterminated frontmatter block.");
    }

    const frontmatterSource = raw.slice(4, endIndex);
    const body = raw.slice(endIndex + 5).trim();
    const data = {};
    let currentArrayKey = null;

    for (const line of frontmatterSource.split("\n")) {
        if (!line.trim()) {
            continue;
        }

        const arrayMatch = line.match(/^\s*-\s+(.*)$/);
        if (arrayMatch && currentArrayKey) {
            data[currentArrayKey].push(parseScalar(arrayMatch[1]));
            continue;
        }

        const fieldMatch = line.match(/^([a-zA-Z0-9_]+):(.*)$/);
        if (!fieldMatch) {
            currentArrayKey = null;
            continue;
        }

        const [, key, remainder] = fieldMatch;
        const trimmedRemainder = remainder.trim();

        if (!trimmedRemainder) {
            data[key] = [];
            currentArrayKey = key;
            continue;
        }

        data[key] = parseScalar(trimmedRemainder);
        currentArrayKey = null;
    }

    return { data, body };
}

function loadDraft(filePath) {
    const raw = fs.readFileSync(filePath, "utf8");
    const parsed = parseFrontmatter(raw);

    return {
        filePath,
        filename: path.basename(filePath),
        ...parsed,
    };
}

function listDraftFiles() {
    if (!fs.existsSync(draftsDir)) {
        return [];
    }

    return fs
        .readdirSync(draftsDir)
        .filter((name) => name.endsWith(".md") && !name.startsWith("_"))
        .map((name) => path.join(draftsDir, name));
}

function listDrafts() {
    return listDraftFiles()
        .map((filePath) => {
            try {
                return loadDraft(filePath);
            } catch (error) {
                if (error.message === "Missing frontmatter block.") {
                    return null;
                }

                throw error;
            }
        })
        .filter(Boolean);
}

function validateForPublish(draft) {
    const errors = [];

    for (const field of requiredPublishFields) {
        const value = draft.data[field];

        if (Array.isArray(value)) {
            if (value.length === 0) {
                errors.push(`Missing required field: ${field}`);
            }
            continue;
        }

        if (value === undefined || value === null || String(value).trim() === "") {
            errors.push(`Missing required field: ${field}`);
        }
    }

    if (draft.data.ai_approved !== true) {
        errors.push("Missing AI approval.");
    }

    if (draft.data.author_approved !== true) {
        errors.push("Missing author approval.");
    }

    const requiredSections = [
        {
            label: "Handlungsvorschlag",
            patterns: ["## ✓ Handlungsvorschlag"],
        },
        {
            label: "Prueffrage",
            patterns: ["## ? Prueffrage", "## ? Prüffrage"],
        },
        {
            label: "Signal",
            patterns: ["## ! Signal"],
        },
    ];

    for (const section of requiredSections) {
        if (!section.patterns.some((pattern) => draft.body.includes(pattern))) {
            errors.push(`Missing required section: ${section.label}`);
        }
    }

    const placeholderPattern = /\b(TODO|xxx|spaeter|ergaenzen)\b/i;
    if (placeholderPattern.test(draft.body)) {
        errors.push("Placeholder text found in body.");
    }

    return errors;
}

function formatGermanDate(dateString) {
    const date = new Date(`${dateString}T00:00:00`);
    return new Intl.DateTimeFormat("de-DE", {
        day: "numeric",
        month: "long",
        year: "numeric",
    }).format(date);
}

function renderMarkdown(markdown) {
    const lines = markdown.split("\n");
    const html = [];
    let paragraphBuffer = [];
    let listBuffer = [];

    function flushParagraph() {
        if (paragraphBuffer.length === 0) {
            return;
        }

        html.push(`<p>${renderInline(paragraphBuffer.join(" "))}</p>`);
        paragraphBuffer = [];
    }

    function flushList() {
        if (listBuffer.length === 0) {
            return;
        }

        html.push(
            `<ul>${listBuffer.map((item) => `<li>${renderInline(item)}</li>`).join("")}</ul>`,
        );
        listBuffer = [];
    }

    for (const line of lines) {
        const trimmed = line.trim();

        if (!trimmed) {
            flushParagraph();
            flushList();
            continue;
        }

        const headingMatch = trimmed.match(/^(#{1,3})\s+(.*)$/);
        if (headingMatch) {
            flushParagraph();
            flushList();
            const level = Math.min(headingMatch[1].length, 3);
            html.push(renderHeading(level, headingMatch[2]));
            continue;
        }

        const listMatch = trimmed.match(/^- (.*)$/);
        if (listMatch) {
            flushParagraph();
            listBuffer.push(listMatch[1]);
            continue;
        }

        flushList();
        paragraphBuffer.push(trimmed);
    }

    flushParagraph();
    flushList();

    return html.join("\n");
}

function escapeRegExp(value) {
    return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function stripLeadingMarkdownTitle(markdown, title) {
    return markdown.replace(
        new RegExp(`^#\\s+${escapeRegExp(title)}\\s*(?:\\n|$)`),
        "",
    );
}

function renderTagList(tags) {
    return tags
        .map((tag) => `<li class="article-tag">${escapeHtml(tag)}</li>`)
        .join("");
}

function siteShell({ title, description, currentPath, mainContent }) {
    const canonical = currentPath === "/" ? "/" : currentPath.replace(/index\.html$/, "");

    return `<!doctype html>
<html lang="de">
    <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>${escapeHtml(title)}</title>
        <meta name="description" content="${escapeHtml(description)}" />
        <link rel="stylesheet" href="/assets/css/style.css" />
        <link rel="canonical" href="https://daniel-conrad.tech${escapeHtml(canonical)}" />
    </head>
    <body class="min-h-screen antialiased">
        <header class="site-header">
            <a class="logo-mark" href="/">Daniel Conrad</a>
            <nav class="site-nav">
                <a class="nav-link" href="/#projekte">Projekte</a>
                <a class="nav-link" href="/texte/">Texte</a>
                <a class="nav-link" href="/#kontakt">Kontakt</a>
            </nav>
        </header>

        ${mainContent}

        <footer class="site-footer">
            <div class="footer-row">
                <p>© 2026 Daniel Conrad</p>
                <nav class="footer-links">
                    <a class="footer-link" href="/impressum.html">Impressum</a>
                    <a class="footer-link" href="/datenschutz.html">Datenschutz</a>
                </nav>
            </div>
        </footer>
    </body>
</html>
`;
}

function renderArticlePage(article) {
    const title = `${article.data.title} | Daniel Conrad`;
    const tags = Array.isArray(article.data.tags) ? article.data.tags : [];
    const bodyHtml = renderMarkdown(
        stripLeadingMarkdownTitle(article.body, article.data.title),
    );
    const articlePath = `/texte/${article.data.slug}.html`;
    const shareUrl = `https://daniel-conrad.tech${articlePath}`;

    return siteShell({
        title,
        description: article.data.summary,
        currentPath: articlePath,
        mainContent: `<main class="article-page">
            <div class="article-topbar">
                <div class="article-breadcrumb">
                    <a class="inline-link" href="/texte/">Texte</a>
                    <span class="article-breadcrumb-separator">/</span>
                    <span>${escapeHtml(article.data.title)}</span>
                </div>
                <div class="article-actions">
                    <a
                        class="article-action-icon"
                        href="${articlePath}"
                        title="Direktlink zum Text"
                        aria-label="Direktlink zum Text"
                    >
                        <svg
                            class="article-action-svg"
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="1.8"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                        >
                            <path d="M7 17 17 7"></path>
                            <path d="M9 7h8v8"></path>
                        </svg>
                    </a>
                    <button
                        class="article-action-icon"
                        type="button"
                        data-copy-link
                        data-copy-url="${escapeHtml(shareUrl)}"
                        title="Link kopieren"
                        aria-label="Link kopieren"
                    >
                        <svg
                            class="article-action-svg"
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="1.8"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                        >
                            <rect x="9" y="9" width="10" height="10" rx="2"></rect>
                            <path d="M5 15V7a2 2 0 0 1 2-2h8"></path>
                        </svg>
                    </button>
                    <span class="article-action-status" data-copy-status aria-live="polite"></span>
                </div>
            </div>
            <article>
                <header class="article-header">
                    <h1 class="article-title">${escapeHtml(article.data.title)}</h1>
                    <p class="article-summary">${escapeHtml(article.data.summary)}</p>
                    <div class="article-meta">
                        <time datetime="${escapeHtml(article.data.date)}">${escapeHtml(formatGermanDate(article.data.date))}</time>
                    </div>
                    <ul class="article-tags">${renderTagList(tags)}</ul>
                </header>
                <div class="article-content">
                    ${bodyHtml}
                </div>
            </article>
        </main>
        <script src="/assets/js/article-actions.js" defer></script>`,
    });
}

function renderArchiveCard(article) {
    return `<article class="article-list-card">
        <p class="article-list-meta">${escapeHtml(formatGermanDate(article.data.date))}</p>
        <h3 class="article-list-title">
            <a class="article-list-link" href="/texte/${escapeHtml(article.data.slug)}.html">${escapeHtml(article.data.title)}</a>
        </h3>
        <p class="article-list-summary">${escapeHtml(article.data.summary)}</p>
    </article>`;
}

function renderArchivePage(articles) {
    const cards =
        articles.length > 0
            ? articles.map(renderArchiveCard).join("\n")
            : `<article class="article-list-card">
        <h3 class="article-list-title">Noch keine veröffentlichten Texte</h3>
        <p class="article-list-summary">Sobald Texte den doppelten Freigabeprozess und den Publish-Schritt durchlaufen haben, erscheinen sie hier.</p>
    </article>`;

    return siteShell({
        title: "Texte | Daniel Conrad",
        description:
            "Notizen, Essays und Analysen zu KI, Software und systemischem Denken.",
        currentPath: "/texte/index.html",
        mainContent: `<main class="archive-page">
            <section class="archive-hero">
                <p class="archive-kicker">Texte</p>
                <h1 class="archive-title">Notizen, Essays und Analysen</h1>
                <p class="archive-summary">Texte über KI, Software, Systeme und die Mechaniken, die gute Arbeit oft verhindern oder verbessern.</p>
            </section>
            <section class="archive-list">
                ${cards}
            </section>
        </main>`,
    });
}

function renderHomeCards(articles) {
    if (articles.length === 0) {
        return `<p class="section-copy">Noch keine veröffentlichten Texte.</p>`;
    }

    return `<div class="article-home-grid">
${articles
    .slice(0, 3)
    .map(
        (article) => `    <article class="article-home-card">
        <p class="article-home-meta">${escapeHtml(formatGermanDate(article.data.date))}</p>
        <h3 class="article-home-title">
            <a class="article-home-link" href="/texte/${escapeHtml(article.data.slug)}.html">${escapeHtml(article.data.title)}</a>
        </h3>
        <p class="article-home-summary">${escapeHtml(article.data.summary)}</p>
    </article>`,
    )
    .join("\n")}
</div>`;
}

function replaceGeneratedSection(content, replacement) {
    const start = "<!-- generated:text-cards:start -->";
    const end = "<!-- generated:text-cards:end -->";
    const pattern = new RegExp(`${start}[\\s\\S]*?${end}`);

    if (!pattern.test(content)) {
        throw new Error("Could not find generated text card markers in index.html.");
    }

    return content.replace(pattern, `${start}\n${replacement}\n                ${end}`);
}

function getPublishedArticles() {
    return listDrafts()
        .filter((draft) => draft.data.status === "published")
        .sort((left, right) => right.data.date.localeCompare(left.data.date));
}

function writePublishedSite() {
    const articles = getPublishedArticles();

    fs.mkdirSync(textsDir, { recursive: true });
    fs.writeFileSync(path.join(textsDir, "index.html"), renderArchivePage(articles));

    for (const article of articles) {
        fs.writeFileSync(
            path.join(textsDir, `${article.data.slug}.html`),
            renderArticlePage(article),
        );
    }

    const existingTextFiles = fs
        .readdirSync(textsDir)
        .filter((name) => name.endsWith(".html") && name !== "index.html");
    const publishedSlugs = new Set(articles.map((article) => `${article.data.slug}.html`));

    for (const filename of existingTextFiles) {
        if (!publishedSlugs.has(filename)) {
            fs.unlinkSync(path.join(textsDir, filename));
        }
    }

    const updatedIndex = replaceGeneratedSection(
        fs.readFileSync(indexPath, "utf8"),
        renderHomeCards(articles),
    );
    fs.writeFileSync(indexPath, updatedIndex);

    return articles;
}

function serializeField(key, value) {
    if (Array.isArray(value)) {
        if (value.length === 0) {
            return `${key}: []`;
        }

        return `${key}:\n${value.map((entry) => `  - ${entry}`).join("\n")}`;
    }

    if (typeof value === "boolean") {
        return `${key}: ${value ? "true" : "false"}`;
    }

    return `${key}: "${String(value).replaceAll('"', '\\"')}"`;
}

function writeDraft(draft) {
    const keyOrder = [
        "title",
        "slug",
        "date",
        "status",
        "language",
        "format",
        "summary",
        "tags",
        "thesis",
        "pattern",
        "mechanism",
        "counterargument",
        "action",
        "check_question",
        "signal",
        "ai_approved",
        "ai_approved_at",
        "ai_review_notes",
        "author_approved",
        "author_approved_at",
        "author_review_notes",
    ];

    const frontmatter = keyOrder
        .filter((key) => Object.prototype.hasOwnProperty.call(draft.data, key))
        .map((key) => serializeField(key, draft.data[key]))
        .join("\n");

    const output = `---\n${frontmatter}\n---\n\n${draft.body}\n`;
    fs.writeFileSync(draft.filePath, output);
}

function publishDraft(targetPath) {
    const resolvedPath = path.isAbsolute(targetPath)
        ? targetPath
        : path.join(repoRoot, targetPath);
    const draft = loadDraft(resolvedPath);
    const errors = validateForPublish(draft);

    if (errors.length > 0) {
        throw new Error(errors.join("\n"));
    }

    draft.data.status = "published";
    writeDraft(draft);

    return draft;
}

module.exports = {
    draftsDir,
    getPublishedArticles,
    publishDraft,
    repoRoot,
    validateForPublish,
    writePublishedSite,
};
