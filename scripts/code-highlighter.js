const shellLanguages = new Set(["bash", "sh", "shell", "zsh"]);
const mutedWords = new Set([
    "if", "then", "else", "elif", "fi", "case", "in", "esac", "for", "while",
    "until", "do", "done", "function", "select", "time", "coproc", "return",
    "exit", "break", "continue", "shift", "set", "unset", "export", "readonly",
    "local", "declare", "typeset", "trap", "source", ".",
]);

function escapeHtml(value) {
    return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}

/** Renders a lexical reading aid; never executes code or changes its text content. */
function renderHighlightedCode(code, language = "") {
    if (!shellLanguages.has(String(language).toLowerCase())) return escapeHtml(code);

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
