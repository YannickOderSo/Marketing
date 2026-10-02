# Rebranding-Roulette

Interaktive Seite für eine Unterrichtsstunde im Modul **Strategisches Marketing** bei Prof. Arend-Fuchs (Hochschule Kaiserslautern). Eine Unterrichtseinheit von **Yannick Heisler** und **Elias Knauber**.

Online: **https://yannickoderso.github.io/Marketing/**

 Jede Gruppe bekommt zufällig eine bekannte Marke und eine neue Zielgruppe, zum Beispiel Süßigkeiten für die Fitness-Bubble. Danach arbeitet jede Gruppe in ihrem eigenen Arbeitsbereich das Rebranding aus und präsentiert es als Pitch.

## Ablauf in der Stunde

1. **Auslosung** (am Beamer): Gruppen anlegen (1–10), „Alle auslosen“, Namen eintragen. Einzelne Marken oder Zielgruppen lassen sich neu ziehen. Ein Timer begleitet die Arbeitsphase.
2. **Arbeitsbereich öffnen**: Jede Gruppe scannt ihren QR-Code („QR-Codes zeigen“) oder wählt auf der Startseite Gruppe, Marke und Zielgruppe aus.
3. **Acht Felder bearbeiten**, jeweils mit Leitfragen und Live-Vorschau:
   1. Ist-Analyse mit Markensteuerrad nach Esch und Wettbewerbern
   2. Persona der neuen Zielgruppe (Live-Personakarte)
   3. Markenstrategie: Regler für Markenfit und Risiko, Matrix mit Empfehlung, Auswahl aus Repositionierung, Markendehnung, Submarke und neuer Marke
   4. Markenkern neu: Markensteuerrad nach dem Rebranding im Vergleich zu heute
   5. Positionierung: Positionierungskreuz mit verschiebbaren Punkten und Positionierungsstatement
   6. Marketing-Mix (4P)
   7. Pitch: Name, Claim, Kampagnenmotiv, Farbe und Live-Plakat
   8. Logo-Studio: Prompt-Baukasten für KI-Bildgeneratoren (Logo-Typ, Stil, Symbol, Farben, Evolution oder Revolution), Prompt auf Englisch oder Deutsch kopieren, Generator öffnen (Copilot, ChatGPT, Gemini, Firefly, Canva) und bis zu sechs Entwürfe hochladen oder mit Strg+V einfügen. Der Favorit erscheint auf Plakat und Pitch-Board.
4. **Pitch-Board**: Alles auf einer Seite, mit Export als Text oder Markdown-Datei und Druck als PDF.
5. **Pitch als Folien**: „Als Folien präsentieren“ macht aus dem Pitch-Board acht Vollbild-Folien (Titel, Ausgangslage, Persona, Strategie und Markenkern, Positionierung, 4P, Kampagne, Abschluss) mit Pitch-Timer.
   - Weiter: Pfeil rechts, Leertaste, Bild runter (Presenter-Klicker), Klick auf die Folie oder Wischen
   - Zurück: Pfeil links oder Bild hoch; Pos1/Ende springen zur ersten/letzten Folie; F schaltet Vollbild
   - Esc beendet die Präsentation; das Drucker-Symbol gibt alle Folien im Querformat als PDF aus

**Musterbeispiel** (Menüpunkt „Beispiel“): Ein komplett ausgefüllter Arbeitsbereich „Haribo → Fitness-Bubble“ mit allen acht Feldern, Pitch-Board und Folien, nur zum Ansehen. In jedem Feld führt der Link „So sieht das im Musterbeispiel aus“ direkt zum passenden Feld im Beispiel. Haribo und die Fitness-Bubble werden deshalb nicht ausgelost. Die Inhalte stehen in `js/muster.js`.

Alle Eingaben werden automatisch im Browser des jeweiligen Geräts gespeichert (localStorage). Es werden keine Daten an einen Server geschickt. Die Bilder entstehen im Bildgenerator, den die Gruppe selbst öffnet. Die Seite schickt keine Prompts weiter.

## Online stellen (für die QR-Codes)

Die QR-Codes funktionieren nur, wenn die Seite unter einer Internetadresse erreichbar ist. Das Repository ist öffentlich, daher geht das kostenlos mit GitHub Pages:

1. [Settings → Pages](https://github.com/YannickOderSo/Marketing/settings/pages) öffnen.
2. Unter „Build and deployment“ bei **Source** „Deploy from a branch“ wählen.
3. Bei **Branch** `claude/inspiring-brahmagupta-p39448` und den Ordner `/ (root)` auswählen, dann **Save**.
4. Nach ein bis zwei Minuten ist die Seite erreichbar unter **https://yannickoderso.github.io/Marketing/**

Jeder neue Push auf diesen Branch aktualisiert die Seite automatisch. Die Datei `.nojekyll` sorgt dafür, dass GitHub die Dateien unverändert ausliefert.

Lokal lässt sich `index.html` auch direkt im Browser öffnen. Dann öffnen Gruppen ihren Arbeitsbereich über die Startseite statt per QR-Code.

## Anpassen

| Was | Wo |
| --- | --- |
| Hochschule, Modul, Professorin, Semester, Autoren, Pitch-Dauer | `js/config.js` |
| Logo | `assets/hskl-logo.png` |
| Farben (aus dem HS-KL-Logo: Cyan, Petrol, Grün, Lime) | ganz oben in `css/style.css`, Abschnitt „HS-KL Farben“ |
| Marken, Zielgruppen, gesperrte Kombinationen | `js/data.js` oder auf der Seite unter „Listen bearbeiten“ |
| Musterbeispiel (Texte, Logo-Entwürfe) | `js/muster.js`, Grafiken in `assets/muster-logo-*.svg` |

## Dateien

- `index.html` – Seitengerüst
- `css/style.css` – Gestaltung inkl. Dark Mode und Druckansicht
- `js/config.js` – Einstellungen
- `js/data.js` – Standardlisten
- `js/app.js` – Logik (Auslosung, Arbeitsbereiche, Pitch-Board)
- `vendor/qrcode.js` – QR-Code-Generator von Kazuhiko Arase (MIT-Lizenz)
