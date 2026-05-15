# Navigation Bar – Design-Spezifikation

## Referenz
Orientierung am Navbar-Design von **n8n.io** (Stand 2025).

---

## Grundstruktur

Die Navigation ist eine **floating navbar**, die über dem Seiteninhalt schwebt und beim Scrollen fixiert bleibt (`position: sticky` / `fixed`).

### Layout
- Horizontal zentriert, mit **max-width** (z.B. `1200px`) und seitlichem `margin: auto`
- Die Navbar hat **links/rechts Padding** und steht **nicht** bündig am Bildschirmrand
- Sie schwebt mit einem **Abstand von ca. 12–16px zum oberen Seitenrand**
- Abgerundete Ecken: `border-radius: 16px` (pill-/kapselförmig)

### Inhalt (von links nach rechts)
1. **Logo** (ganz links)
2. **Navigationslinks** (mittig oder links neben dem Logo)

**Hinweis: Es gibt KEINE CTA-Buttons rechts in der Navbar. Die Navigation besteht nur aus Logo und Links.**

---

## Glasmorphismus-Effekt (Glass Style)

Dies ist das **zentrale Designelement** der Navbar.

```css
/* Glasmorphismus-Kern */
.navbar {
  background: rgba(15, 15, 15, 0.50);        /* Dunkel, stark transparent */
  backdrop-filter: blur(20px);                /* Weichzeichnung des Hintergrunds */
  -webkit-backdrop-filter: blur(20px);        /* Safari-Kompatibilität */
  border: 1px solid rgba(255, 255, 255, 0.08); /* Sehr subtiler heller Rand */
  box-shadow:
    0 4px 30px rgba(0, 0, 0, 0.15),           /* Weicher Schatten nach unten */
    inset 0 1px 0 rgba(255, 255, 255, 0.05);  /* Feiner innerer Lichtschein oben */
}
```

### Wichtige Hinweise zum Glaseffekt
- Der `backdrop-filter: blur()` sorgt dafür, dass Inhalte **hinter** der Navbar weichgezeichnet durchscheinen
- Die Transparenz (`rgba`-Alpha) muss so gewählt sein, dass der Effekt **sichtbar** ist – nicht zu deckend (>0.85), nicht zu durchsichtig (<0.3)
- Der Effekt ist besonders gut erkennbar, wenn die Seite ein **Hero-Bild** oder farbigen Content hinter der Navbar hat
- Funktioniert NICHT ohne `-webkit-backdrop-filter` in Safari

---

## Farben & Typografie

### Dunkles Theme (wie n8n.io)
| Element               | Wert                              |
|----------------------|-----------------------------------|
| Navbar-Hintergrund    | `rgba(15, 15, 15, 0.50)`         |
| Text (normal)         | `rgba(255, 255, 255, 0.7)`       |
| Text (hover)          | `rgba(255, 255, 255, 1.0)`       |
| Aktiver Link          | `#ffffff` mit dezenter Unterstreichung oder Hintergrund |
| Rand                  | `rgba(255, 255, 255, 0.08)`      |

### Helles Theme (Alternative)
| Element               | Wert                              |
|----------------------|-----------------------------------|
| Navbar-Hintergrund    | `rgba(255, 255, 255, 0.55)`      |
| Text (normal)         | `rgba(0, 0, 0, 0.7)`             |
| Text (hover)          | `rgba(0, 0, 0, 1.0)`             |
| Rand                  | `rgba(0, 0, 0, 0.06)`            |

### Schrift
- Font-family: System-Font-Stack oder die Projektschrift
- Font-size: `14px–15px` für Links
- Font-weight: `500` (medium)
- Letter-spacing: `0.01em`

---

## Verhalten & Interaktionen

### Scroll-Verhalten
- Bei `scrollY === 0`: Navbar kann etwas transparenter sein oder keinen Schatten haben
- Bei `scrollY > 50`: Voller Glaseffekt mit Schatten aktivieren (sanfte Transition)

```css
.navbar {
  transition: background 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
}
```

### Hover auf Links
- Sanfter Übergang von `opacity: 0.7` → `opacity: 1.0`
- Optional: dezenter Hintergrund-Highlight (`rgba(255,255,255,0.08)` mit `border-radius: 8px`)
- Transition: `0.2s ease`

### Dropdown-Menüs – KRITISCH: Hover-Brücke

Die Dropdowns sind das fehleranfälligste Element. Folgende Regeln sind **zwingend**:

#### Visuelles Design
- Gleicher Glasmorphismus-Stil wie die Navbar
- Erscheinen mit sanfter Animation (`opacity` + leichtes `translateY`)
- Abgerundete Ecken (`border-radius: 12px`)
- Gleicher `backdrop-filter: blur(20px)`

#### ⚠️ HOVER-BRÜCKE (häufigster Fehler – MUSS gelöst werden)

**Problem:** Zwischen dem Menüpunkt in der Navbar und dem Dropdown-Popup gibt es oft einen visuellen Abstand (Gap). Wenn der Nutzer die Maus vom Menüpunkt nach unten zum Dropdown bewegt, verlässt der Cursor den Hover-Bereich des Menüpunkts → das Dropdown verschwindet sofort → der Nutzer kann das Dropdown nie erreichen.

