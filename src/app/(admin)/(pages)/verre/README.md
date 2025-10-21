# Module Verre - Documentation

## 📋 Vue d'ensemble

Gestion des verres (types, indice, matériau, prix) côté admin, avec formulaire d'ajout, formulaire de modification et liste paginée avec recherche.

## 🗂️ Structure des fichiers

```
verre/
├── index.jsx                      # Point d'entrée principal de la page
├── types/
│   └── index.js                   # Énums et structures partagées (MateriauVerre, typedef Verre)
├── services/
│   └── verreService.js            # Services API Verre (fetchAll, add, update, delete)
└── components/
    ├── Tableau.jsx                # Liste des verres avec recherche + pagination + actions
    ├── Formulaire.jsx             # Formulaire d'ajout de verre
    └── FormulaireModification.jsx # Formulaire d'édition d'un verre
```

## 🎯 Fonctionnalités

- Liste des verres avec recherche par type et matériau
- Pagination simple (10 items/page)
- Ajout d'un verre (type, indice, matériau, prix de base)
- Modification d'un verre (y compris disponibilité)
- Suppression avec confirmation (SweetAlert2)

## 🔌 Endpoints utilisés

```http
GET    /api/v1/verre/admin/all
POST   /api/v1/verre/add
PUT    /api/v1/verre/update
DELETE /api/v1/verre/delete/{id}
```

Tous les appels HTTP sont centralisés dans `services/verreService.js` et utilisent `fetch`.

## 📦 Types et constantes

Dans `types/index.js` :
- `MateriauVerre` : enum des matériaux (Minéral, Organique, Polycarbonate, Trivex, Hi-Index)
- `MateriauVerreLabels` : labels d'affichage (optionnel)
- `typedef Verre` : forme de l'objet manipulé côté UI

## 🛠️ Personnalisation

- Modifier l'URL de l'API:
  Dans `services/verreService.js`, ligne 1:
  ```js
  const API_BASE_URL = 'http://localhost:8089/api/v1';
  ```
- Modifier la pagination:
  Dans `components/Tableau.jsx`, changez `itemsPerPage` (par défaut 10)
- Modifier la liste des matériaux affichés:
  Dans `types/index.js` via `MateriauVerre`

## 🔍 Notes d'implémentation

- Les composants n'effectuent plus d'appels HTTP directs: ils consomment les fonctions de `verreService.js`.
- Les valeurs statiques (matériaux) sont centralisées dans `types/index.js` pour éviter les duplications.
- Les erreurs serveur sont affichées sous forme de messages ou via SweetAlert2 lors des suppressions.

## 🚀 Prochaines améliorations

- Tri par prix/indice
- Filtres avancés (plage d'indice, disponibilité)
- Export CSV/Excel
