/**
 * Gestionnaire de Routes - Navigation SPA
 * Gestionnaire Cotisations Togo
 */

class GestionnaireRoutes {
    constructor() {
        this.routes = new Map();
        this.routeActuelle = null;
        this.historique = [];
        this.middlewares = [];
        this.routeParDefaut = ROUTES_APPLICATION.TABLEAU_BORD;
        this.ecouteursInitialises = false;

        this.initialiserRoutes();
    }

    /**
     * Initialise les routes de l'application
     */
    initialiserRoutes() {
        // Définir toutes les routes
        this.definirRoute(ROUTES_APPLICATION.TABLEAU_BORD, {
            titre: 'Tableau de Bord',
            composant: 'ComposantTableauBord',
            icone: 'dashboard',
            requireAuth: false
        });

        this.definirRoute(ROUTES_APPLICATION.COTISANTS, {
            titre: 'Gestion des Cotisants',
            composant: 'ComposantListeCotisants',
            icone: 'users',
            requireAuth: false
        });

        this.definirRoute(ROUTES_APPLICATION.PAIEMENTS, {
            titre: 'Gestion des Paiements',
            composant: 'ComposantGestionPaiements',
            icone: 'credit-card',
            requireAuth: false
        });

        this.definirRoute(ROUTES_APPLICATION.STATISTIQUES, {
            titre: 'Statistiques et Rapports',
            composant: 'ComposantStatistiques',
            icone: 'bar-chart',
            requireAuth: false
        });

        this.definirRoute(ROUTES_APPLICATION.CANTONS, {
            titre: 'Cantons et Villages',
            composant: 'ComposantGestionCantons',
            icone: 'map-pin',
            requireAuth: false
        });

        this.definirRoute(ROUTES_APPLICATION.RAPPORTS, {
            titre: 'Génération de Rapports',
            composant: 'ComposantRapports',
            icone: 'file-text',
            requireAuth: false
        });

        this.definirRoute(ROUTES_APPLICATION.PARAMETRES, {
            titre: 'Paramètres',
            composant: 'ComposantParametres',
            icone: 'settings',
            requireAuth: false
        });
    }

    /**
     * Définit une nouvelle route
     */
    definirRoute(chemin, configuration) {
        this.routes.set(chemin, {
            chemin,
            ...configuration,
            dateCreation: new Date()
        });
    }

    /**
     * Ajoute un middleware
     */
    ajouterMiddleware(middleware) {
        if (typeof middleware === 'function') {
            this.middlewares.push(middleware);
        }
    }

    /**
     * Écoute les changements d'URL
     */
    ecouterChangementsURL() {
        if (this.ecouteursInitialises) {
            return;
        }
        this.ecouteursInitialises = true;

        // Écouter les changements de hash
        window.addEventListener('hashchange', () => {
            this.gererChangementRoute();
        });

        // Écouter les clics sur les liens de navigation
        document.addEventListener('click', (event) => {
            const lien = event.target.closest('a[href^="#"]');
            if (lien) {
                event.preventDefault();
                const route = lien.getAttribute('href').substring(1);
                this.naviguerVers(route);
            }
        });

        // Charger la route initiale
        this.gererChangementRoute();
    }

    /**
     * Gère le changement de route
     */
    async gererChangementRoute() {
        const hash = window.location.hash.substring(1) || this.routeParDefaut;
        const route = this.routes.get(hash);

        if (!route) {
            console.warn(`Route non trouvée: ${hash}`);
            this.naviguerVers(this.routeParDefaut);
            return;
        }

        try {
            // Exécuter les middlewares
            for (const middleware of this.middlewares) {
                const resultat = await middleware(route, this.routeActuelle);
                if (resultat === false) {
                    console.log('Navigation bloquée par un middleware');
                    return;
                }
            }

            // Sauvegarder la route précédente dans l'historique
            if (this.routeActuelle) {
                this.historique.push({
                    route: this.routeActuelle,
                    timestamp: new Date()
                });

                // Limiter l'historique à 50 entrées
                if (this.historique.length > 50) {
                    this.historique.shift();
                }
            }

            // Mettre à jour la route actuelle
            this.routeActuelle = route;

            // Mettre à jour l'interface
            this.mettreAJourInterface(route);

            // Charger le composant
            await this.chargerComposant(route);

            // Sauvegarder la dernière route visitée
            sauvegarderDansStockage(CLES_STOCKAGE.DERNIERE_ROUTE, hash);

            // Émettre un événement
            this.emettrEvenement(EVENEMENTS.ROUTE_CHANGEE, {
                routeActuelle: route,
                hash: hash
            });

        } catch (erreur) {
            console.error('Erreur lors du changement de route:', erreur);
            this.gererErreurRoute(erreur);
        }
    }

