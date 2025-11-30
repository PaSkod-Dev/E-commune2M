# Documentation Technique - E-commune2M

Documentation pour les développeurs travaillant sur le projet E-commune2M.

## Architecture du projet

### Structure des dossiers

```
E-commune2M/
├── assets/
│   └── logo/
│       └── logoApp.png
├── js/
│   ├── application.js              # Point d'entrée principal
│   ├── composants/
│   │   ├── base-composant.js      # Classe de base commune
│   │   ├── tableau-bord.js        # ComposantTableauBord
│   │   ├── liste-cotisants.js     # ComposantListeCotisants
│   │   ├── gestion-paiements.js   # ComposantGestionPaiements
│   │   ├── statistiques.js        # ComposantStatistiques
│   │   ├── gestion-cantons.js     # ComposantGestionCantons
│   │   ├── rapports.js            # ComposantRapports
│   │   └── parametres.js          # ComposantParametres
│   ├── services/
│   │   ├── classification-service.js
│   │   ├── gestionnaire-routes.js
│   │   └── stockage-donnees.js
│   └── utilitaires/
│       ├── constantes.js
│       └── helpers.js
├── styles/
│   ├── variables.css
│   ├── base.css
│   ├── layout.css
│   └── composants.css
└── index.html
```

## Technologies utilisées