**Lösung – ALLE drei Techniken gleichzeitig anwenden:**

1. **Unsichtbare Brücke (Pflicht):**
   Das Eltern-Element (`.nav-item`) muss einen unsichtbaren Bereich enthalten, der den Gap überbrückt. Dies kann ein `::after`-Pseudo-Element oder ein unsichtbares `<div>` sein.

```css
/* Variante A: Pseudo-Element als unsichtbare Brücke */
.nav-item {
  position: relative;
}

.nav-item::after {
  content: '';
  position: absolute;
  bottom: -20px;       /* Muss mindestens so groß sein wie der Gap */
  left: 0;
  width: 100%;
  height: 20px;        /* Unsichtbare Hover-Brücke */
  background: transparent;
}

/* Variante B: Das Dropdown selbst hat negativen Margin oder padding-top */
.dropdown {
  margin-top: 0;          /* KEIN positiver margin-top! */
  padding-top: 12px;      /* Visuellen Abstand über padding lösen, nicht margin */
}
```

2. **Verzögertes Schließen (Pflicht):**
   Das Dropdown darf NICHT sofort bei `mouseleave` schließen. Es muss eine Verzögerung von mindestens **150–300ms** geben.

```javascript
// Konzept (gilt für jedes Framework):
let closeTimeout;

navItem.addEventListener('mouseleave', () => {
  closeTimeout = setTimeout(() => {
    dropdown.close();
  }, 200); // 200ms Verzögerung
});

navItem.addEventListener('mouseenter', () => {
  clearTimeout(closeTimeout); // Schließen abbrechen wenn Maus zurückkehrt
});

// WICHTIG: Dasselbe mouseenter/clearTimeout auch auf dem Dropdown-Element selbst!
dropdown.addEventListener('mouseenter', () => {
  clearTimeout(closeTimeout);
});

dropdown.addEventListener('mouseleave', () => {
  closeTimeout = setTimeout(() => {
    dropdown.close();
  }, 200);
});
```

3. **HTML-Struktur (Pflicht):**
   Das Dropdown MUSS ein **Kind-Element** des Navigationslinks sein, NICHT ein Geschwister-Element. Nur so erbt es den Hover-State des Eltern-Elements.

```html
<!-- ✅ RICHTIG: Dropdown ist Kind von .nav-item -->
<li class="nav-item">
  <a href="#">Produkte</a>
  <div class="dropdown">
    <!-- Dropdown-Inhalt -->
  </div>
</li>

<!-- ❌ FALSCH: Dropdown ist Geschwister -->
<li class="nav-item">
  <a href="#">Produkte</a>
</li>
<div class="dropdown">
  <!-- Wird nie erreichbar sein! -->
</div>
```

#### Zusammenfassung der Dropdown-Regeln
- Dropdown ist **immer** ein Kind-Element des Nav-Items
- Unsichtbare Brücke via `::after` oder `padding-top` auf dem Dropdown
- Verzögertes Schließen (min. 150ms) bei `mouseleave`
- `mouseenter` auf dem Dropdown selbst muss das Schließen abbrechen
- Erst wenn WEDER Nav-Item NOCH Dropdown gehovert werden UND die Verzögerung abgelaufen ist, darf das Dropdown schließen

---

## Responsive / Mobile

### Breakpoint (z.B. < 768px)
- Hamburger-Menü-Icon rechts
- Logo links
- Menü öffnet sich als **Full-Screen-Overlay** oder **Slide-In-Panel**
- Das geöffnete Menü verwendet denselben Glasmorphismus-Stil
- Menü-Animation: `transform: translateY(-10px)` → `translateY(0)` + `opacity`

---

## Prüf-Checkliste (für Claude Code)

Vor Ausgabe prüfen:
- [ ] Navbar schwebt mit Abstand zum oberen Rand (nicht bündig)
- [ ] `border-radius` ist sichtbar (≥12px, kapselförmig)
- [ ] `backdrop-filter: blur()` UND `-webkit-backdrop-filter` sind gesetzt
- [ ] Hintergrund-Alpha ist genau `0.50`
- [ ] Subtiler Border (`rgba` mit niedrigem Alpha) ist vorhanden
- [ ] Box-Shadow ist vorhanden
- [ ] Hover-Effekte auf Links funktionieren
- [ ] **Keine CTA-Buttons in der Navbar**
- [ ] Mobile Hamburger-Menü ist vorhanden
- [ ] Scroll-Verhalten mit Transition ist implementiert
- [ ] **DROPDOWN-HOVER-BRÜCKE:** Dropdown ist Kind-Element des Nav-Items (nicht Geschwister)
- [ ] **DROPDOWN-HOVER-BRÜCKE:** Unsichtbare Brücke (::after oder padding-top) überbrückt den Gap
- [ ] **DROPDOWN-HOVER-BRÜCKE:** Verzögertes Schließen (min. 150ms) ist implementiert
- [ ] **DROPDOWN-HOVER-BRÜCKE:** mouseenter auf dem Dropdown bricht das Schließen ab
- [ ] **MANUELL TESTEN:** Mit der Maus langsam vom Menüpunkt nach unten zum Dropdown fahren – es darf NICHT verschwinden