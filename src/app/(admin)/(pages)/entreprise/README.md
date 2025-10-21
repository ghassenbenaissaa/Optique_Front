# Page Entreprise

Cette page permet de gérer les informations de l'entreprise dans l'interface d'administration.

## Structure du dossier

```
entreprise/
├── index.jsx                    # Page principale
├── components/                  # Composants UI
│   ├── EntrepriseDisplay.jsx   # Affichage des informations existantes
│   └── EntrepriseForm.jsx      # Formulaire d'ajout/modification
├── services/                   # Services API
│   └── entrepriseService.js    # Appels API pour les entreprises
├── types/                      # Types et interfaces
│   └── index.js               # DTO et validation
└── README.md                   # Cette documentation
```

## Fonctionnalités

### 🔍 Affichage des informations
- Récupération et affichage des informations de l'entreprise via `GET /api/v1/entreprise/admin`
- Affichage organisé avec logo, informations générales et données fiscales
- Gestion du cas où aucune entreprise n'existe encore

### ➕ Ajout d'entreprise
- Formulaire complet pour créer une nouvelle entreprise via `POST /api/v1/entreprise/add`
- Validation côté client des champs obligatoires
- Interface intuitive avec message d'accueil si aucune entreprise n'existe

### ✏️ Modification d'entreprise
- Modification des informations existantes via `PUT /api/v1/entreprise/update`
- Pré-remplissage du formulaire avec les données actuelles
- Validation en temps réel des champs

## Composants

### EntrepriseDisplay
- **Rôle** : Affiche les informations de l'entreprise existante
- **Props** : `onEdit`, `onAdd`
- **États** : Gestion du loading, erreurs, données vides

### EntrepriseForm
- **Rôle** : Formulaire d'ajout/modification
- **Props** : `entreprise`, `onSuccess`, `onCancel`, `isEditing`
- **Validation** : Champs obligatoires, format email, limites numériques

## Services API

### entrepriseService
- `getEntreprise()` : Récupère les informations de l'entreprise
- `addEntreprise(data)` : Ajoute une nouvelle entreprise
- `updateEntreprise(data)` : Met à jour une entreprise existante

Tous les services retournent un objet standardisé :
```javascript
{
  success: boolean,
  data?: any,
  error?: string,
  message?: string,
  status?: number
}
```

## Types de données

### GetEntrepriseResponse / UpdateEntrepriseRequest
```javascript
{
  Id: number,
  nom: string,
  adresse: string,
  email: string,
  telephone: string,
  numeroFiscal: string,
  TimbreFiscale: number,
  logoUrl: string,
  TVA: number
}
```

### AddEntrepriseRequest
Identique au précédent mais sans le champ `Id`.

## Validation

La validation inclut :
- Champs obligatoires : nom, adresse, email, téléphone, numéroFiscal
- Format email valide
- TVA entre 0 et 100%
- Timbre fiscal non négatif

## Styles

- Utilise Tailwind CSS pour la cohérence avec le reste du projet
- Thème admin harmonieux avec les autres pages
- Interface responsive (mobile-first)
- Icônes MingCute (mgc_) comme dans le reste de l'application

## Usage

1. **Navigation** : Accédez à la page via le menu admin
2. **Première utilisation** : Cliquez sur "Ajouter une entreprise" pour configurer
3. **Modification** : Utilisez le bouton "Modifier" pour mettre à jour les informations
4. **Validation** : Les erreurs sont affichées en temps réel lors de la saisie
