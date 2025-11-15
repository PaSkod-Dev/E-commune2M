/**
 * Constantes de l'Application - Gestionnaire Cotisations Togo
 * Toutes les constantes sont nommées en français pour une meilleure compréhension
 */

// === CONFIGURATION GÉNÉRALE ===
const CONFIG_APPLICATION = {
    nom: 'Gestionnaire Cotisations Togo',
    version: '2.0.0',
    auteur: 'Équipe Développement Togo',
    dateCreation: '2025-11-14',
    
    // Base de données locale
    nomBaseDonnees: 'cotisations_togo_db',
    versionBaseDonnees: 2, // V2: Ajout de la table quartiers pour structure relationnelle complète
    
    // Pagination
    elementsParPage: 25,
    optionsPagination: [10, 25, 50, 100],
    
    // Délais et timeouts
    delaiRecherche: 300, // ms
    delaiSauvegarde: 1000, // ms
    timeoutChargement: 5000, // ms
};

// === ROUTES DE L'APPLICATION ===
const ROUTES_APPLICATION = {
    TABLEAU_BORD: 'tableau-bord',
    COTISANTS: 'cotisants',
    PAIEMENTS: 'paiements',
    STATISTIQUES: 'statistiques',
    CANTONS: 'cantons',
    VILLAGES: 'villages',
    RAPPORTS: 'rapports',
    PARAMETRES: 'parametres',
    PROFIL: 'profil'
};

// === STATUTS DES COTISANTS ===
const STATUTS_COTISANT = {
    ACTIF: 'actif',
    INACTIF: 'inactif',
    SUSPENDU: 'suspendu',
    ARCHIVE: 'archive'
};

const LIBELLES_STATUTS_COTISANT = {
    [STATUTS_COTISANT.ACTIF]: 'Actif',
    [STATUTS_COTISANT.INACTIF]: 'Inactif',
    [STATUTS_COTISANT.SUSPENDU]: 'Suspendu',
    [STATUTS_COTISANT.ARCHIVE]: 'Archivé'
};

// === MODES DE PAIEMENT ===
const MODES_PAIEMENT = {
    ESPECES: 'especes',
    MOBILE_MONEY: 'mobile_money',
    VIREMENT: 'virement',
    CHEQUE: 'cheque',
    AUTRE: 'autre'
};

const LIBELLES_MODES_PAIEMENT = {
    [MODES_PAIEMENT.ESPECES]: 'Espèces',
    [MODES_PAIEMENT.MOBILE_MONEY]: 'Mobile Money',
    [MODES_PAIEMENT.VIREMENT]: 'Virement Bancaire',
    [MODES_PAIEMENT.CHEQUE]: 'Chèque',
    [MODES_PAIEMENT.AUTRE]: 'Autre'
};

// === STATUTS DES PAIEMENTS ===
const STATUTS_PAIEMENT = {
    CONFIRME: 'confirme',
    EN_ATTENTE: 'en_attente',
    ANNULE: 'annule',
    REMBOURSE: 'rembourse'
};

const LIBELLES_STATUTS_PAIEMENT = {
    [STATUTS_PAIEMENT.CONFIRME]: 'Confirmé',
    [STATUTS_PAIEMENT.EN_ATTENTE]: 'En Attente',
    [STATUTS_PAIEMENT.ANNULE]: 'Annulé',
    [STATUTS_PAIEMENT.REMBOURSE]: 'Remboursé'
};

// === TYPES DE COTISATION ===
const TYPES_COTISATION = {
    MENSUELLE: 'mensuelle',
    TRIMESTRIELLE: 'trimestrielle',
    SEMESTRIELLE: 'semestrielle',
    ANNUELLE: 'annuelle',
    PONCTUELLE: 'ponctuelle'
};

const LIBELLES_TYPES_COTISATION = {
    [TYPES_COTISATION.MENSUELLE]: 'Mensuelle',
    [TYPES_COTISATION.TRIMESTRIELLE]: 'Trimestrielle',
    [TYPES_COTISATION.SEMESTRIELLE]: 'Semestrielle',
    [TYPES_COTISATION.ANNUELLE]: 'Annuelle',
    [TYPES_COTISATION.PONCTUELLE]: 'Ponctuelle'
};

// === CANTONS DU TOGO ===
const CANTONS_TOGO = {
    GOLFE: { id: 'golfe', nom: 'Golfe', chef_lieu: 'Lomé' },
    KLOTO: { id: 'kloto', nom: 'Kloto', chef_lieu: 'Kpalimé' },
    OGOU: { id: 'ogou', nom: 'Ogou', chef_lieu: 'Atakpamé' },
    TCHAOUDJO: { id: 'tchaoudjo', nom: 'Tchaoudjo', chef_lieu: 'Sokodé' },
    KOZAH: { id: 'kozah', nom: 'Kozah', chef_lieu: 'Kara' },
    BINAH: { id: 'binah', nom: 'Binah', chef_lieu: 'Pagouda' },
    DOUFELGOU: { id: 'doufelgou', nom: 'Doufelgou', chef_lieu: 'Niamtougou' },
    KERAN: { id: 'keran', nom: 'Kéran', chef_lieu: 'Kandé' },
    OTI: { id: 'oti', nom: 'Oti', chef_lieu: 'Mango' },
    TONE: { id: 'tone', nom: 'Tône', chef_lieu: 'Dapaong' }
};