- **Frontend** : HTML5, CSS3, JavaScript (ES6+)
- **Stockage** : IndexedDB
- **Architecture** : SPA (Single Page Application)
- **Routage** : Hash-based routing (#)
- **Pas de framework** : Vanilla JavaScript

## Architecture technique

### Point d'entrée

Le fichier `application.js` contient :
- `GestionnaireErreurs` : Gestion centralisée des erreurs
- `ApplicationPrincipale` : Classe principale qui initialise l'application

### Services

#### ServiceStockageDonnees
Gère l'accès à la base de données IndexedDB.

**Magasins (tables) :**
- `cotisants` : Liste des cotisants
- `paiements` : Historique des paiements
- `cantons` : Cantons du Togo
- `villages` : Villages par canton
- `quartiers` : Quartiers par village
- `types_cotisation` : Types de cotisations
- `parametres` : Paramètres de l'application

**Méthodes principales :**
- `ajouter(nomMagasin, donnees)` : Ajouter un enregistrement
- `obtenirTous(nomMagasin)` : Récupérer tous les enregistrements
- `obtenirParId(nomMagasin, id)` : Récupérer par ID
- `mettreAJour(nomMagasin, donnees)` : Mettre à jour
- `supprimer(nomMagasin, id)` : Supprimer
- `rechercher(nomMagasin, filtres)` : Recherche avec filtres
- `exporterToutesDonnees()` : Export complet
- `importerDonnees(donnees)` : Import de données

#### GestionnaireRoutes
Gère la navigation dans l'application SPA.

**Routes disponibles :**
- `tableau-bord` → ComposantTableauBord
- `cotisants` → ComposantListeCotisants
- `paiements` → ComposantGestionPaiements
- `statistiques` → ComposantStatistiques
- `cantons` → ComposantGestionCantons
- `rapports` → ComposantRapports
- `parametres` → ComposantParametres

**Méthodes principales :**
- `naviguerVers(chemin)` : Navigation vers une route
- `retourArriere()` : Retour en arrière
- `definirRoute(chemin, config)` : Définir une nouvelle route

#### ServiceClassification
Calcule les classements et statistiques.

**Méthodes principales :**
- `obtenirClassementParCanton(critere, ordre)`
- `obtenirClassementParVillage(cantonId, critere, ordre)`
- `obtenirClassementParQuartier(villageId, critere, ordre)`

### Composants

La classe de base est définie dans `js/composants/base-composant.js`.
Chaque composant fonctionnel est défini dans un fichier dédié du dossier `js/composants/`.

**Classe de base :** `BaseComposant`
- `rendre()` : génère le HTML (à implémenter dans les classes enfants)
- `initialiser()` : initialisation après rendu (optionnel)
- Délégation d'événements et nettoyage des écouteurs

**Composants disponibles :**
- `ComposantTableauBord`
- `ComposantListeCotisants`
- `ComposantGestionPaiements`
- `ComposantStatistiques`
- `ComposantGestionCantons`
- `ComposantRapports`
- `ComposantParametres`

### Utilitaires

#### constantes.js
Toutes les constantes de l'application :
- Configuration
- Routes
- Statuts
- Messages
- Expressions régulières
- Limites

#### helpers.js
Fonctions utilitaires :
- Formatage (montants, dates, téléphones)
- Validation (email, téléphone, montant)
- Manipulation de données (tri, filtre, groupement)
- Calculs (somme, moyenne, statistiques)
- DOM (création d'éléments, notifications)
- Sécurité (échappement HTML, sanitization)

## Structure de données

### Cotisant
```javascript
{
  id: number,
  nom: string,
  prenoms: string,
  telephone: string,
  email: string,
  adresse: string,
  canton_id: number,
  village_id: number,
  quartier_id: number,
  statut: 'actif' | 'inactif' | 'suspendu' | 'archive',
  montant_cotisation: number,
  date_creation: Date,
  date_modification: Date
}
```

### Paiement
```javascript
{
  id: number,
  cotisant_id: number,
  montant: number,
  date_paiement: Date,
  mode_paiement: 'especes' | 'mobile_money' | 'virement' | 'cheque' | 'autre',
  statut: 'confirme' | 'en_attente' | 'annule' | 'rembourse',
  date_creation: Date,
  date_modification: Date
}
```

### Canton
```javascript
{
  id: number,
  nom: string,
  chef_lieu: string,
  code: string
}
```

### Village
```javascript
{
  id: number,
  canton_id: number,
  nom: string
}
```

### Quartier
```javascript
{
  id: number,
  village_id: number,
  nom: string
}
```

## Développement

### Démarrage local

1. Cloner ou télécharger le projet
2. Ouvrir `index.html` dans un navigateur
3. Ou utiliser un serveur local :
   ```bash
   # Python
   python -m http.server 8000

   # Node.js
   npx http-server
   ```

### Ajout d'un nouveau composant

1. Créer une classe qui étend `BaseComposant`
2. Implémenter la méthode `rendre()` qui retourne le HTML
3. Optionnellement implémenter `initialiser()` pour la logique post-rendu
4. Ajouter la route dans `gestionnaire-routes.js`
5. Rendre la classe disponible globalement

Exemple :
```javascript
class MonNouveauComposant extends BaseComposant {
    async rendre() {
        return `
            <div class="mon-composant">
                <h1>Mon Composant</h1>
            </div>
        `;
    }

    async initialiser() {
        // Logique d'initialisation
    }
}

// Rendre disponible globalement
if (typeof window !== 'undefined') {
    window.MonNouveauComposant = MonNouveauComposant;
}
```

### Ajout d'une nouvelle route

Dans `gestionnaire-routes.js`, méthode `initialiserRoutes()` :

```javascript
this.definirRoute(ROUTES_APPLICATION.MA_ROUTE, {
    titre: 'Ma Route',
    composant: 'MonComposant',
    icone: 'icon-name',
    requireAuth: false
});
```

### Utilisation du service de stockage

```javascript
// Ajouter
const id = await window.StockageDonnees.ajouter('cotisants', {
    nom: 'Doe',
    prenoms: 'John'
});

// Récupérer tous
const cotisants = await window.StockageDonnees.obtenirTous('cotisants');

// Récupérer par ID
const cotisant = await window.StockageDonnees.obtenirParId('cotisants', id);

// Mettre à jour
await window.StockageDonnees.mettreAJour('cotisants', {
    id: id,
    nom: 'Doe',
    prenoms: 'Jane'
});

// Supprimer
await window.StockageDonnees.supprimer('cotisants', id);

// Rechercher
const resultats = await window.StockageDonnees.rechercher('cotisants', {
    statut: 'actif',
    canton_id: 1
});
```

## Conventions de code

### Nommage
- Classes : PascalCase (`ComposantTableauBord`)
- Variables et fonctions : camelCase (`obtenirTous`)
- Constantes : UPPER_SNAKE_CASE (`CONFIG_APPLICATION`)
- Fichiers : kebab-case (`gestionnaire-routes.js`)

### Commentaires
- JSDoc pour les fonctions publiques
- Commentaires en français
- Explication des logiques complexes

### Gestion des erreurs
- Utiliser `GestionnaireErreurs` pour les erreurs critiques
- Logger les erreurs avec contexte
- Afficher des messages clairs à l'utilisateur

## Points d'attention

### Architecture des composants
Les composants sont répartis dans des fichiers séparés dans `js/composants/`. Il est recommandé de conserver cette structure modulaire pour toute nouvelle évolution.

### Authentification
Actuellement, aucune authentification n'est implémentée. Toutes les routes sont publiques. À implémenter pour un usage en production.

### Performance
Pour de grandes quantités de données, implémenter :
- Pagination côté IndexedDB
- Lazy loading
- Virtual scrolling

## Tests

Actuellement, aucun test n'est implémenté. Recommandations :
- Tests unitaires pour les utilitaires
- Tests d'intégration pour les services
- Tests E2E pour les composants critiques

## Déploiement

L'application est une SPA statique. Pour déployer :

1. Tous les fichiers dans un dossier
2. Servir via un serveur web (Apache, Nginx, etc.)
3. Configurer les routes pour rediriger vers `index.html` (pour le routage SPA)

### Configuration serveur (exemple Nginx)

```nginx
location / {
    try_files $uri $uri/ /index.html;
}
```

## Améliorations futures

### Priorité haute
1. Implémenter l'authentification
2. Compléter l'export Excel/PDF
3. Implémenter la génération de rapports

### Priorité moyenne
1. Tests unitaires et d'intégration
2. Documentation utilisateur
3. Optimisation des performances
4. Mode hors ligne amélioré (Service Worker)

### Priorité basse
1. Internationalisation
2. Mode sombre
3. Audit trail
4. Notifications push

## Support

Pour toute question technique, consulter :
- Le code source (bien commenté)
- Les constantes dans `constantes.js`
- Ce fichier de documentation

## Version

Version actuelle : 2.0.0

---

*Documentation technique mise à jour le 2025-11-30*