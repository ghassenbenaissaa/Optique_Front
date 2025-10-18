# Module Monture - Documentation

## 📋 Vue d'ensemble

Module complet de gestion des montures (lunettes) avec interface moderne, formulaire multi-étapes et affichage en cartes.

## 🗂️ Structure des fichiers

```
monture/
├── index.jsx                      # Point d'entrée principal
├── types/
│   └── index.js                   # Enums et constantes
├── services/
│   └── produitService.js          # Services API
└── components/
    ├── MontureList.jsx            # Liste paginée avec cartes
    ├── MontureCard.jsx            # Carte de produit
    ├── MontureDetail.jsx          # Modal de détails
    └── MontureForm.jsx            # Formulaire multi-étapes
```

## 🎯 Fonctionnalités

### ✅ Liste des montures
- Affichage en grille responsive (3 colonnes desktop, 2 tablette, 1 mobile)
- Pagination par 9 produits avec bouton "Voir plus"
- Recherche en temps réel (nom, référence, marque)
- Badges de disponibilité et solde
- Actions rapides : Voir, Modifier, Supprimer

### ✅ Formulaire multi-étapes (Wizard)
**Étape 1 - Informations générales**
- Nom, description, prix de base
- Marque, catégorie, genre, taille
- Type de monture, forme

**Étape 2 - Dimensions**
- Largeur totale, largeur verre, hauteur verre
- Largeur pont, longueur branche
- Toutes optionnelles

**Étape 3 - Images**
- Upload multiple d'images
- Prévisualisation avec suppression
- Image principale automatique (première)

**Étape 4 - Variations**
- Ajout dynamique de variations
- Couleur, matériau, quantité
- Prix spécifique par variation (override)
- Solde en pourcentage

### ✅ Détails produit
- Modal plein écran avec 2 colonnes
- Galerie d'images avec navigation
- Informations complètes + dimensions
- Tableau des variations avec prix et stock

## 🔌 Endpoints utilisés

```javascript
// Produits
GET    /api/v1/produit/all/admin
POST   /api/v1/produit/add
PUT    /api/v1/produit/update
DELETE /api/v1/produit/delete/{id}

// Données de référence
GET /api/v1/marque/admin
GET /api/v1/materiauProduit/admin
GET /api/v1/couleur/admin
GET /api/v1/formeProduit/admin
```

## 📦 Enums disponibles

```javascript
CategorieProduit: LUNETTE_DE_SOLEIL | LUNETTE_DE_VUE | LUNETTE_IA
GenderProduit: HOMME | FEMME | UNISEX | ENFANT
TailleProduit: EXTRA_PETIT | PETIT | MOYEN | GRAND | EXTRA_GRAND
TypeMonture: CERCLÉE | DEMI_CERCLÉE | SANS_MONTURE
```

## 🎨 Design

- **Framework CSS**: TailwindCSS
- **Icônes**: Lucide React
- **Notifications**: Sonner (toast)
- **Confirmations**: SweetAlert2
- **Formulaires**: React Hook Form

## 💡 Utilisation

### Ajouter une monture
1. Cliquer sur "Ajouter une monture"
2. Remplir le formulaire étape par étape
3. Valider à la dernière étape

### Modifier une monture
1. Cliquer sur l'icône "Modifier" (crayon)
2. Le formulaire se pré-remplit avec les données
3. Modifier et valider

### Supprimer une monture
1. Cliquer sur l'icône "Supprimer" (poubelle)
2. Confirmer la suppression

## 🔧 Personnalisation

### Modifier le nombre de produits par page
Dans `MontureList.jsx`, ligne 14 :
```javascript
const [displayCount, setDisplayCount] = useState(9); // Changer ici
```

### Modifier l'URL de l'API
Dans `services/produitService.js`, ligne 3 :
```javascript
const API_BASE_URL = 'http://localhost:8089/api/v1'; // Changer ici
```

## 🚀 Améliorations futures possibles

- [ ] Filtres avancés (catégorie, marque, prix)
- [ ] Tri (prix, nom, date)
- [ ] Export Excel/PDF
- [ ] Gestion des soldes en masse
- [ ] Historique des modifications
- [ ] Duplication de produit

