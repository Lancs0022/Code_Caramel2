# Project Caramel 🎂

Expérience web interactive d'anniversaire, avec mise en scène progressive, animations cinématiques, photos, lettre interactive, musique et album secret.

Pas une carte d'anniversaire classique — une petite expérience narrative premium.

---

## Vision

Créer une expérience personnelle qui donne l'impression d'avoir été préparée spécialement pour la personne concernée.

**Progression narrative :**

```
Mystère → Curiosité → Révélation → Célébration → Parenthèse visuelle
→ Lettre → Vœux → Fausse fin → Album secret → Célébration finale
```

**Priorité :** Émotion > Narration > Élégance > Effets visuels

Chaque animation a une fonction. Chaque section sert l'histoire. Pas d'effets gratuits ni de surcharge visuelle.

---

## Stack

**Actuelle**
- React 19 / React DOM 19
- TypeScript
- Vite 8
- Tailwind CSS 4 (`@tailwindcss/vite`)
- FontAwesome 6
- Google Fonts
- Web Audio API

**Direction cible**
- Framer Motion ou animations CSS ciblées
- HTML5 Audio API ou Web Audio API selon besoin
- WebP pour les images optimisées

Priorité : performance et simplicité.

---

## Architecture

```
src/
├── components/
│   ├── AudioController.tsx
│   ├── FlashbangTransition.tsx
│   ├── IntroSequence.tsx
│   └── Phase2.tsx
├── App.tsx
├── main.tsx
├── index.css
└── vite-env.d.ts
```

- **`App.tsx`** — orchestre le cycle principal (`intro → transitioning → main`)
- **`IntroSequence`** — séquence d'introduction, progression au clic, calcul de la position du bouton final, déclenchement de la transition
- **`FlashbangTransition`** — anime une expansion circulaire depuis l'origine réelle du bouton, révèle la Phase 2
- **`Phase2`** — Hero, ambiance visuelle, base du contenu narratif principal
- **`AudioController`** — contrôle de l'état audio (lecture/pause), interface flottante

**Structure cible** (à terme) :

```
src/
├── components/
│   ├── AudioController.tsx
│   ├── FlashbangTransition.tsx
│   ├── IntroSequence.tsx
│   ├── Phase2.tsx
│   ├── HeroSection.tsx
│   ├── ScrapbookScrollytelling.tsx
│   ├── InteractiveEnvelope.tsx
│   ├── LetterContent.tsx
│   ├── WishesGrid.tsx
│   ├── FakeEndSection.tsx
│   ├── SecretAlbum.tsx
│   └── GrandFinale.tsx
├── content/
│   └── birthdayContent.ts
├── assets/
│   ├── photos/
│   │   ├── original/
│   │   ├── edited/
│   │   └── collages/
│   ├── ai/
│   └── audio/
├── animations/
├── App.tsx
├── main.tsx
└── index.css
```

Séparation claire : **contenu ≠ composants ≠ animations ≠ assets**, pour pouvoir changer les textes, photos ou l'audio sans toucher la logique.

---

## Parcours de l'expérience

### Phase 1 — Introduction
Écran plein viewport, fond sombre, particules discrètes, texte progressif contrôlé par l'utilisateur.

### Transition Flashbang
Au clic final : réaction du bouton → récupération de son origine réelle → onde lumineuse circulaire → bloom/blur → démarrage audio → révélation de la Phase 2. Cinématique, jamais un simple fade.

### Phase 2 — Anniversaire
Nouvelle ambiance (crème, doré, rose poudré, brun chaud), Hero d'ouverture, puis :

- **Scrapbook Scrollytelling** — composition éditoriale animée autour des photos (superpositions, rotations, polaroids, masking tape, masques organiques), le texte reste l'ancrage
- **Lettre interactive** (`InteractiveEnvelope`) — enveloppe qui s'ouvre en 3D, rabat, sortie de la lettre, mode lecture
- **Vœux** — 9 cartes Liquid Glass qui apparaissent progressivement
- **Fausse fin** — réduction progressive des effets et de la musique, puis relance vers la dernière surprise

### Phase 3 — Album secret
- Album interactif construit à partir de la banque de photos (collages, polaroids, zoom, transitions au scroll)
- Deux œuvres visuelles générées par IA, mises en avant comme pièces maîtresses
- Célébration finale (confettis, particules, musique, signature finale)

---

## Direction artistique

**Style :** Premium, théâtral, chaleureux, élégant, moderne, personnel

**Techniques visuelles :** Liquid Glass, glassmorphism, scrapbook, polaroid, scrollytelling, transitions cinématiques, particules, confettis, profondeur, blur, glow léger

**À éviter :** template birthday générique, grille photo classique partout, surcharge d'animations, emojis dans l'UI, ton trop romantique, faux souvenirs

### Typographie
| Usage | Police |
|---|---|
| Titres | Playfair Display |
| Narration | Lora |
| Signatures | Great Vibes / Caveat |
| UI | Poppins |

### Couleurs
```
Crème   #FFF9F0
Doré    #F7C56E
Brun    #7A4E3A
+ rose doux, rose poudré, beige chaud, blanc translucide
```

### Icônes
FontAwesome 6 uniquement, pas d'emojis. Exemples : `fa-sparkles`, `fa-gift`, `fa-heart`, `fa-cake-candles`, `fa-envelope-open-text`, `fa-champagne-glasses`, `fa-volume-high`.

---

## Performance

Mobile first, optimisé pour appareils modestes.

- Limiter le nombre de particules, le blur permanent, les effets GPU et les animations hors viewport
- Respecter `prefers-reduced-motion`
- Images en WebP, lazy loading, dimensions explicites, compression des assets
- Chargement progressif de l'album et des images lourdes (pas de chargement haute résolution dès le premier écran)

---

## Développement

```bash
# Installer les dépendances
pnpm install

# Lancer en développement
pnpm dev

# Build de production
pnpm build

# Prévisualiser le build
pnpm preview

# Formatage
pnpm run format
```