    /**
     * Navigue vers une route spécifique
     */
    naviguerVers(chemin, options = {}) {
        if (typeof chemin !== 'string') {
            console.error('Le chemin doit être une chaîne de caractères');
            return;
        }

        // Vérifier si la route existe
        if (!this.routes.has(chemin)) {
            console.warn(`Route non trouvée: ${chemin}`);
            return;
        }

        // Options de navigation
        const { remplacer = false, donnees = null } = options;

        // Construire l'URL
        let url = `#${chemin}`;
        if (donnees) {
            const params = new URLSearchParams(donnees);
            url += `?${params.toString()}`;
        }

        // Naviguer
        if (remplacer) {
            window.location.replace(url);
        } else {
            window.location.hash = chemin;
        }
    }

    /**
     * Revient à la route précédente
     */
    retourArriere() {
        if (this.historique.length > 0) {
            const derniereRoute = this.historique.pop();
            this.naviguerVers(derniereRoute.route.chemin, { remplacer: true });
        } else {
            this.naviguerVers(this.routeParDefaut);
        }
    }

    /**
     * Met à jour l'interface utilisateur
     */
    mettreAJourInterface(route) {
        // Mettre à jour le titre de la page
        document.title = `${route.titre} - ${CONFIG_APPLICATION.nom}`;

        // Mettre à jour la navigation active
        this.mettreAJourNavigationActive(route.chemin);

        // Mettre à jour le fil d'Ariane si nécessaire
        this.mettreAJourFilAriane(route);
    }

    /**
     * Met à jour la navigation active
     */
    mettreAJourNavigationActive(cheminActif) {
        // Retirer la classe active de tous les éléments
        document.querySelectorAll('.element-menu').forEach(element => {
            element.classList.remove('actif');
        });

        // Ajouter la classe active à l'élément correspondant
        const elementActif = document.querySelector(`[data-route="${cheminActif}"]`);
        if (elementActif) {
            elementActif.classList.add('actif');
        }
    }

    /**
     * Met à jour le fil d'Ariane
     */
    mettreAJourFilAriane(route) {
        const conteneurFilAriane = document.getElementById('fil-ariane');
        if (!conteneurFilAriane) return;

        const filAriane = this.construireFilAriane(route);
        conteneurFilAriane.innerHTML = filAriane.map(item =>
            `<span class="element-fil-ariane">${item.icone} ${item.titre}</span>`
        ).join(' <span class="separateur-fil-ariane">></span> ');
    }

    /**
     * Construit le fil d'Ariane pour une route
     */
    construireFilAriane(route) {
        const filAriane = [
            { titre: 'Accueil', icone: '🏠' },
            { titre: route.titre, icone: route.icone }
        ];

        return filAriane;
    }

