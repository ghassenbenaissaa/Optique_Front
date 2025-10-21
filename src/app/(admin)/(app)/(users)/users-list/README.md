# Module Users List

## 📁 Structure

```
users-list/
├── components/
│   └── UserListTabel.jsx    # Composant principal d'affichage du tableau
├── services/
│   └── userService.js       # Services API pour les utilisateurs
├── types/
│   └── index.js            # Types et helpers TypeScript/JSDoc
├── index.jsx               # Point d'entrée du module
└── README.md               # Documentation
```

## 🔗 APIs Consommées

### GET /api/v1/user/all
- **Objectif** : Récupérer la liste paginée des utilisateurs
- **Paramètres** : `page` (défaut: 0), `size` (défaut: 10)
- **Réponse** : Objet paginé avec les utilisateurs

### PUT /api/v1/user/toggleUserBanStatus/{userId}
- **Objectif** : Bannir/débannir un utilisateur
- **Paramètres** : `userId` (path), `banStatus` (query boolean)
- **Réponse** : Utilisateur mis à jour

## 🧩 Fonctionnalités

- ✅ **Affichage paginé** : 10 utilisateurs par page
- ✅ **Recherche** : Par nom, prénom ou email
- ✅ **Filtrage** : Par statut (Actif/Banni)
- ✅ **Action de bannissement** : Avec indication d'irréversibilité
- ✅ **Pagination dynamique** : Avec navigation entre pages
- ✅ **États de chargement** : Indicateurs visuels

## 📊 Structure des Données

```javascript
// Utilisateur (DTO GetClientResponse)
{
  id: number
  firstname: string
  lastname: string
  email: string
  numTel: string
  adresse: string
  isBanned: boolean
  createdDate: string // Format YYYY-MM-DD
}
```

## 🎨 Interface Utilisateur

- **Tableau responsive** avec colonnes : ID, Nom, Email, Téléphone, Adresse, Date, Statut, Action
- **Bouton "Bannir"** : Disponible uniquement pour les utilisateurs actifs
- **Message d'irréversibilité** : Affiché pour les utilisateurs déjà bannis
- **Pagination** : Navigation avec boutons Précédent/Suivant et numéros de page
