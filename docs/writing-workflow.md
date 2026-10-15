# Writing Workflow

Interner Schreib- und Veröffentlichungsprozess für Texte auf `daniel-conrad.tech`.

## Ziel

Texte sollen nicht nur pointiert, sondern belastbar und nützlich sein. Jeder veröffentlichte Text braucht zwei Freigaben:

- eine strukturelle und inhaltliche Freigabe durch KI
- eine bewusste öffentliche Freigabe durch Daniel Conrad

Kein Text wird veröffentlicht, wenn nur eine der beiden Freigaben vorliegt.

## Grundsatz

Ein Text ist erst dann publikationsfähig, wenn er:

- eine klare These hat
- ein wiederkehrendes Muster benennt
- die Mechanik hinter diesem Muster erklärt
- mindestens ein ernstzunehmendes Gegenargument aufnimmt
- mit einem konkreten Handlungsvorschlag endet
- eine ehrliche Prüffrage formuliert
- ein beobachtbares Signal für Gelingen oder Kippen benennt

Reine Empörung, starke Formulierungen oder gute Rohgedanken reichen nicht aus.

## Lesestruktur

Empfohlene feste Struktur im Text:

- `△ Diagnose`
- `◌ Muster`
- `⚙ Mechanik`
- `↔ Gegenargument`
- `✓ Handlungsvorschlag`
- `? Prüffrage`
- `! Signal`

Nicht jeder Text muss alle Sektionen gleich lang behandeln. Die Schlusssektionen `✓`, `?` und `!` sind jedoch verpflichtend.

## Statusmodell

- `draft`
  Rohtext, Notiz oder unfertige Fassung.
- `ready-for-ai-review`
  Formal vorbereitet und bereit für KI-Prüfung.
- `ai-approved`
  Gegen die Checkliste geprüft und von KI freigegeben.
- `author-approved`
  Von Daniel bewusst für die öffentliche Veröffentlichung freigegeben.
- `published`
  Tatsächlich live auf der Website.

## Freigaberegeln

### 1. Draft

Ein Text darf `draft` sein, wenn:

- Titel oder Struktur noch vorläufig sind
- Platzhalter noch enthalten sind
- einzelne Pflichtsektionen noch fehlen
- der Text noch nicht öffentlich tragfähig ist

### 2. Ready for AI Review

Ein Text darf `ready-for-ai-review` sein, wenn:

- alle Frontmatter-Pflichtfelder vorhanden sind
- die Kernaussage benannt werden kann
- die Zielrichtung des Textes klar ist
- der Text keine bloße Stichwortsammlung mehr ist

### 3. AI Approved

Ein Text darf `ai-approved` sein, wenn:

- die These in 1 bis 2 Saetzen formulierbar ist
- `Muster` und `Mechanik` klar unterscheidbar und vorhanden sind
- das Gegenargument fair und nicht als Strohmann formuliert ist
- der Handlungsvorschlag konkret ist
- die Prüffrage wirklich trennt statt nur rhetorisch zu wirken
- das Signal im Alltag beobachtbar ist
- keine Platzhalter mehr enthalten sind
- der Text mehr Erkenntnis als Pose liefert

### 4. Author Approved

Ein Text darf `author-approved` sein, wenn:

- Daniel den Text inhaltlich vertreten will
- Ton, Schärfe und Beispiele bewusst so gewollt sind
- der Text als öffentliche Aussage tragfähig ist
- die Zuspitzung nicht nur effektiv, sondern wahr ist

### 5. Published

Ein Text darf nur `published` werden, wenn:

- `ai_approved: true`
- `author_approved: true`
- alle Pflichtfelder vorhanden sind
- die Schlusssektionen `✓`, `?` und `!` enthalten sind
- kein Platzhaltertext enthalten ist

## Pflichtfelder

Jeder Text braucht im Frontmatter:

- `title`
- `slug`
- `date`
- `status`
- `language`
- `format`
- `summary`
- `tags`
- `thesis`
- `pattern`
- `mechanism`
- `counterargument`
- `action`
- `check_question`
- `signal`
- `ai_approved`
- `ai_approved_at`
- `ai_review_notes`
- `author_approved`
- `author_approved_at`
- `author_review_notes`

## Tag-Schreibweise

Tags werden als lesbare Begriffe geschrieben und beginnen mit einem Großbuchstaben. Deutsche Zusammensetzungen folgen der normalen Rechtschreibung; Eigennamen und technische Bezeichnungen behalten ihre übliche Schreibweise, zum Beispiel `Java` oder `KI`. Derselbe Begriff wird im gesamten Archiv einheitlich geschrieben.

## Harte Blocker

Ein Text darf nicht veröffentlicht werden, wenn:

- Pflichtfelder fehlen
- `TODO`, `xxx`, `spaeter`, `ergaenzen` oder andere Platzhalter enthalten sind
- nur Diagnose, aber keine erklaerte Mechanik vorhanden ist
- nur Kritik, aber kein Handlungsvorschlag vorhanden ist
- das Gegenargument nur karikiert wird
- die Schlusssektion austauschbar oder generisch ist
- nur die Ueberschrift stark ist, der Text aber die These nicht einloest

## Praktische Rollen

### Rolle der KI

Die KI hilft beim:

- Schärfen von Titel und These
- Verdichten der Struktur
- Ergänzen fairer Gegenargumente
- Prüfen gegen die interne Checkliste

Die KI ersetzt nicht die Autorenverantwortung.

### Rolle von Daniel

Daniel entscheidet:

- ob der Text wirklich sein Gedanke ist
- ob die Zuspitzung stimmt
- ob der Text öffentlich gewollt ist
- ob der Text live gehen soll

## Arbeitslogik

Der praktische Ablauf ist:

1. Daniel bringt Rohgedanke, Notiz oder Entwurf.
2. Die KI hilft beim Schärfen und Strukturieren.
3. Der Text wird auf `ready-for-ai-review` gesetzt.
4. Die KI prüft gegen diese Richtlinie.
5. Bei Bestehen wird `ai_approved` gesetzt.
6. Daniel liest die finale Fassung bewusst als Autor.
7. Bei Zustimmung wird `author_approved` gesetzt.
8. Erst danach darf der Text auf `published` gehen.

## Layout-Vorschau für Drafts

- `npm run build` baut ausschließlich die öffentliche Seite und entfernt vorhandene generierte Vorschauseiten. Die Markdown-Entwürfe unter `drafts/` bleiben erhalten.
- `npm run build:preview` baut zusätzlich lokale Entwurfsvorschauen unter `/texte/vorschau/`.
- `npm run preview:full` führt den Vorschau-Build aus und startet den lokalen HTTP-Server.
- Öffentliche Startseite und Textarchiv enthalten in keinem Build-Modus Vorschau-Links oder Entwurfszahlen. Die lokale Entwurfsübersicht ist direkt unter `http://localhost:4173/texte/vorschau/` erreichbar.
- `drafts/` und die erzeugten Dateien unter `texte/vorschau/` sind von Git ausgeschlossen. Vorschauseiten dürfen nicht mit `git add -f` aufgenommen werden. Vor einer Veröffentlichung `npm run build` ausführen; `.gitignore` allein schützt nicht beim Hochladen des gesamten Arbeitsverzeichnisses.
- Ohne lokale Drafts erzeugt der Vorschau-Build nur eine leere Entwurfsübersicht.

## Kurzregel

Kein Text ohne These. Kein Text ohne Mechanik. Kein Text ohne Gegenargument. Kein Text ohne Handlungsvorschlag. Kein Text ohne Prüffrage. Kein Text ohne Signal. Kein Publish ohne doppelte Freigabe.
