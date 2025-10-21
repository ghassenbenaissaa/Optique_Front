# Module Code Promo - Documentation

## 📋 Vue d'ensemble

Gestion des codes promo avec liste paginée, création et modification.

## 🗂️ Structure des fichiers

```
promocode/
├── index.jsx                      # Point d'entrée principal
├── types/
│   └── index.js                   # Types JSDoc (PromoCode)
├── services/
│   └── promocodeService.js        # Services API (CRUD codes promo)
└── components/
    ├── Tableau.jsx                # Liste paginée + recherche + suppression
    ├── Formulaire.jsx             # Ajout d'un code promo
    └── FormulaireModification.jsx # Modification d'un code promo
```

## ✅ Fonctionnalités

- Liste avec recherche client et pagination
- Création d'un code promo
- Modification d'un code promo
- Suppression avec confirmation (SweetAlert2)

## 🔌 Endpoints utilisés

```http
GET    /api/v1/codePromo/admin
POST   /api/v1/codePromo/add
PUT    /api/v1/codePromo/update
DELETE /api/v1/codePromo/delete/{id}
```

## 📦 Types disponibles (JSDoc)

```js
/** @typedef {Object} PromoCode
 *  @property {number} id
 *  @property {string} code
 *  @property {number} remisePourcentage
 *  @property {string} dateCreation // ISO string
 *  @property {string} dateExpiration // ISO string
 *  @property {boolean} [available]
 */
```

## 🎨 Design & libs

- TailwindCSS pour le style
- Icônes: Lucide (et Iconify pour les pictos)
- Notifications/confirmations: SweetAlert2
- Requêtes HTTP: axios (centralisé dans `services/`)

## 🔧 Personnalisation

- Modifier l'URL de base API dans `services/promocodeService.js`:
```js
const API_BASE_URL = 'http://localhost:8089/api/v1';
```
- Nombre d'éléments par page dans `components/Tableau.jsx` via `itemsPerPage` (10 par défaut)

## 🧭 Notes d'architecture

- Tous les appels API sont centralisés dans `services/promocodeService.js`.
- Les composants n'embarquent plus de logique backend.
- Les types et structures sont déclarés dans `types/index.js` (JSDoc), importables côté commentaires avec `import('../types').PromoCode`.
