# Gestionnaire de Cotisations Communautaires - E-commune2M

Application web de gestion des cotisations pour les communes du Togo.

## Description

E-commune2M est une application web qui permet de gérer efficacement les cotisants, leurs paiements et de générer des statistiques par canton, village et quartier.

## Fonctionnalités principales

### Gestion des cotisants
- Ajout, modification et suppression de cotisants
- Recherche et filtrage avancés
- Association à un canton, village et quartier
- Gestion des statuts (actif, inactif, suspendu, archivé)
- Informations complètes : nom, prénoms, téléphone, email, adresse

### Gestion des paiements
- Enregistrement des paiements de cotisations
- Association avec les cotisants
- Modes de paiement : espèces, mobile money, virement, chèque
- Suivi des statuts de paiement
- Historique complet

### Gestion géographique
- Gestion des cantons (10 cantons du Togo préconfigurés)
- Gestion des villages par canton
- Gestion des quartiers par village
- Hiérarchie complète : Canton → Village → Quartier

### Statistiques et classements
- Tableau de bord avec indicateurs clés
- Classement par canton selon différents critères
- Classement par village
- Classement par quartier
- Taux de participation
- Montants totaux et moyens

### Rapports
- Génération de rapports
- Export des données (CSV, Excel, PDF)
- Statistiques détaillées

## Utilisation

### Démarrage

1. Ouvrir le fichier `index.html` dans un navigateur web moderne
2. L'application se charge automatiquement
3. Utiliser la navigation latérale pour accéder aux différentes sections

### Navigation

- **Tableau de bord** : Vue d'ensemble avec indicateurs clés
- **Cotisants** : Gestion complète des cotisants
- **Paiements** : Enregistrement et suivi des paiements
- **Statistiques** : Analyses et classements
- **Cantons & Villages** : Gestion de la structure géographique
- **Rapports** : Génération de rapports
- **Paramètres** : Configuration de l'application

### Ajouter un cotisant

1. Aller dans la section "Cotisants"
2. Cliquer sur "Ajouter un cotisant"
3. Remplir le formulaire avec les informations requises
4. Sélectionner le canton, village et quartier
5. Enregistrer

### Enregistrer un paiement

1. Aller dans la section "Paiements"
2. Cliquer sur "Nouveau paiement"
3. Sélectionner le cotisant
4. Entrer le montant et la date
5. Choisir le mode de paiement
6. Enregistrer

## Prérequis techniques

- Navigateur web moderne (Chrome, Firefox, Edge, Safari)
- JavaScript activé
- Stockage local du navigateur activé (IndexedDB)

## Stockage des données

Les données sont stockées localement dans le navigateur (IndexedDB). Aucune connexion internet n'est requise pour utiliser l'application.

**Important** : Les données sont stockées sur l'ordinateur local. En cas de suppression des données du navigateur, les informations seront perdues. Il est recommandé d'exporter régulièrement les données.

## Export des données

Pour sauvegarder vos données :

1. Aller dans la section "Rapports" ou utiliser le bouton d'export rapide
2. Choisir le format d'export (CSV, Excel, PDF)
3. Télécharger le fichier
4. Conserver le fichier dans un endroit sûr

## Support

Pour toute question ou problème :
- Consulter la documentation technique (README_DEVELOPPEURS.md)
- Contacter l'équipe de développement

## Version

Version actuelle : 2.0.0

---

*Application développée pour la gestion des cotisations communautaires au Togo*
