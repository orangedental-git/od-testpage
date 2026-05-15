# Aufgabe: Redesign der Website orangedental.de

## Ziel
Erstelle einen vollständigen **Klon** der Website [www.orangedental.de](https://www.orangedental.de) mit **neuem, modernem Design** – aber mit **exakt demselben Inhalt**.

---

## Schritt 1: Analyse der bestehenden Seite

Bevor du irgendetwas erstellst:
1. Rufe die Seite **www.orangedental.de** auf und analysiere sie vollständig
2. Erfasse **alle Sektionen** in ihrer exakten Reihenfolge
3. Erfasse **alle Texte wörtlich** (Überschriften, Fließtexte, Button-Beschriftungen, Footer-Texte)
4. Erfasse die **Navigation** mit allen Menüpunkten und Untermenüpunkten
5. Erfasse alle **Bild-Referenzen** und deren Positionen
6. Erfasse die **Meta-Informationen** (Seitentitel, Beschreibungen)

Erstelle dir intern eine vollständige Bestandsaufnahme, bevor du mit dem Coding beginnst.

---

## Schritt 2: Design-Dokumente lesen

Lies vor dem Coding **alle Dateien im Verzeichnis `/docs/`** und befolge die darin enthaltenen Regeln. Insbesondere:

- **`/docs/nav.md`** – Komplette Design-Spezifikation für die Navigationsleiste (orientiert am Stil von n8n.io, Glasmorphismus-Effekt mit Backdrop-Blur). Setze diese Vorgaben **exakt** um, besonders die Hover-Brücke für Dropdown-Menüs.
- Weitere Dateien in `/docs/`, falls vorhanden, ebenfalls beachten.

---

## Was sich ändern darf (neues Design)

- Farbschema, Farbverläufe, Akzentfarben
- Typografie (Schriftarten, Größen, Gewichtungen)
- Layout, Abstände, Proportionen
- Animationen, Transitions, Hover-Effekte
- Bildgrößen, Bildausschnitte, Bildpositionen
- Schatten, Rundungen, Rahmen
- Allgemeine visuelle Modernisierung

## Was sich NICHT ändern darf (Inhalt bleibt identisch)

- **Texte:** Jede Überschrift, jeder Absatz, jeder Button-Text wird **wörtlich** übernommen. Kein Wort wird hinzugefügt, entfernt oder umformuliert.
- **Sektionsreihenfolge:** Die Reihenfolge aller Sektionen auf der Seite bleibt **exakt** gleich.
- **Navigation:** Alle Menüpunkte und Untermenüpunkte bleiben identisch (Bezeichnungen und Struktur).
- **Seitenstruktur:** Keine Sektionen weglassen, keine neuen Sektionen erfinden.
- **Bilder:** Dieselben Bilder verwenden (original URLs beibehalten oder Platzhalter mit exakt gleicher Beschreibung).
- **Links:** Alle verlinkten Ziele bleiben gleich.
- **Footer:** Alle Footer-Inhalte (Adresse, Kontaktdaten, Links, Copyright) bleiben identisch.

---

## Technische Vorgaben

- Sauberes, semantisches HTML5
- Modernes CSS (Custom Properties, Flexbox/Grid)
- Responsives Design (Mobile-first, Breakpoints für Tablet und Desktop)
- Performant (keine unnötigen Bibliotheken)
- Barrierefreiheit beachten (Alt-Texte, Kontraste, Fokus-States)

---

## Prüf-Checkliste (vor Abgabe durchgehen)

### Inhalt
- [ ] Alle Sektionen der Originalseite sind vorhanden
- [ ] Die Reihenfolge der Sektionen ist identisch zum Original
- [ ] Alle Überschriften stimmen **wörtlich** mit dem Original überein
- [ ] Alle Fließtexte stimmen **wörtlich** mit dem Original überein
- [ ] Alle Button-Texte stimmen **wörtlich** mit dem Original überein
- [ ] Keine neuen Texte wurden erfunden
- [ ] Keine Sektionen wurden weggelassen
- [ ] Footer-Inhalte sind vollständig und identisch

### Navigation
- [ ] Alle Menüpunkte sind vorhanden und korrekt benannt
- [ ] Alle Untermenüpunkte sind vorhanden und korrekt benannt
- [ ] Die Vorgaben aus `/docs/nav.md` wurden vollständig umgesetzt
- [ ] Dropdown-Hover-Brücke funktioniert (Maus kann vom Menüpunkt zum Dropdown fahren, ohne dass es verschwindet)

### Design
- [ ] Visuell klar unterscheidbar vom Original (neues Design, nicht Copy-Paste)
- [ ] Responsive auf Mobile, Tablet und Desktop
- [ ] Glasmorphismus-Navbar wie in `/docs/nav.md` spezifiziert

### Technik
- [ ] Valides HTML5
- [ ] Keine Console-Errors
- [ ] Bilder haben Alt-Texte
- [ ] Seite lädt performant

---

## Wichtige Regeln

1. **Im Zweifel: Original beibehalten.** Wenn du dir unsicher bist, ob ein Text oder eine Sektion existiert, prüfe die Originalseite erneut.
2. **Nichts erfinden.** Du bist Designer, nicht Texter. Deine Aufgabe ist ein neues visuelles Kleid für bestehenden Inhalt.
3. **Dokumente in `/docs/` haben Vorrang.** Wenn dort etwas spezifiziert ist, setze es genau so um.
4. Nachfragen, wenn etwas unklar ist.

## Optimierung

1. Wenn möglich, lade dir die Webseite www.orangedental.de runter in einen eigenen Unterordner hier im Projekt, um wiederholtes Zugreifen im Netz zu vermeiden.
2. Dasselbe gilt für n8n.io und jede weitere Webseite falls weitere benötigt werden.
3. Nutze sinnvolle Aufteilungen im Code - also css/js Dateien in Unterverzeichnisse, etc.