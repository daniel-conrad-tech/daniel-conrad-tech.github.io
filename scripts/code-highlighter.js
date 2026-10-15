const shellLanguages = new Set(["bash", "sh", "shell", "zsh"]);
const javaLanguages = new Set(["java"]);
const javaKeywords = new Set([
    "abstract", "assert", "boolean", "break", "byte", "case", "catch",
    "char", "class", "const", "continue", "default", "do", "double",
    "else", "enum", "extends", "final", "finally", "float", "for",
    "if", "implements", "import", "instanceof", "int", "interface",
    "long", "native", "new", "package", "private", "protected", "public",
    "return", "short", "static", "strictfp", "super", "switch", "synchronized",
    "this", "throw", "throws", "transient", "try", "void", "volatile", "while",
    "var", "record", "sealed", "permits", "yield",
]);
const mutedWords = new Set([
    "if", "then", "else", "elif", "fi", "case", "in", "esac", "for", "while",
    "until", "do", "done", "function", "select", "time", "coproc", "return",
    "exit", "break", "continue", "shift", "set", "unset", "export", "readonly",
    "local", "declare", "typeset", "trap", "source", ".",
]);

function escapeHtml(value) {
    return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}

function renderJava(code) {
    const tokens = code.match(/"""[\s\S]*?"""|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\/\/[^\n]*|\/\*[\s\S]*?(?:\*\/|$)|@[A-Za-z_$][\w$]*|[A-Za-z_$][\w$]*|\b\d[\w.]*\b|[\s\S]/g) || [];

    return tokens.map((token) => {
        let role;
        if (token.startsWith("//") || token.startsWith("/*")) role = "code-muted";
        else if (token.startsWith('"') || token.startsWith("'")) role = "code-value";
        else if (token.startsWith("@")) role = "code-emphasis";
        else if (javaKeywords.has(token)) role = "code-muted";
        else if (/^(?:true|false|null)$/.test(token) || /^\d/.test(token)) role = "code-value";
        const escaped = escapeHtml(token);
        return role ? `<span class="${role}">${escaped}</span>` : escaped;
    }).join("");
}

/** Renders a lexical reading aid; never executes code or changes its text content. */
function renderHighlightedCode(code, language = "") {
    const normalizedLanguage = String(language).toLowerCase();
    if (javaLanguages.has(normalizedLanguage)) return renderJava(code);
    if (!shellLanguages.has(normalizedLanguage)) return escapeHtml(code);

    // Every character is retained, including unsupported syntax and unfinished tokens.
    const tokens = code.match(/\s+|#[^\n]*|"(?:\\[\s\S]|[^"\\])*"|'[^']*'|\$\{[^}]*\}|\$(?:[A-Za-z_][A-Za-z0-9_]*|[0-9@*#?$!\-])|;;&|;;|;&|\|\||&&|<<-?|>>|\|&|[|&;(){}[\]=<>]|[^\s"'$|&;(){}[\]=<>]+|[\s\S]/g) || [];
    return tokens.map((token) => {
        let role;
        if (token.startsWith("#")) role = "code-muted";
        else if ((token.startsWith('"') && token.endsWith('"') && token.length > 1)
            || (token.startsWith("'") && token.endsWith("'") && token.length > 1)) role = "code-value";
        else if (/^\$(?:\{[^}]*\}|[A-Za-z_][A-Za-z0-9_]*|[0-9@*#?$!\-])$/.test(token)) role = "code-emphasis";
        else if (mutedWords.has(token) || token.startsWith("-") || /^[|&;(){}[\]=<>]/.test(token)) role = "code-muted";
        const escaped = escapeHtml(token);
        return role ? `<span class="${role}">${escaped}</span>` : escaped;
    }).join("");
}

module.exports = { renderHighlightedCode };
