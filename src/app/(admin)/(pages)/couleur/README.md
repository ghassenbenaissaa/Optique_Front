# Module Couleur - Documentation

## Vue d'ensemble

Module de gestion des couleurs avec liste paginée, ajout et modification. Architecture alignée sur la page `monture` (séparation components/services/types + README).

## Structure des fichiers

```
couleur/
├── index.jsx                      # Point d'entrée principal
├── types/
│   └── index.js                   # Types et constantes (HEX_COLOR_REGEX, etc.)
├── services/
│   └── couleurService.js          # Services API (axios)
└── components/
    ├── Tableau.jsx                # Liste paginée, recherche, suppression (SweetAlert2)
    ├── Formulaire.jsx             # Formulaire d'ajout
    └── FormulaireModification.jsx # Formulaire d'édition
```

## Endpoints utilisés

```http
GET    /api/v1/couleur/admin
POST   /api/v1/couleur/add
PUT    /api/v1/couleur/update
DELETE /api/v1/couleur/delete/{id}
```

## Services

Fichier: `services/couleurService.js`
- getAllCouleurs(): Promise<Couleur[]> — Récupère la liste des couleurs (admin)
- addCouleur(data): Promise<any> — Ajoute une couleur { name, codeHex }
- updateCouleur(data): Promise<any> — Met à jour une couleur { id, name, codeHex }
- deleteCouleur(id): Promise<void> — Supprime une couleur par id

Base URL configurable en modifiant la constante `API_BASE_URL`.

## Types

Fichier: `types/index.js`
- Couleur (JSDoc): { id, name, codeHex, available? }
- HEX_COLOR_REGEX: Validation des codes hexadécimaux (#RRGGBB ou #RGB)
- availabilityLabel(available): Helper d'affichage

Ces éléments sont importés dans les composants au lieu de définitions inline.

## Composants

- `Tableau.jsx`:
  - Recherche temps réel sur le nom
  - Pagination côté client (10 items/page)
  - Suppression avec confirmation (SweetAlert2)
  - Utilise `couleurService.getAllCouleurs()` et `couleurService.deleteCouleur()`

- `Formulaire.jsx`:
  - Ajout d'une couleur
  - Validation via `HEX_COLOR_REGEX`
  - UI identique, seulement les appels déplacés vers le service

- `FormulaireModification.jsx`:
  - Édition d'une couleur
  - Validation via `HEX_COLOR_REGEX`
  - Appels via `couleurService.updateCouleur()`

## Personnalisation

- Modifier l'URL de l'API: `services/couleurService.js`, variable `API_BASE_URL`.
- Règle de validation hex: `types/index.js` (HEX_COLOR_REGEX).
- Nombre d'éléments par page: constante `itemsPerPage` dans `components/Tableau.jsx`.

## Notes

- La logique métier n'a pas été modifiée; seuls les appels API et les types ont été externalisés.
- Les noms des fichiers existants ont été conservés.
- Le code est aligné sur l'architecture du module `monture` (services/types/components/README).

