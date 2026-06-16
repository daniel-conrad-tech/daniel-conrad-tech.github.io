document.addEventListener("DOMContentLoaded", () => {
    const copyButton = document.querySelector("[data-copy-link]");
    const status = document.querySelector("[data-copy-status]");

    if (!copyButton || !status) {
        return;
    }

    function fallbackCopyText(text) {
        const textarea = document.createElement("textarea");
        textarea.value = text;
        textarea.setAttribute("readonly", "");
        textarea.style.position = "absolute";
        textarea.style.left = "-9999px";
        document.body.appendChild(textarea);
        textarea.select();
        textarea.setSelectionRange(0, textarea.value.length);

        let copied = false;

        try {
            copied = document.execCommand("copy");
        } catch (error) {
            copied = false;
        }

        document.body.removeChild(textarea);
        return copied;
    }

    async function copyLink() {
        const url = copyButton.getAttribute("data-copy-url");

        if (!url) {
            status.textContent = "Link fehlt.";
            return;
        }

        try {
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(url);
                status.textContent = "Link kopiert.";
                return;
            }
        } catch (error) {
            // Fall through to legacy copy.
        }

        if (fallbackCopyText(url)) {
            status.textContent = "Link kopiert.";
            return;
        }

        status.textContent = "Kopieren nicht möglich.";
    }

    copyButton.addEventListener("click", () => {
        copyLink();
    });
});
