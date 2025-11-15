/**
 * Application Principale - Gestionnaire Cotisations Togo
 * Point d'entrée de l'application
 */

/**
 * ========================================
 * 🚨 GESTIONNAIRE D'ERREURS CENTRALISÉ
 * ========================================
 */
class GestionnaireErreurs {
    constructor() {
        this.erreurs = [];
        this.maxErreurs = 100;
        this.configurerGestionGlobale();
    }
    
    /**
     * Configure la gestion globale des erreurs
     */
    configurerGestionGlobale() {
        // Capturer les erreurs JavaScript non gérées
        window.addEventListener('error', (event) => {
            this.capturer(event.error, 'Erreur globale', {
                fichier: event.filename,
                ligne: event.lineno,
                colonne: event.colno
            });
        });
        
        // Capturer les rejets de promesses non gérés
        window.addEventListener('unhandledrejection', (event) => {
            this.capturer(event.reason, 'Promesse non gérée', {
                promesse: event.promise
            });
        });
    }
    
    /**
     * Capture une erreur
     * @param {Error} erreur - L'erreur à capturer
     * @param {string} contexte - Contexte de l'erreur
     * @param {Object} metadonnees - Métadonnées supplémentaires
     */
    capturer(erreur, contexte = 'Inconnu', metadonnees = {}) {
        const erreurFormatee = {
            id: this.genererIdErreur(),
            timestamp: new Date().toISOString(),
            contexte,
            message: erreur?.message || String(erreur),
            stack: erreur?.stack || '',
            metadonnees,
            niveau: this.determinerNiveau(erreur)
        };
        
        // Enregistrer l'erreur
        this.enregistrer(erreurFormatee);
        
        // Logger dans la console
        this.loggerConsole(erreurFormatee);
        
        // Afficher à l'utilisateur si critique
        if (erreurFormatee.niveau === 'critique' || erreurFormatee.niveau === 'erreur') {
            this.afficherNotificationUtilisateur(erreurFormatee);
        }
        
        return erreurFormatee.id;
    }
    
    /**
     * Enregistre l'erreur dans l'historique
     * @param {Object} erreur - Erreur formatée
     */
    enregistrer(erreur) {
        this.erreurs.unshift(erreur);
        
        // Limiter la taille de l'historique
        if (this.erreurs.length > this.maxErreurs) {
            this.erreurs = this.erreurs.slice(0, this.maxErreurs);
        }
        
        // Sauvegarder dans localStorage pour analyse
        try {
            const erreursRecentes = this.erreurs.slice(0, 20);
            localStorage.setItem('erreurs_recentes', JSON.stringify(erreursRecentes));
        } catch (e) {
            console.warn('Impossible de sauvegarder les erreurs:', e);
        }
    }
    
    /**
     * Logger l'erreur dans la console
     * @param {Object} erreur - Erreur formatée
     */
    loggerConsole(erreur) {
        const style = this.obtenirStyleConsole(erreur.niveau);
        console.group(`%c[${erreur.niveau.toUpperCase()}] ${erreur.contexte}`, style);
        console.error('Message:', erreur.message);
        console.error('Timestamp:', erreur.timestamp);
        if (erreur.stack) {
            console.error('Stack:', erreur.stack);
        }
        if (Object.keys(erreur.metadonnees).length > 0) {
            console.error('Métadonnées:', erreur.metadonnees);
        }
        console.groupEnd();
    }
    
    /**
     * Affiche une notification à l'utilisateur
     * @param {Object} erreur - Erreur formatée
     */
    afficherNotificationUtilisateur(erreur) {
        const message = this.obtenirMessageUtilisateur(erreur);
        const type = erreur.niveau === 'critique' ? 'erreur' : 'avertissement';
        
        if (window.UtilitairesTogo && window.UtilitairesTogo.afficherNotification) {
            window.UtilitairesTogo.afficherNotification(message, type, 5000);
        } else {
            alert(message);
        }
    }
    
    /**
     * Détermine le niveau de sévérité de l'erreur
     * @param {Error} erreur - L'erreur
     * @returns {string} Niveau (info, avertissement, erreur, critique)
     */
    determinerNiveau(erreur) {
        if (!erreur) return 'info';
        
        const message = erreur.message || '';
        
        if (message.includes('critique') || message.includes('fatal')) {
            return 'critique';
        }
        if (message.includes('réseau') || message.includes('timeout')) {
            return 'avertissement';
        }
        return 'erreur';
    }
    
