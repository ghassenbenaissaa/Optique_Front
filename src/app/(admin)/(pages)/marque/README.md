# Module Marque - Documentation

## Vue d'ensemble

Module de gestion des marques avec une architecture alignée sur la page Monture. Les composants sont dépourvus d'appels réseau et utilisent un service dédié. Les types/structures sont centralisés.

## Structure des fichiers

```
marque/
├── index.jsx                      # Point d'entrée principal
├── types/
│   └── index.js                   # Types/structures (JSDoc)
├── services/
│   └── marqueService.js           # Services API (axios)
└── components/
    ├── Formulaire.jsx             # Création d'une marque
    ├── FormulaireModification.jsx # Modification d'une marque
    └── Tableau.jsx                # Liste paginée + actions
```

## Règles d'architecture

- Composants dans `components/` uniquement UI + état local léger.
- AUCUN appel réseau dans les composants: utiliser `services/marqueService.js`.
- Types/interfaces/documentation centralisés dans `types/index.js`.
- Ne pas renommer les fichiers existants; seulement organiser/importer.

## Endpoints utilisés

```text
GET    /api/v1/marque/admin
POST   /api/v1/marque/add
PUT    /api/v1/marque/update
DELETE /api/v1/marque/delete/{id}
```

## Personnalisation

- Modifier l'URL de base de l'API dans `services/marqueService.js` :
```js
const API_BASE_URL = 'http://localhost:8089/api/v1';
```
- Types disponibles dans `types/index.js` (JSDoc): `Marque`, `MarqueDefaults`.

## Notes

- Les composants gèrent les validations de formulaire et l'aperçu d'image, mais délèguent l'I/O au service.
- La liste utilise SweetAlert2 pour les confirmations et messages post-actions.