// === FORMATS D'EXPORT ===
const FORMATS_EXPORT = {
    PDF: 'pdf',
    EXCEL: 'excel',
    CSV: 'csv',
    JSON: 'json'
};

const LIBELLES_FORMATS_EXPORT = {
    [FORMATS_EXPORT.PDF]: 'PDF',
    [FORMATS_EXPORT.EXCEL]: 'Excel (.xlsx)',
    [FORMATS_EXPORT.CSV]: 'CSV',
    [FORMATS_EXPORT.JSON]: 'JSON'
};

// === TYPES DE RAPPORT ===
const TYPES_RAPPORT = {
    MENSUEL: 'mensuel',
    TRIMESTRIEL: 'trimestriel',
    ANNUEL: 'annuel',
    PERSONNALISE: 'personnalise',
    CANTON: 'canton',
    VILLAGE: 'village',
    COTISANT: 'cotisant'
};

// === MESSAGES DE L'APPLICATION ===
const MESSAGES = {
    // Messages de succès
    SUCCES: {
        COTISANT_AJOUTE: 'Cotisant ajouté avec succès !',
        COTISANT_MODIFIE: 'Cotisant modifié avec succès !',
        COTISANT_SUPPRIME: 'Cotisant supprimé avec succès !',
        PAIEMENT_ENREGISTRE: 'Paiement enregistré avec succès !',
        PAIEMENT_MODIFIE: 'Paiement modifié avec succès !',
        DONNEES_EXPORTEES: 'Données exportées avec succès !',
        DONNEES_IMPORTEES: 'Données importées avec succès !',
        SAUVEGARDE_REUSSIE: 'Sauvegarde réussie !'
    },
    
    // Messages d'erreur
    ERREUR: {
        CHAMP_REQUIS: 'Ce champ est obligatoire',
        EMAIL_INVALIDE: 'Adresse email invalide',
        TELEPHONE_INVALIDE: 'Numéro de téléphone invalide',
        MONTANT_INVALIDE: 'Montant invalide',
        DATE_INVALIDE: 'Date invalide',
        COTISANT_INTROUVABLE: 'Cotisant introuvable',
        PAIEMENT_INTROUVABLE: 'Paiement introuvable',
        ERREUR_SAUVEGARDE: 'Erreur lors de la sauvegarde',
        ERREUR_CHARGEMENT: 'Erreur lors du chargement des données',
        ERREUR_EXPORT: 'Erreur lors de l\'export',
        ERREUR_IMPORT: 'Erreur lors de l\'import',
        ACCES_REFUSE: 'Accès refusé',
        DONNEES_CORROMPUES: 'Données corrompues détectées'
    },
    
    // Messages d'information
    INFO: {
        CHARGEMENT: 'Chargement en cours...',
        SAUVEGARDE: 'Sauvegarde en cours...',
        AUCUN_RESULTAT: 'Aucun résultat trouvé',
        RECHERCHE_COURS: 'Recherche en cours...',
        EXPORT_COURS: 'Export en cours...',
        IMPORT_COURS: 'Import en cours...'
    },
    
    // Messages de confirmation
    CONFIRMATION: {
        SUPPRIMER_COTISANT: 'Êtes-vous sûr de vouloir supprimer ce cotisant ?',
        SUPPRIMER_PAIEMENT: 'Êtes-vous sûr de vouloir supprimer ce paiement ?',
        ANNULER_PAIEMENT: 'Êtes-vous sûr de vouloir annuler ce paiement ?',
        REINITIALISER_DONNEES: 'Êtes-vous sûr de vouloir réinitialiser toutes les données ?',
        QUITTER_SANS_SAUVEGARDER: 'Des modifications non sauvegardées seront perdues. Continuer ?'
    }
};

