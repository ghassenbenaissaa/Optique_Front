# Module Forme - Documentation

## Vue d'ensemble

Module de gestion des formes de produits (référentiel) avec liste paginée, ajout et modification avec upload d'image.

## Structure des fichiers

```
forme/
├── index.jsx                      # Point d'entrée de la page
├── types/
│   └── index.js                   # Définitions de types JSDoc (Forme, erreurs)
├── services/
│   └── formeService.js            # Appels API centralisés (axios)
└── components/
    ├── Tableau.jsx                # Liste paginée + recherche + suppression
    ├── Formulaire.jsx             # Formulaire d'ajout (upload image + preview)
    └── FormulaireModification.jsx # Formulaire d'édition (upload image + preview)
```

Cette architecture est alignée sur la page `monture/` (dossiers `types/`, `services/`, `components/`, et README).

## Services/API

Les appels API sont centralisés dans `services/formeService.js` et utilisent `axios`.

Endpoints utilisés:

```
GET    /api/v1/formeProduit/admin
POST   /api/v1/formeProduit/add
PUT    /api/v1/formeProduit/update
DELETE /api/v1/formeProduit/delete/{id}
```

Le service expose les méthodes:
- `getFormes()`
- `addForme(data)`
- `updateForme(data)`
- `deleteForme(id)`

## Types

Les types JSDoc sont définis dans `types/index.js`:
- `Forme` (id, name, imageUrl?, isAvailable?)
- `ValidationErrors`
- `ApiErrorResponse`

Ces typedefs servent de documentation et facilitent l'auto-complétion.

## Composants

- `Tableau.jsx`: affiche la liste des formes, recherche côté client, pagination, suppression avec confirmation (SweetAlert2). Les données sont récupérées via `formeService.getFormes()`.
- `Formulaire.jsx`: création d'une forme (validations côté client + upload d'image), appel `formeService.addForme()`.
- `FormulaireModification.jsx`: édition d'une forme existante, appel `formeService.updateForme()`.

Toutes les interactions réseau sont externalisées dans `services/` et aucun type n'est défini dans les composants.

## Personnalisation

- Modifier l'URL de base de l'API dans `services/formeService.js` via la constante `API_BASE_URL`.
- Ajuster le nombre d'éléments par page dans `components/Tableau.jsx` via `itemsPerPage`.

## Notes

- Ne pas renommer les fichiers existants pour préserver l’intégration avec les routes.
- Les validations côté client sont conservées, seules les responsabilités (services/types) ont été externalisées.