    /**
     * Obtient le message à afficher à l'utilisateur
     * @param {Object} erreur - Erreur formatée
     * @returns {string} Message utilisateur
     */
    obtenirMessageUtilisateur(erreur) {
        const messagesPersonnalises = {
            'Erreur globale': 'Une erreur inattendue s\'est produite. Veuillez réessayer.',
            'Promesse non gérée': 'Une opération asynchrone a échoué.',
            'Initialisation': 'Erreur lors du démarrage de l\'application.',
            'Stockage': 'Erreur lors de l\'accès aux données.',
            'Réseau': 'Problème de connexion réseau.'
        };
        
        return messagesPersonnalises[erreur.contexte] || 
               `Une erreur s'est produite: ${erreur.message}`;
    }
    
    /**
     * Obtient le style CSS pour la console
     * @param {string} niveau - Niveau de sévérité
     * @returns {string} Style CSS
     */
    obtenirStyleConsole(niveau) {
        const styles = {
            info: 'color: #2563EB; font-weight: bold;',
            avertissement: 'color: #D97706; font-weight: bold;',
            erreur: 'color: #DC2626; font-weight: bold;',
            critique: 'color: #fff; background: #DC2626; padding: 2px 6px; font-weight: bold;'
        };
        return styles[niveau] || styles.info;
    }
    
