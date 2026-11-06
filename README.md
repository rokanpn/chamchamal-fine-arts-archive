# Chamchamal Fine Arts Institute Digital Archive
### ئەرشیفی دیجیتاڵی پەیمانگای هونەرە جوانەکانی چەمچەماڵ

A museum-grade Progressive Web App (PWA) engineered with Next.js (App Router), TypeScript, Tailwind CSS, and Framer Motion. Built to curatorial standards akin to international art biennials and fine arts academies.



---

## 🎨 Design Tokens & Aesthetic Hierarchy

| Token Group | Value / Hex | Usage |
| :--- | :--- | :--- |
| **Obsidian** | `#0A0A0C` | Deep Gallery background base |
| **Obsidian Surface** | `#121215` | Layered cards, elevated panels |
| **Museum Parchment**| `#F5F3EC` | Off-white primary typography |
| **Fine Art Gold** | `#D4AF37` | Accent gold, active aura, seal badges |
| **Museum Secondary** | `#8E8D8A` | Muted editorial captions & labels |
| **Glass Borders** | `rgba(255, 255, 255, 0.08)` | Ultra-subtle museum frame dividers |

---

## 🌐 Bi-Directional Localization Architecture

- **Default Locale**: `ckb` (Kurdish Sorani) with `dir="rtl"`
- **Supported Locales**:
  - `ckb` — کوردی (Sorani Kurdish, RTL)
  - `ar` — العربية (Arabic, RTL)
  - `en` — English (Latin, LTR)
- **Zero-Layout-Shift Hydration**: Handled via `LanguageProvider` with persistent preference sync to `localStorage` and dynamic attribute injection (`<html dir="..." lang="...">`).
- **Typography Stack**:
  - Kurdish & Arabic: `Vazirmatn` (variable font)
  - Latin Display & Headings: `Cormorant Garamond` & `Cinzel`
  - Latin Neutral UI: `Inter`

---

## 📱 Mobile PWA Optimization

- **Viewport Geometry**: Full dynamic viewport height (`100dvh`) to prevent mobile navigation bar jitter.
- **Glassmorphic Navigation Shell**:
  - Floating top bar with archival seal and spring-animated language pill.
  - Floating bottom navigation with spring tactile feedback (`whileTap`), active gold glow aura (`layoutId`), and 4 core museum routes:
    1. **Gallery** (`پێشانگا` / `المعرض` / `Gallery`)
    2. **3D Scan** (`سکانی ۳D` / `المسح ثلاثي الأبعاد` / `3D Scan`)
    3. **Tools/Atelier** (`کەرەستەکان` / `الأدوات` / `Atelier`)
    4. **Students/Artists** (`خوێندکاران` / `الطلاب` / `Artists`)