// === EXPRESSIONS RÉGULIÈRES ===
const REGEX_VALIDATION = {
    EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    TELEPHONE_TOGO: /^(\+228|228)?[0-9]{8}$/,
    MONTANT: /^\d+(\.\d{1,2})?$/,
    CODE_POSTAL: /^\d{5}$/,
    NOM: /^[a-zA-ZÀ-ÿ\s'-]{2,50}$/,
    NUMERO_PIECE: /^[A-Z0-9]{5,20}$/
};

// === LIMITES ET CONTRAINTES ===
const LIMITES = {
    NOM_MIN: 2,
    NOM_MAX: 50,
    PRENOMS_MIN: 2,
    PRENOMS_MAX: 100,
    TELEPHONE_LENGTH: 8,
    EMAIL_MAX: 100,
    MONTANT_MIN: 0,
    MONTANT_MAX: 10000000, // 10 millions CFA
    DESCRIPTION_MAX: 500,
    FICHIER_IMPORT_MAX: 5 * 1024 * 1024, // 5MB
    RESULTATS_RECHERCHE_MAX: 100
};

// === COULEURS POUR LES GRAPHIQUES ===
const COULEURS_GRAPHIQUES = {
    PRIMAIRE: '#1E40AF',
    SECONDAIRE: '#059669',
    ACCENT: '#EA580C',
    SUCCES: '#10B981',
    ERREUR: '#EF4444',
    AVERTISSEMENT: '#F59E0B',
    INFO: '#3B82F6',
    NEUTRE: '#6B7280'
};

// === DEVISES ===
const DEVISES = {
    CFA: {
        code: 'XOF',
        symbole: 'CFA',
        nom: 'Franc CFA',
        decimales: 0
    },
    EUR: {
        code: 'EUR',
        symbole: '€',
        nom: 'Euro',
        decimales: 2
    },
    USD: {
        code: 'USD',
        symbole: '$',
        nom: 'Dollar US',
        decimales: 2
    }
};

// === ÉVÉNEMENTS PERSONNALISÉS ===
const EVENEMENTS = {
    COTISANT_AJOUTE: 'cotisant:ajoute',
    COTISANT_MODIFIE: 'cotisant:modifie',
    COTISANT_SUPPRIME: 'cotisant:supprime',
    PAIEMENT_AJOUTE: 'paiement:ajoute',
    PAIEMENT_MODIFIE: 'paiement:modifie',
    PAIEMENT_SUPPRIME: 'paiement:supprime',
    DONNEES_CHARGEES: 'donnees:chargees',
    DONNEES_SAUVEGARDEES: 'donnees:sauvegardees',
    ROUTE_CHANGEE: 'route:changee',
    RECHERCHE_EFFECTUEE: 'recherche:effectuee',
    FILTRE_APPLIQUE: 'filtre:applique'
};

// === STOCKAGE LOCAL ===
const CLES_STOCKAGE = {
    PREFERENCES_UTILISATEUR: 'preferences_utilisateur',
    DERNIERE_ROUTE: 'derniere_route',
    FILTRES_SAUVEGARDES: 'filtres_sauvegardes',
    THEME_UTILISATEUR: 'theme_utilisateur',
    LANGUE_UTILISATEUR: 'langue_utilisateur'
};

// Export des constantes pour utilisation dans d'autres modules
if (typeof module !== 'undefined' && module.exports) {
    // Node.js
    module.exports = {
        CONFIG_APPLICATION,
        ROUTES_APPLICATION,
        STATUTS_COTISANT,
        LIBELLES_STATUTS_COTISANT,
        MODES_PAIEMENT,
        LIBELLES_MODES_PAIEMENT,
        STATUTS_PAIEMENT,
        LIBELLES_STATUTS_PAIEMENT,
        TYPES_COTISATION,
        LIBELLES_TYPES_COTISATION,
        CANTONS_TOGO,
        FORMATS_EXPORT,
        LIBELLES_FORMATS_EXPORT,
        TYPES_RAPPORT,
        MESSAGES,
        REGEX_VALIDATION,
        LIMITES,
        COULEURS_GRAPHIQUES,
        DEVISES,
        EVENEMENTS,
        CLES_STOCKAGE
    };
} else {
    // Navigateur - les constantes sont disponibles globalement
    window.CONFIG_APPLICATION = CONFIG_APPLICATION;
    window.ROUTES_APPLICATION = ROUTES_APPLICATION;
    window.STATUTS_COTISANT = STATUTS_COTISANT;
    window.LIBELLES_STATUTS_COTISANT = LIBELLES_STATUTS_COTISANT;
    window.MODES_PAIEMENT = MODES_PAIEMENT;
    window.LIBELLES_MODES_PAIEMENT = LIBELLES_MODES_PAIEMENT;
    window.STATUTS_PAIEMENT = STATUTS_PAIEMENT;
    window.LIBELLES_STATUTS_PAIEMENT = LIBELLES_STATUTS_PAIEMENT;
    window.TYPES_COTISATION = TYPES_COTISATION;
    window.LIBELLES_TYPES_COTISATION = LIBELLES_TYPES_COTISATION;
    window.CANTONS_TOGO = CANTONS_TOGO;
    window.FORMATS_EXPORT = FORMATS_EXPORT;
    window.LIBELLES_FORMATS_EXPORT = LIBELLES_FORMATS_EXPORT;
    window.TYPES_RAPPORT = TYPES_RAPPORT;
    window.MESSAGES = MESSAGES;
    window.REGEX_VALIDATION = REGEX_VALIDATION;
    window.LIMITES = LIMITES;
    window.COULEURS_GRAPHIQUES = COULEURS_GRAPHIQUES;
    window.DEVISES = DEVISES;
    window.EVENEMENTS = EVENEMENTS;
    window.CLES_STOCKAGE = CLES_STOCKAGE;
}