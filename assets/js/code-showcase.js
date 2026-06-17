const codeShowcaseUi = {
    de: {
        copy: "Code kopieren",
        copied: "Code kopiert",
        copyError: "Kopieren nicht verfügbar",
        expand: "Aufklappen",
        collapse: "Zuklappen",
        fallbackLabel: "Code",
    },
    en: {
        copy: "Copy code",
        copied: "Code copied",
        copyError: "Copy unavailable",
        expand: "Expand",
        collapse: "Collapse",
        fallbackLabel: "Code",
    },
};

const copyResetTimers = new WeakMap();

function getCodeShowcaseLanguage() {
    return document.documentElement.lang in codeShowcaseUi
        ? document.documentElement.lang
        : "de";
}

function getCodeShowcaseStrings() {
    return codeShowcaseUi[getCodeShowcaseLanguage()];
}

function createCopyIcon() {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("class", "code-showcase-icon code-showcase-icon--copy");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("aria-hidden", "true");

    const front = document.createElementNS("http://www.w3.org/2000/svg", "path");
    front.setAttribute(
        "d",
        "M9 9.75A2.25 2.25 0 0 1 11.25 7.5h6A2.25 2.25 0 0 1 19.5 9.75v8.25a2.25 2.25 0 0 1-2.25 2.25h-6A2.25 2.25 0 0 1 9 18Z",
    );
    front.setAttribute("fill", "none");
    front.setAttribute("stroke", "currentColor");
    front.setAttribute("stroke-linecap", "round");
    front.setAttribute("stroke-linejoin", "round");
    front.setAttribute("stroke-width", "1.7");

    const back = document.createElementNS("http://www.w3.org/2000/svg", "path");
    back.setAttribute(
        "d",
        "M15 7.5V6A2.25 2.25 0 0 0 12.75 3.75h-6A2.25 2.25 0 0 0 4.5 6v8.25a2.25 2.25 0 0 0 2.25 2.25H9",
    );
    back.setAttribute("fill", "none");
    back.setAttribute("stroke", "currentColor");
    back.setAttribute("stroke-linecap", "round");
    back.setAttribute("stroke-linejoin", "round");
    back.setAttribute("stroke-width", "1.7");

    svg.append(front, back);
    return svg;
}

function createCheckIcon() {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("class", "code-showcase-icon code-showcase-icon--check");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("aria-hidden", "true");

    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", "m6.75 12.75 3.75 3.75 6.75-9");
    path.setAttribute("fill", "none");
    path.setAttribute("stroke", "currentColor");
    path.setAttribute("stroke-linecap", "round");
    path.setAttribute("stroke-linejoin", "round");
    path.setAttribute("stroke-width", "1.9");

    svg.append(path);
    return svg;
}

function createToggleIcon() {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("class", "code-showcase-icon code-showcase-icon--toggle");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("aria-hidden", "true");

    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", "m7.5 14.25 4.5-4.5 4.5 4.5");
    path.setAttribute("fill", "none");
    path.setAttribute("stroke", "currentColor");
    path.setAttribute("stroke-linecap", "round");
    path.setAttribute("stroke-linejoin", "round");
    path.setAttribute("stroke-width", "1.9");

    svg.append(path);
    return svg;
}

function fallbackCopyText(text) {
    const helper = document.createElement("textarea");
    helper.value = text;
    helper.setAttribute("readonly", "");
    helper.style.position = "absolute";
    helper.style.left = "-9999px";
    document.body.appendChild(helper);
    helper.select();
    helper.setSelectionRange(0, helper.value.length);

    let copied = false;

    try {
        copied = document.execCommand("copy");
    } catch {
        copied = false;
    }

    document.body.removeChild(helper);
    return copied;
}

function updateCopyButtonState(button, state) {
    const strings = getCodeShowcaseStrings();
    const tooltip = button.querySelector(".code-showcase-tooltip");
    const label =
        state === "copied"
            ? strings.copied
            : state === "error"
              ? strings.copyError
              : strings.copy;

    button.dataset.copied = String(state === "copied");
    button.setAttribute("aria-label", label);

    if (tooltip) {
        tooltip.textContent = label;
    }
}

function scheduleCopyReset(button) {
    const existing = copyResetTimers.get(button);
    if (existing) {
        window.clearTimeout(existing);
    }

    const timer = window.setTimeout(() => {
        updateCopyButtonState(button, "idle");
        copyResetTimers.delete(button);
    }, 1600);

    copyResetTimers.set(button, timer);
}

