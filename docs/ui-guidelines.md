# UI-Richtlinien

Diese Seite soll ruhig, präzise und konsistent wirken. Die UI ist kein Produkt-Dashboard und keine Komponenten-Spielwiese. Interaktionen sollen klar sein, aber visuell zurückhaltend bleiben.

## Grundprinzipien

- Bevorzuge wenige, starke Muster statt vieler Sonderfälle.
- Wiederverwendung ist wichtiger als lokale Optimierung.
- Interaktion soll spürbar sein, aber nicht laut.
- Semantik und Lesbarkeit sind wichtiger als dekorative Effekte.
- Mobile und Desktop sollen dieselbe gestalterische Haltung teilen.

## Button-Rollen

Es gibt drei Button-Typen:

### Primär

Für die wichtigste Aktion eines Bereichs.

- Vollfläche mit Akzentfarbe
- Runde Form
- Deutliches Gewicht
- Pro Abschnitt höchstens eine primäre Aktion

Referenz:

- `.button-primary`

### Sekundär

Für reguläre Navigation und unterstützende Aktionen.

- Transparenter Hintergrund
- Rahmen mit `border-line`
- Runde Form
- Gleiches Größenverhalten wie primäre Buttons
- Hover betont Rahmen und Text, nicht die Fläche

Referenz:

- `.button-secondary`

### Icon-Button

Für kompakte Werkzeuge wie Kopieren, Auf- und Zuklappen oder ähnliche Utility-Aktionen.

- Nur verwenden, wenn das Icon eindeutig ist
- Muss ein `aria-label` haben
- Sichtbarer Text erscheint nur als Tooltip bei Hover oder Focus
- Erfolg oder Zustandswechsel soll möglichst im Button selbst sichtbar sein

Referenz:

- `.code-showcase-button`

## Größen und Form

Buttons sollen sich an wenige feste Muster halten:

- Standardhöhe für reguläre Textbuttons: `min-h-12`
- Icon-Buttons dürfen kompakter sein, aktuell `h-10 w-10`
- Radius grundsätzlich rund oder stark gerundet
- Keine kleinen, engen Klickflächen
- Schrift bei Buttons eher `font-semibold` als leicht

Wenn ein neuer Button-Typ nötig scheint, zuerst prüfen, ob ein bestehender Typ leicht angepasst werden kann.

## Interaktionsverhalten

### Hover

- Hover hebt Bedeutung an, nicht Lautstärke
- Kein aggressiver Farbwechsel
- Keine starken Schatten nur für Dekoration
- Rahmen, Textfarbe und leichte Flächenanhebung reichen meist

### Focus

- Tastaturbedienung muss mitgedacht werden
- Fokus darf nicht versteckt werden
- Tooltip-basierte Icon-Buttons müssen auch bei `focus-visible` verständlich sein

### Erfolg und Status

- Kurzfristiges Feedback möglichst direkt am Auslöser zeigen
- Beispiel: Copy-Button wechselt kurz auf Häkchen
- Kein zusätzlicher Status-Text, wenn der Button selbst den Zustand klar anzeigen kann
- Persistente Statusmeldungen nur verwenden, wenn der Zustand mehr Erklärung braucht

## Tooltips

Tooltips sind hier nur für kurze Klarstellung gedacht.

- Nur bei Icon-Buttons oder stark kompakten Controls
- Kurz halten
- Keine Sätze
- Müssen denselben Begriff tragen wie das `aria-label`
- Hover und Tastaturfokus sollen sie gleichermaßen sichtbar machen

## Code-UI

Code-Blöcke auf dieser Seite folgen nicht klassischem Syntax-Highlighting. Sie sollen eher Domänensprache als Programmiersprache sichtbar machen.

### Semantische Gewichtung

- Sprachsyntax ist Hintergrund
- Domänennamen sind Vordergrund
- String-Literale mit fachlicher Bedeutung dürfen betont werden
- Reine Strukturzeichen und technische Syntax werden gedämpft

Aktuelle Rollen:

- `.code-emphasis` für fachlich wichtige Namen
- `.code-value` für bedeutungstragende String-Literale
- `.code-muted` für Syntax, Typen und Strukturzeichen

### Code-Aktionen

- `Copy` nur anzeigen, wenn tatsächlich ein sichtbarer Codeblock vorhanden ist
- `Collapse` darf den Block schließen und wieder öffnen
- Collapse-Zustand soll im Icon erkennbar sein
- Copy-Erfolg soll direkt im Button sichtbar werden

### Wiederverwendung in Texten

Für Texte und Artikel soll kein UI-HTML von Hand geschrieben werden. Stattdessen normale Markdown-Codefences verwenden.

Beispiel:

````md
```ts
type DecisionInput = {
  clarity: number;
};
```
````

Optional können im Fence einfache Attribute gesetzt werden:

````md
```ts label="TypeScript" note="vereinfachtes Beispiel" open="false"
export function nextStep() {
  return "ship";
}
```
````

Unterstützt werden aktuell:

- `label="..."`
- `note="..."`
- `open="false"`

Ohne Angaben wird das Label aus der Sprachkennung abgeleitet und der Block standardmäßig geöffnet angezeigt.

## Wann Textbutton, wann Icon-Button

Textbutton verwenden, wenn:

- die Aktion primär oder navigativ ist
- die Bedeutung nicht sofort ikonisch verständlich ist
- die Aktion allein steht und nicht als Utility gelesen wird

Icon-Button verwenden, wenn:

- die Aktion klein und wiedererkennbar ist
- sie im Kontext eines UI-Moduls sitzt
- ein Tooltip oder `aria-label` die Bedeutung sauber absichert

Keine neue Mischform einführen, nur weil lokal etwas „noch ein bisschen besser passen könnte“.

## Konsistenzregeln

- Neue Buttons orientieren sich zuerst an bestehenden Klassen
- Neue Hover- oder Success-Muster nur einführen, wenn sie mehrfach nutzbar sind
- Eine neue visuelle Sprache für genau einen Spezialfall vermeiden
- Wenn ein Element wie ein bestehender Button wirkt, soll es sich auch so verhalten

## Vor dem Einführen neuer UI-Muster

Kurz prüfen:

1. Gibt es bereits eine Rolle, die fast passt?
2. Ist das neue Muster mehrfach nutzbar?
3. Macht es die Seite klarer oder nur individueller?
4. Bleibt es auf Mobilgeräten genauso verständlich?
5. Passt es zur zurückhaltenden, absichtsvollen Gesamtwirkung?

Wenn zwei Lösungen ähnlich gut sind, die einfachere und ruhigere bevorzugen.
