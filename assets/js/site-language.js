const translations = {
    de: {
        description: "Softwareentwicklung, KI, ETHON und systemisches Denken.",
        translation_note:
            "Die englische Version ist KI-unterstützt und kann kleinere Ungenauigkeiten enthalten.",
        nav_projects: "Projekte",
        nav_texts: "Texte",
        nav_contact: "Kontakt",
        eyebrow: "Software · KI · Systemdenken",
        hero_title: "Ich baue Werkzeuge, die Denken präziser machen.",
        hero_lead:
            "ETHON ist mein Versuch, Prinzipien, Axiome und KI zu einem handlungsfähigen Denkwerkzeug zu verbinden.",
        hero_primary_cta: "Projekte ansehen",
        hero_secondary_cta: "Kontakt",
        projects_title: "Projekte",
        projects_intro:
            "Werkzeuge, Denkmodelle und Systeme, die Klarheit, Entscheidungskraft und bessere technische Arbeit unterstützen.",
        project_ethon_copy:
            "Ein Denk- und Prüfsystem für präzisere Entscheidungen mit KI.",
        project_review_agent_copy:
            "Werkzeuge für bessere Code Reviews, Mustererkennung und Kontextführung.",
        project_system_notes_copy:
            "Gedanken zu Softwarearchitektur, KI, Wirkung und kognitiver Last.",
        texts_title: "Texte",
        texts_copy:
            "Hier entstehen später Notizen, Essays und technische Analysen.",
        contact_title: "Kontakt",
        contact_label: "Kontakt:",
        switch_de_title: "Auf Deutsch anzeigen",
        switch_de_aria: "Zur deutschen Version wechseln",
        switch_en_title: "Englische Version anzeigen",
        switch_en_aria: "Zur englischen Version wechseln",
    },
    en: {
        description:
            "Software engineering, AI, ETHON, and systems thinking.",
        translation_note:
            "AI-assisted English may contain minor inaccuracies.",
        nav_projects: "Projects",
        nav_texts: "Writing",
        nav_contact: "Contact",
        eyebrow: "Software · AI · Systems Thinking",
        hero_title: "I build tools that make thinking more precise.",
        hero_lead:
            "ETHON is my attempt to turn principles, axioms, and AI into a practical thinking tool.",
        hero_primary_cta: "View projects",
        hero_secondary_cta: "Contact",
        projects_title: "Projects",
        projects_intro:
            "Tools, thinking models, and systems that support clarity, judgment, and better technical work.",
        project_ethon_copy:
            "A thinking and validation system for more precise decisions with AI.",
        project_review_agent_copy:
            "Tools for better code reviews, pattern recognition, and context guidance.",
        project_system_notes_copy:
            "Notes on software architecture, AI, impact, and cognitive load.",
        texts_title: "Writing",
        texts_copy:
            "This is where notes, essays, and technical analyses will appear over time.",
        contact_title: "Contact",
        contact_label: "Contact:",
        switch_de_title: "Show German version",
        switch_de_aria: "Switch to the German version",
        switch_en_title: "Show English version",
        switch_en_aria: "Switch to the English version",
    },
};

const languageStorageKey = "preferred-language";
const supportedLanguages = new Set(["de", "en"]);

function resolveInitialLanguage() {
    const storedLanguage = window.localStorage.getItem(languageStorageKey);
    if (storedLanguage && supportedLanguages.has(storedLanguage)) {
        return storedLanguage;
    }

    const browserLanguage = navigator.language.toLowerCase();
    if (browserLanguage.startsWith("de")) {
        return "de";
    }

    return "en";
}

function updateText(language) {
    document.querySelectorAll("[data-i18n]").forEach((element) => {
        const key = element.dataset.i18n;
        const translation = translations[language][key];

        if (translation) {
            element.textContent = translation;
        }
    });

    document.querySelectorAll("[data-i18n-meta-content]").forEach((element) => {
        const key = element.dataset.i18nMetaContent;
        const translation = translations[language][key];

        if (translation) {
            element.setAttribute("content", translation);
        }
    });
}

function updateSwitchLabels(language) {
    const deButton = document.getElementById("language-de");
    const enButton = document.getElementById("language-en");

    deButton.title = translations[language].switch_de_title;
    deButton.setAttribute("aria-label", translations[language].switch_de_aria);
    enButton.title = translations[language].switch_en_title;
    enButton.setAttribute("aria-label", translations[language].switch_en_aria);

    deButton.dataset.active = String(language === "de");
    enButton.dataset.active = String(language === "en");
    deButton.setAttribute("aria-pressed", String(language === "de"));
    enButton.setAttribute("aria-pressed", String(language === "en"));
}

function updateTranslationNote(language) {
    const note = document.getElementById("translation-note");
    note.hidden = language !== "en";
}

function applyLanguage(language) {
    updateText(language);
    updateSwitchLabels(language);
    updateTranslationNote(language);
    document.documentElement.lang = language;
    window.localStorage.setItem(languageStorageKey, language);
}

document.addEventListener("DOMContentLoaded", () => {
    const initialLanguage = resolveInitialLanguage();
    applyLanguage(initialLanguage);

    document.querySelectorAll("[data-language-switch]").forEach((button) => {
        button.addEventListener("click", () => {
            applyLanguage(button.dataset.languageSwitch);
        });
    });
});
