const { test } = require("node:test");
const assert = require("node:assert/strict");
const { renderHighlightedCode } = require("./code-highlighter");

function textContent(html) {
    return html.replace(/<\/?span\b[^>]*>/g, "")
        .replaceAll("&lt;", "<").replaceAll("&gt;", ">")
        .replaceAll("&amp;", "&");
}

test("preserves source text across quotes, variables, operators and unsupported shell syntax", () => {
    const samples = [
        '#!/bin/bash\nif [[ "$HOME" == "/tmp/a b" ]]; then\n  echo ${VALUE} >&2\nfi\n',
        "echo 'a\\b' \"line one\nline two\"; echo word#literal # comment\n",
        'case "$x" in a) echo yes ;;& b) echo next ;; esac\n',
        'cat <<EOF\n<script>alert("x")</script> &lt; &amp;\nEOF\n',
        'echo "unfinished\n${unclosed\n\t$? $1 $@ $$',
        '',
    ];
    for (const source of samples) assert.equal(textContent(renderHighlightedCode(source, "bash")), source);
});

test("escapes HTML so code can never inject page markup", () => {
    const rendered = renderHighlightedCode('echo "<img src=x onerror=alert(1)>" & <script>x</script>', "sh");
    assert.doesNotMatch(rendered, /<(?:img|script)\b/);
    assert.match(rendered, /&lt;img/);
});

test("uses the existing semantic roles for every supported shell label", () => {
    for (const language of ["bash", "sh", "shell", "zsh", "BASH"]) {
        const rendered = renderHighlightedCode('if ${VALUE}; echo "text"', language);
        assert.match(rendered, /class="code-muted">if<\/span>/);
        assert.match(rendered, /class="code-emphasis">\$\{VALUE\}<\/span>/);
        assert.match(rendered, /class="code-value">"text"<\/span>/);
    }
});

test("leaves unknown languages unhighlighted and safely escaped", () => {
    assert.equal(renderHighlightedCode('const x = "<tag> &";', "ts"), 'const x = "&lt;tag&gt; &amp;";');
});