    /**
     * Génère un ID unique pour l'erreur
     * @returns {string} ID unique
     */
    genererIdErreur() {
        return `err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
    
    /**
     * Obtient l'historique des erreurs
     * @param {number} limite - Nombre d'erreurs à récupérer
     * @returns {Array} Liste des erreurs
     */
    obtenirHistorique(limite = 10) {
        return this.erreurs.slice(0, limite);
    }
    
    /**
     * Nettoie l'historique des erreurs
     */
    nettoyer() {
        this.erreurs = [];
        localStorage.removeItem('erreurs_recentes');
    }
}

// Instance globale du gestionnaire d'erreurs
const gestionnaireErreurs = new GestionnaireErreurs();
if (typeof window !== 'undefined') {
    window.GestionnaireErreurs = gestionnaireErreurs;
}

class ApplicationPrincipale {
    constructor() {
        this.initialise = false;
        this.composants = new Map();
        this.services = new Map();
        
        this.initialiserApplication();
    }
    
    /**
     * Initialise l'application complète
     */
    async initialiserApplication() {
        try {
            console.log('🏠 Démarrage du Gestionnaire Cotisations Togo...');
            
            // Afficher l'écran de chargement
            this.afficherEcranChargement();
            
            // Initialiser les services
            await this.initialiserServices();
            
            // Configurer les écouteurs d'événements
            this.configurerEcouteursEvenements();
            
            // Initialiser l'interface utilisateur
            this.initialiserInterfaceUtilisateur();
            
            // Masquer l'écran de chargement
            setTimeout(() => {
                this.masquerEcranChargement();
                this.initialise = true;
                console.log('✅ Application initialisée avec succès !');
            }, 2000);
            
        } catch (erreur) {
            console.error('❌ Erreur lors de l\'initialisation:', erreur);
            this.gererErreurInitialisation(erreur);
        }
    }
    
    /**
     * Initialise tous les services
     */
    async initialiserServices() {
        console.log('Initialisation des services...');
        
        // Attendre que la base de données soit prête
        if (window.StockageDonnees) {
            await window.StockageDonnees.initialiserBaseDonnees();
            this.services.set('stockage', window.StockageDonnees);
            console.log('✅ Service de stockage initialisé');
        }
        
        // Initialiser le gestionnaire de routes
        if (window.GestionnaireRoutes) {
            this.services.set('routes', window.GestionnaireRoutes);
            console.log('✅ Gestionnaire de routes initialisé');
        }
        
        // Autres services...
        console.log('✅ Tous les services sont prêts');
    }
    
    /**
     * Configure les écouteurs d'événements globaux
     */
    configurerEcouteursEvenements() {
        // Écouter les événements de l'application
        document.addEventListener(EVENEMENTS.DONNEES_CHARGEES, (event) => {
            console.log('Données chargées:', event.detail);
        });
        
        document.addEventListener(EVENEMENTS.ROUTE_CHANGEE, (event) => {
            console.log('Route changée:', event.detail.routeActuelle.titre);
        });
        
        // Écouter les erreurs globales
        window.addEventListener('error', (event) => {
            console.error('Erreur globale:', event.error);
            this.gererErreurGlobale(event.error);
        });
        
        // Écouter les erreurs de promesses non gérées
        window.addEventListener('unhandledrejection', (event) => {
            console.error('❌ Promesse rejetée:', event.reason);
            this.gererErreurGlobale(event.reason);
        });
        
        // Écouter les changements de connexion
        window.addEventListener('online', () => {
            console.log('🌐 Connexion rétablie');
            if (typeof afficherNotification === 'function') {
                afficherNotification('Connexion rétablie', 'succes');
            }
        });
        
        window.addEventListener('offline', () => {
            console.log('🚫 Connexion perdue');
            if (typeof afficherNotification === 'function') {
                afficherNotification('Mode hors ligne activé', 'avertissement');
            }
        });
    }
    
    /**
     * Initialise l'interface utilisateur
     */
    initialiserInterfaceUtilisateur() {
        // Configurer la recherche globale
        this.configurerRechercheGlobale();
        
        // Configurer les boutons d'action
        this.configurerBoutonsAction();
        
        // Configurer la sidebar
        this.configurerSidebar();
        
        // Ajouter les styles CSS dynamiques si nécessaire
        this.ajouterStylesDynamiques();
    }
    
    /**
     * Configure la recherche globale
     */
    configurerRechercheGlobale() {
        const champRecherche = document.getElementById('recherche-globale');
        const boutonRecherche = document.getElementById('bouton-recherche');
        
        if (champRecherche && typeof creerDebounce === 'function') {
            const rechercheDebounce = creerDebounce((terme) => {
                this.effectuerRechercheGlobale(terme);
            }, CONFIG_APPLICATION.delaiRecherche);
            
            champRecherche.addEventListener('input', (event) => {
                rechercheDebounce(event.target.value);
            });
        }
        
        if (boutonRecherche) {
            boutonRecherche.addEventListener('click', () => {
                const terme = champRecherche ? champRecherche.value : '';
                this.effectuerRechercheGlobale(terme);
            });
        }
    }
    
    /**
     * Configure les boutons d'action rapide
     */
    configurerBoutonsAction() {
        // Bouton notifications
        const boutonNotifications = document.getElementById('notifications');
        if (boutonNotifications) {
            boutonNotifications.addEventListener('click', () => {
                this.afficherNotifications();
            });
        }
        
        // Bouton export rapide
        const boutonExport = document.getElementById('export-rapide');
        if (boutonExport) {
            boutonExport.addEventListener('click', () => {
                this.exporterDonneesRapide();
            });
        }
        
        // Menu profil
        const menuProfil = document.getElementById('menu-profil');
        if (menuProfil) {
            menuProfil.addEventListener('click', () => {
                this.afficherMenuProfil();
            });
        }
    }
    
    /**
     * Configure la sidebar
     */
    configurerSidebar() {
        const boutonReduire = document.getElementById('reduire-sidebar');
        const sidebar = document.getElementById('sidebar');
        
        if (boutonReduire && sidebar) {
            boutonReduire.addEventListener('click', () => {
                sidebar.classList.toggle('reduite');
                
                // Sauvegarder la préférence
                const estReduite = sidebar.classList.contains('reduite');
                if (typeof sauvegarderDansStockage === 'function') {
                    sauvegarderDansStockage('sidebar_reduite', estReduite);
                }
            });
            
            // Restaurer l'état de la sidebar
            if (typeof recupererDuStockage === 'function') {
                const estReduite = recupererDuStockage('sidebar_reduite', false);
                if (estReduite) {
                    sidebar.classList.add('reduite');
                }
            }
        }
    }
    
    /**
     * Ajoute des styles CSS dynamiques
     */
    ajouterStylesDynamiques() {
        const style = document.createElement('style');
        style.textContent = `
            .grille-kpi {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                gap: var(--espacement-lg);
                margin-bottom: var(--espacement-xl);
            }
            
            .conteneur-chargement {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                min-height: 400px;
                text-align: center;
            }
            
            .conteneur-erreur {
                max-width: 600px;
                margin: var(--espacement-xl) auto;
            }
        `;
        document.head.appendChild(style);
    }
    
    /**
     * Affiche l'écran de chargement avec progression
     */
    afficherEcranChargement() {
        const ecranChargement = document.getElementById('ecran-chargement');
        const barreProgression = document.getElementById('barre-progression');
        
        if (ecranChargement) {
            ecranChargement.classList.remove('masque');
        }
        
        // Simuler la progression
        if (barreProgression) {
            let progression = 0;
            const interval = setInterval(() => {
                progression += Math.random() * 30;
                if (progression > 100) progression = 100;
                
                barreProgression.style.width = `${progression}%`;
                
                if (progression >= 100) {
                    clearInterval(interval);
                }
            }, 200);
        }
    }
    
    /**
     * Masque l'écran de chargement et affiche l'application
     */
    masquerEcranChargement() {
        const ecranChargement = document.getElementById('ecran-chargement');
        const application = document.getElementById('application');
        
        if (ecranChargement) {
            ecranChargement.style.opacity = '0';
            setTimeout(() => {
                ecranChargement.style.display = 'none';
            }, 500);
        }
        
        if (application) {
            application.classList.remove('masque');
        }
        
        // Démarrer le gestionnaire de routes
        if (this.services.has('routes')) {
            this.services.get('routes').ecouterChangementsURL();
        }
        
        console.log('✅ Application affichée avec succès !');
    }
    
    /**
     * Effectue une recherche globale
     */
    async effectuerRechercheGlobale(terme) {
        if (!terme || terme.length < 2) return;
        
        console.log(`Recherche globale: "${terme}"`);
        
        // Implémenter la logique de recherche ici
        // Pour l'instant, juste un log
        
        if (typeof afficherNotification === 'function') {
            afficherNotification(`Recherche pour "${terme}"`, 'info', 1000);
        }
    }
    
    /**
     * Affiche les notifications
     */
    afficherNotifications() {
        if (typeof afficherNotification === 'function') {
            afficherNotification('Aucune nouvelle notification', 'info');
        }
    }
    
    /**
     * Export rapide des données
     */
    async exporterDonneesRapide() {
        try {
            if (typeof afficherNotification === 'function') {
                afficherNotification('Export en cours...', 'info');
            }
            
            // Simuler l'export pour l'instant
            setTimeout(() => {
                if (typeof afficherNotification === 'function') {
                    afficherNotification('Export terminé !', 'succes');
                }
            }, 1000);
            
        } catch (erreur) {
            console.error('Erreur lors de l\'export:', erreur);
            if (typeof afficherNotification === 'function') {
                afficherNotification('Erreur lors de l\'export', 'erreur');
            }
        }
    }
    
    /**
     * Affiche le menu profil
     */
    afficherMenuProfil() {
        if (typeof afficherNotification === 'function') {
            afficherNotification('Menu profil - En développement', 'info');
        }
    }
    
    /**
     * Gère les erreurs d'initialisation
     */
    gererErreurInitialisation(erreur) {
        console.error('Erreur critique d\'initialisation:', erreur);
        
        const ecranChargement = document.getElementById('ecran-chargement');
        if (ecranChargement) {
            ecranChargement.innerHTML = `
                <div class="spinner-chargement">
                    <div class="alerte alerte-erreur">
                        <h2>❌ Erreur d'initialisation</h2>
                        <p>Une erreur est survenue lors du démarrage de l'application.</p>
                        <button class="bouton bouton-primaire" onclick="location.reload()">
                            Recharger l'application
                        </button>
                    </div>
                </div>
            `;
        }
    }
    
    /**
     * Gère les erreurs globales
     */
    gererErreurGlobale(erreur) {
        console.error('Erreur globale:', erreur);
        
        // Afficher une notification d'erreur
        if (typeof afficherNotification === 'function') {
            afficherNotification('Une erreur inattendue s\'est produite', 'erreur');
        }
    }
    
    /**
     * Nettoie l'application
     */
    nettoyer() {
        // Nettoyer tous les composants
        this.composants.forEach(composant => {
            if (typeof composant.nettoyer === 'function') {
                composant.nettoyer();
            }
        });
        
        // Nettoyer les services
        this.services.forEach(service => {
            if (typeof service.nettoyer === 'function') {
                service.nettoyer();
            }
        });
        console.log('🧹 Application nettoyée');
    }
}

// Initialiser l'application quand le DOM est prêt
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Démarrage de l\'application...');
    
    // Attendre un peu pour s'assurer que tous les scripts sont chargés
    setTimeout(() => {
        window.App = new ApplicationPrincipale();
    }, 100);
});

// Nettoyer avant la fermeture
window.addEventListener('beforeunload', () => {
    if (window.App && typeof window.App.nettoyer === 'function') {
        window.App.nettoyer();
    }
});