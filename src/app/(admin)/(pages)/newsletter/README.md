# Page Newsletter

## Description
Cette page affiche la liste de tous les abonnés à la newsletter avec leur statut de confirmation.

## Fonctionnalités
- ✅ Affichage de la liste des abonnés à la newsletter
- ✅ Recherche par email
- ✅ Pagination (10 éléments par page)
- ✅ Affichage du statut de confirmation (Oui/Non)
- ✅ Format de date lisible (dd/MM/yyyy HH:mm)
- ✅ Design responsive et fluide

## Structure des fichiers
```
newsletter/
├── index.jsx                    # Page principale
├── components/
│   └── Tableau.jsx             # Composant d'affichage du tableau
├── services/
│   └── newsletterService.js    # Service API
└── types/
    └── index.js                # Définitions de types
```

## API utilisée
- **GET** `/api/v1/newsletter/all` - Récupère tous les abonnés

## Données affichées
- **Email** : Adresse email de l'abonné
- **Date d'inscription** : Date et heure de l'inscription (format dd/MM/yyyy HH:mm)
- **Confirmé** : Statut de confirmation (badge vert "Oui" ou rouge "Non")

## Route
`/admin/newsletter`

## Navigation
Accessible via le menu latéral admin sous l'entrée "Newsletter" avec l'icône Mail