    /**
     * Charge le composant associé à une route
     */
    async chargerComposant(route) {
        const zoneContenu = document.getElementById('zone-contenu');
        if (!zoneContenu) {
            console.error('Zone de contenu non trouvée');
            return;
        }

        try {
            // Afficher un indicateur de chargement
            zoneContenu.innerHTML = this.obtenirHTMLChargement();

            // Attendre que les composants soient chargés si nécessaire
            await this.attendreComposants();

            // Vérifier si le composant existe
            if (typeof window[route.composant] === 'function') {
                // Instancier le composant
                const composant = new window[route.composant]();

                // Rendre le composant
                if (typeof composant.rendre === 'function') {
                    const contenuHTML = await composant.rendre();
                    zoneContenu.innerHTML = contenuHTML;

                    // Initialiser le composant si nécessaire
                    if (typeof composant.initialiser === 'function') {
                        await composant.initialiser();
                    }

                    // Assigner la référence globale pour certains composants
                    if (route.composant === 'ComposantGestionCantons') {
                        window.composantCantons = composant;
                    }
                } else {
                    throw new Error(`Le composant ${route.composant} n'a pas de méthode rendre()`);
                }
            } else {
                throw new Error(`Composant non trouvé: ${route.composant}`);
            }

        } catch (erreur) {
            console.error('Erreur lors du chargement du composant:', erreur);
            zoneContenu.innerHTML = this.obtenirHTMLErreur(erreur.message);
        }
    }

    /**
     * Attend que tous les composants soient chargés
     */
    async attendreComposants() {
        const composantsRequis = [
            'ComposantTableauBord',
            'ComposantListeCotisants',
            'ComposantGestionPaiements',
            'ComposantStatistiques',
            'ComposantGestionCantons',
            'ComposantRapports',
            'ComposantParametres'
        ];

        let tentatives = 0;
        const maxTentatives = 50; // 5 secondes maximum

        while (tentatives < maxTentatives) {
            const tousCharges = composantsRequis.every(nom =>
                typeof window[nom] === 'function'
            );

            if (tousCharges) {
                console.log('Tous les composants sont chargés');
                return;
            }

            await new Promise(resolve => setTimeout(resolve, 100));
            tentatives++;
        }

        console.warn('Timeout: Certains composants ne sont pas encore chargés');
    }

    /**
     * Gère les erreurs de route
     */
    gererErreurRoute(erreur) {
        console.error('Erreur de route:', erreur);

        const zoneContenu = document.getElementById('zone-contenu');
        if (zoneContenu) {
            zoneContenu.innerHTML = this.obtenirHTMLErreur(
                'Une erreur est survenue lors du chargement de la page.'
            );
        }

        // Afficher une notification
        if (typeof afficherNotification === 'function') {
            afficherNotification(
                'Erreur lors du chargement de la page',
                'erreur'
            );
        }
    }

    /**
     * Obtient le HTML de chargement
     */
    obtenirHTMLChargement() {
        return `
            <div class="conteneur-chargement">
                <div class="spinner"></div>
                <p>Chargement en cours...</p>
            </div>
        `;
    }

    /**
     * Obtient le HTML d'erreur
     */
    obtenirHTMLErreur(message) {
        return `
            <div class="conteneur-erreur">
                <div class="alerte alerte-erreur">
                    <h3>⚠️ Erreur</h3>
                    <p>${message}</p>
                    <button class="bouton bouton-primaire" onclick="location.reload()">
                        Recharger la page
                    </button>
                </div>
            </div>
        `;
    }

    /**
     * Obtient la route actuelle
     */
    obtenirRouteActuelle() {
        return this.routeActuelle;
    }

    /**
     * Obtient toutes les routes
     */
    obtenirToutesRoutes() {
        return Array.from(this.routes.values());
    }

    /**
     * Obtient l'historique de navigation
     */
    obtenirHistorique() {
        return [...this.historique];
    }

    /**
     * Vérifie si une route existe
     */
    routeExiste(chemin) {
        return this.routes.has(chemin);
    }

    /**
     * Émet un événement personnalisé
     */
    emettrEvenement(nomEvenement, donnees) {
        const evenement = new CustomEvent(nomEvenement, { detail: donnees });
        document.dispatchEvent(evenement);
    }

    /**
     * Nettoie les ressources
     */
    nettoyer() {
        // Retirer les écouteurs d'événements si nécessaire
        this.routes.clear();
        this.historique = [];
        this.middlewares = [];
    }
}

// Instance globale du gestionnaire de routes
const gestionnaireRoutes = new GestionnaireRoutes();

// Rendre disponible globalement
if (typeof window !== 'undefined') {
    window.GestionnaireRoutes = gestionnaireRoutes;
}