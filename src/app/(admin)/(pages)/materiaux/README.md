# Module Matériaux - Documentation

## 📋 Vue d'ensemble

Gestion des matériaux utilisés pour les produits (référentiel simple) avec liste paginée, création et modification.

## 🗂️ Structure des fichiers

```
materiaux/
├── index.jsx                     # Point d'entrée principal
├── types/
│   └── index.js                  # Types JSDoc (Materiau)
├── services/
│   └── materiauxService.js       # Services API (CRUD matériaux)
└── components/
    ├── Tableau.jsx               # Liste paginée + recherche + suppression
    ├── Formulaire.jsx            # Ajout d'un matériau
    └── FormulaireModification.jsx# Modification d'un matériau
```

## ✅ Fonctionnalités

- Liste avec recherche client et pagination
- Création d'un matériau
- Modification d'un matériau
- Suppression avec confirmation (SweetAlert2)

## 🔌 Endpoints utilisés

```http
GET    /api/v1/materiauProduit/admin
POST   /api/v1/materiauProduit/add
PUT    /api/v1/materiauProduit/update
DELETE /api/v1/materiauProduit/delete/{id}
```

## 📦 Types disponibles (JSDoc)

```js
/** @typedef {Object} Materiau
 *  @property {number} id
 *  @property {string} name
 *  @property {boolean} [available]
 */
```

## 🎨 Design & libs

- TailwindCSS pour le style
- Icônes: react-icons (lucide pour d'autres modules)
- Notifications/confirmations: SweetAlert2
- Requêtes HTTP: axios (centralisé dans `services/`)

## 🔧 Personnalisation

- Modifier l'URL de base API dans `services/materiauxService.js`:
```js
const API_BASE_URL = 'http://localhost:8089/api/v1';
```
- Nombre d'éléments par page dans `components/Tableau.jsx` via `itemsPerPage` (10 par défaut)

## 🧭 Notes d'architecture

- Tous les appels API sont centralisés dans `services/materiauxService.js`.
- Les composants n'embarquent plus de logique backend.
- Les types et structures sont déclarés dans `types/index.js` (JSDoc), importables côté commentaires avec `import('../types').Materiau`.
