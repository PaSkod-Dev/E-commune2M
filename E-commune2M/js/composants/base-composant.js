/**
 * Classe de Base pour tous les Composants
 * Gestionnaire Cotisations Togo
 *
 * Cette classe fournit les fonctionnalités communes à tous les composants :
 * - Gestion du cycle de vie (rendu, initialisation, nettoyage)
 * - Gestion des événements (écouteurs directs et délégation)
 * - Gestion de l'état
 * - Modales de confirmation
 */

class BaseComposant {
    constructor(options = {}) {
        this.options = options;
        this.etat = {};
        this.elementDOM = null;
        this.ecouteursEvenements = [];
        this.actionsDelegation = new Map(); // Pour l'event delegation
    }

    /**
     * Méthode à implémenter par les composants enfants
     * Retourne le HTML du composant
     */
    async rendre() {
        throw new Error('La méthode rendre() doit être implémentée par le composant enfant');
    }

    /**
     * Initialise le composant après le rendu
     * Méthode optionnelle à surcharger
     */
    async initialiser() {
        // Méthode optionnelle à surcharger
    }

    /**
     * Met à jour l'état du composant
     * @param {Object} nouvelEtat - Nouvel état à fusionner
     */
    mettreAJourEtat(nouvelEtat) {
        this.etat = { ...this.etat, ...nouvelEtat };
        this.reRendre();
    }

    /**
     * Re-rend le composant
     * @returns {Promise<void>}
     */
    async reRendre() {
        if (this.elementDOM) {
            const nouveauContenu = await this.rendre();
            this.elementDOM.innerHTML = nouveauContenu;
            await this.initialiser();
        }
    }

    /**
     * Ajoute un écouteur d'événement
     * @param {HTMLElement} element - L'élément DOM sur lequel écouter
     * @param {string} evenement - Le type d'événement (ex: 'click')
     * @param {Function} gestionnaire - La fonction à exécuter
     */
    ajouterEcouteur(element, evenement, gestionnaire) {
        element.addEventListener(evenement, gestionnaire);
        this.ecouteursEvenements.push({ element, evenement, gestionnaire });
    }

    /**
     * Event Delegation - Configure un écouteur délégué sur un conteneur parent
     * @param {HTMLElement|string} conteneur - Elément parent ou sélecteur
     * @param {string} selecteur - Sélecteur CSS pour les éléments cibles
     * @param {string} evenement - Type d'événement ('click', 'change', etc.)
     * @param {Function} gestionnaire - Fonction gestionnaire
     */
    deleguerEvenement(conteneur, selecteur, evenement, gestionnaire) {
        const element = typeof conteneur === 'string'
            ? document.querySelector(conteneur)
            : conteneur;

        if (!element) {
            console.warn(`Conteneur introuvable pour la délégation: ${conteneur}`);
            return;
        }

        const gestionnaireDeleguee = (e) => {
            // Trouver l'élément correspondant au sélecteur
            const cible = e.target.closest(selecteur);
            if (cible) {
                // Appeler le gestionnaire avec le contexte approprié
                gestionnaire.call(this, e, cible);
            }
        };

        element.addEventListener(evenement, gestionnaireDeleguee);
        this.ecouteursEvenements.push({ element, evenement, gestionnaire: gestionnaireDeleguee });
    }

    /**
     * Configure des actions déléguées via data-attributes
     * @param {HTMLElement|string} conteneur - Elément parent ou sélecteur
     * @param {string} evenement - Type d'événement (par défaut 'click')
     */
    configurerActionsDelegation(conteneur, evenement = 'click') {
        const element = typeof conteneur === 'string'
            ? document.querySelector(conteneur)
            : conteneur;

        if (!element) {
            console.warn(`Conteneur introuvable pour les actions déléguées: ${conteneur}`);
            return;
        }

        const gestionnaireDeleguee = (e) => {
            const cible = e.target.closest('[data-action]');
            if (!cible) return;

            const action = cible.dataset.action;
            const params = this.extraireParametresAction(cible);

            // Exécuter l'action si la méthode existe
            if (typeof this[action] === 'function') {
                e.preventDefault();
                this[action](params, e, cible);
            } else {
                console.warn(`Action introuvable: ${action}`);
            }
        };

        element.addEventListener(evenement, gestionnaireDeleguee);
        this.ecouteursEvenements.push({ element, evenement, gestionnaire: gestionnaireDeleguee });
    }

    /**
     * Extrait les paramètres d'une action depuis les data-attributes
     * @param {HTMLElement} element - Elément avec data-attributes
     * @returns {Object} Paramètres extraits
     */
    extraireParametresAction(element) {
        const params = {};

        // Récupérer tous les data-attributes
        Object.keys(element.dataset).forEach(key => {
            if (key !== 'action') {
                // Convertir les types basiques
                let valeur = element.dataset[key];

                if (valeur === 'true') valeur = true;
                else if (valeur === 'false') valeur = false;
                else if (!isNaN(valeur) && valeur !== '') valeur = Number(valeur);

                params[key] = valeur;
            }
        });

        return params;
    }

    async demanderConfirmation({ titre, message, texteConfirmer = 'Supprimer' } = {}) {
        const overlay = document.getElementById('modal-confirmation-suppression');
        if (!overlay) {
            // fallback : on utilise le confirm natif si la modale n'existe pas
            return confirm(message || 'Confirmer ?');
        }

        const titreEl = document.getElementById('confirmation-titre');
        const messageEl = document.getElementById('confirmation-message');
        const btnConfirmer = document.getElementById('btn-confirmation-confirmer');
        const btnAnnuler = document.getElementById('btn-confirmation-annuler');

        if (titreEl && titre) titreEl.textContent = titre;
        if (messageEl && message) messageEl.textContent = message;
        if (btnConfirmer) btnConfirmer.textContent = texteConfirmer;

        overlay.classList.remove('masque');
        document.body.classList.add('modal-open');

        return new Promise((resolve) => {
            const fermer = (resultat) => {
                overlay.classList.add('masque');
                document.body.classList.remove('modal-open');
                btnConfirmer.removeEventListener('click', onConfirmer);
                btnAnnuler.removeEventListener('click', onAnnuler);
                overlay.removeEventListener('click', onOverlayClick);
                document.removeEventListener('keydown', onKeyDown);
                resolve(resultat);
            };

            const onConfirmer = (e) => {
                e.preventDefault();
                fermer(true);
            };

            const onAnnuler = (e) => {
                e.preventDefault();
                fermer(false);
            };

            const onOverlayClick = (e) => {
                if (e.target === overlay) {
                    fermer(false);
                }
            };

            const onKeyDown = (e) => {
                if (e.key === 'Escape') {
                    fermer(false);
                }
            };

            btnConfirmer.addEventListener('click', onConfirmer);
            btnAnnuler.addEventListener('click', onAnnuler);
            overlay.addEventListener('click', onOverlayClick);
            document.addEventListener('keydown', onKeyDown);
        });
    }

    /**
     * Nettoie les ressources du composant
     */
    nettoyer() {
        // Supprimer tous les écouteurs d'événements
        this.ecouteursEvenements.forEach(({ element, evenement, gestionnaire }) => {
            element.removeEventListener(evenement, gestionnaire);
        });
        this.ecouteursEvenements = [];
        this.actionsDelegation.clear();
    }
}

// Rendre disponible globalement
if (typeof window !== 'undefined') {
    window.BaseComposant = BaseComposant;
}
