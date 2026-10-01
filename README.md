# Rebranding-Roulette

Eine Seite für die Gruppenarbeit im Modul **Strategisches Marketing**: Jede Gruppe bekommt zufällig eine bekannte Marke und eine neue Zielgruppe bzw. Branche, auf die sie die Marke neu ausrichten soll (z. B. Süßigkeiten für die Fitness-Bubble).

## Benutzung

`index.html` im Browser öffnen, fertig. Es wird kein Server und keine Installation gebraucht.

- **Gruppen** − / +: Anzahl der Gruppen (Standard 5, maximal 10).
- **Alle auslosen**: Jede Gruppe erhält eine Marke und eine Zielgruppe. Keine Marke und keine Zielgruppe wird doppelt vergeben.
- **Marke / Zielgruppe** neben jeder Gruppe: nur diesen Teil neu ziehen.
- **Ergebnis kopieren**: Auslosung als Text, z. B. für Moodle, Teams oder die Tafel.
- **Arbeitsphase**: Timer (10–60 min) mit Signalton am Ende.
- **Vollbild**: für den Beamer.
- **Listen bearbeiten** (unten): Marken und Zielgruppen anpassen, eine pro Zeile.
  - Marken: `Name | heutige Zielgruppe | Branche`
  - Zielgruppen: `Name | Stichworte`

Die letzte Auslosung und eigene Listen werden im Browser (localStorage) gespeichert und bleiben nach dem Neuladen erhalten.

Kombinationen, die zu nah an der heutigen Zielgruppe liegen (z. B. Red Bull → Gamer & E-Sport) oder nicht passen (Alkoholmarken → Gen Z auf TikTok), werden bei den Standardlisten vermieden. Die Liste dafür steht als `AVOID` im Skript in `index.html`.