async function handleCodeCopy(button, codeElement) {
    const codeText = codeElement.textContent;

    try {
        if (navigator.clipboard && window.isSecureContext) {
            await navigator.clipboard.writeText(codeText);
        } else if (!fallbackCopyText(codeText)) {
            throw new Error("copy failed");
        }

        updateCopyButtonState(button, "copied");
        scheduleCopyReset(button);
    } catch {
        updateCopyButtonState(button, "error");
    }
}

function updateToggleButtonState(button, isExpanded) {
    const strings = getCodeShowcaseStrings();
    const tooltip = button.querySelector(".code-showcase-tooltip");
    const label = isExpanded ? strings.collapse : strings.expand;

    button.setAttribute("aria-expanded", String(isExpanded));
    button.setAttribute("aria-label", label);

    if (tooltip) {
        tooltip.textContent = label;
    }
}

function syncCodeShowcase(example) {
    const showcase = example.closest(".code-showcase");
    if (!showcase) {
        return;
    }

    const meta = showcase.querySelector(".code-showcase-meta");
    const title = meta?.querySelector(".code-showcase-title");
    const note = meta?.querySelector(".code-showcase-note");
    const label = example.dataset.codeLabel || getCodeShowcaseStrings().fallbackLabel;
    const noteText = example.dataset.codeNote || "";

    if (title) {
        title.textContent = label;
    }

    if (note) {
        note.textContent = noteText;
        note.hidden = noteText.length === 0;
    }

    const toggleButton = showcase.querySelector("[data-code-toggle]");
    if (toggleButton) {
        updateToggleButtonState(toggleButton, !example.hidden);
    }

    const copyButton = showcase.querySelector("[data-copy-code]");
    if (copyButton && copyButton.dataset.copied !== "true") {
        updateCopyButtonState(copyButton, "idle");
    }
}

function createCodeShowcase(example, index) {
    if (example.dataset.codeEnhanced === "true") {
        syncCodeShowcase(example);
        return;
    }

    const strings = getCodeShowcaseStrings();
    const parent = example.parentNode;
    const wrapper = document.createElement("div");
    wrapper.className = "code-showcase";

    const isOpen = example.dataset.codeOpen !== "false";
    wrapper.dataset.codeOpen = String(isOpen);

    const header = document.createElement("div");
    header.className = "code-showcase-header";

    const meta = document.createElement("div");
    meta.className = "code-showcase-meta";

    const title = document.createElement("p");
    title.className = "code-showcase-title";
    title.textContent = example.dataset.codeLabel || strings.fallbackLabel;

    const note = document.createElement("p");
    note.className = "code-showcase-note";
    note.textContent = example.dataset.codeNote || "";
    note.hidden = !note.textContent;

    meta.append(title, note);

    const actions = document.createElement("div");
    actions.className = "code-showcase-actions";

    const codeId = example.id || `code-example-${index + 1}`;
    example.id = codeId;

    const copyButton = document.createElement("button");
    copyButton.className = "code-showcase-button";
    copyButton.type = "button";
    copyButton.dataset.copyCode = "true";
    copyButton.dataset.copyTarget = codeId;
    copyButton.dataset.copied = "false";
    copyButton.append(
        createCopyIcon(),
        createCheckIcon(),
        Object.assign(document.createElement("span"), {
            className: "code-showcase-tooltip",
        }),
    );
    updateCopyButtonState(copyButton, "idle");
    copyButton.addEventListener("click", () => {
        handleCodeCopy(copyButton, example.querySelector("code") || example);
    });

    const toggleButton = document.createElement("button");
    toggleButton.className = "code-showcase-button";
    toggleButton.type = "button";
    toggleButton.dataset.codeToggle = "true";
    toggleButton.dataset.toggleTarget = codeId;
    toggleButton.append(
        createToggleIcon(),
        Object.assign(document.createElement("span"), {
            className: "code-showcase-tooltip",
        }),
    );
    updateToggleButtonState(toggleButton, isOpen);
    toggleButton.addEventListener("click", () => {
        const nextExpanded = example.hidden;
        example.hidden = !nextExpanded;
        wrapper.dataset.codeOpen = String(nextExpanded);
        updateToggleButtonState(toggleButton, nextExpanded);
    });

    actions.append(copyButton, toggleButton);
    header.append(meta, actions);

    example.hidden = !isOpen;
    example.dataset.codeEnhanced = "true";

    parent.insertBefore(wrapper, example);
    wrapper.append(header, example);
}

function enhanceCodeExamples(root = document) {
    root.querySelectorAll("pre[data-code-example]").forEach((example, index) => {
        createCodeShowcase(example, index);
    });
}

document.addEventListener("DOMContentLoaded", () => {
    enhanceCodeExamples();
});

document.addEventListener("site-language-changed", () => {
    document.querySelectorAll("pre[data-code-example]").forEach((example) => {
        syncCodeShowcase(example);
    });
});
