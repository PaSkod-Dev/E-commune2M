/**
 * Classe de Base pour tous les Composants
 * Gestionnaire Cotisations Togo
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
     */
    async rendre() {
        throw new Error('La méthode rendre() doit être implémentée par le composant enfant');
    }
    
    /**
     * Initialise le composant après le rendu
     */
    async initialiser() {
        // Méthode optionnelle à surcharger
    }
    
    /**
     * Met à jour l'état du composant
     */
    mettreAJourEtat(nouvelEtat) {
        this.etat = { ...this.etat, ...nouvelEtat };
        this.reRendre();
    }
    
    /**
     * Re-rend le composant
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

// Composant Tableau de Bord (temporaire)
class ComposantTableauBord extends BaseComposant {
    async rendre() {
        return `
            <div class="conteneur-tableau-bord">
                <h1>
                    <svg class="icone-titre" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="3" y="3" width="7" height="7"></rect>
                        <rect x="14" y="3" width="7" height="7"></rect>
                        <rect x="14" y="14" width="7" height="7"></rect>
                        <rect x="3" y="14" width="7" height="7"></rect>
                    </svg>
                    Tableau de Bord
                </h1>
                <div class="grille-kpi">
                    <div class="carte carte-kpi">
                        <div class="carte-body">
                            <div class="kpi-icone">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                                    <circle cx="9" cy="7" r="4"></circle>
                                    <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                                </svg>
                            </div>
                            <div class="kpi-valeur">247</div>
                            <div class="kpi-libelle">Cotisants Actifs</div>
                            <div class="kpi-evolution positif">
                                <svg class="icone-tendance" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <polyline points="22,7 13.5,15.5 8.5,10.5 2,17"></polyline>
                                    <polyline points="16,7 22,7 22,13"></polyline>
                                </svg>
                                +12 ce mois
                            </div>
                        </div>
                    </div>
                    <div class="carte carte-kpi carte-kpi-succes">
                        <div class="carte-body">
                            <div class="kpi-icone">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
                                    <line x1="1" y1="10" x2="23" y2="10"></line>
                                </svg>
                            </div>
                            <div class="kpi-valeur">1,250,000</div>
                            <div class="kpi-libelle">Total Collecté (CFA)</div>
                            <div class="kpi-evolution positif">
                                <svg class="icone-tendance" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <polyline points="22,7 13.5,15.5 8.5,10.5 2,17"></polyline>
                                    <polyline points="16,7 22,7 22,13"></polyline>
                                </svg>
                                +8.5%
                            </div>
                        </div>
                    </div>
                    <div class="carte carte-kpi carte-kpi-accent">
                        <div class="carte-body">
                            <div class="kpi-icone">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <circle cx="12" cy="12" r="10"></circle>
                                    <path d="M8 12l2 2 4-4"></path>
                                </svg>
                            </div>
                            <div class="kpi-valeur">89%</div>
                            <div class="kpi-libelle">Taux de Participation</div>
                            <div class="kpi-evolution positif">
                                <svg class="icone-tendance" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <polyline points="22,7 13.5,15.5 8.5,10.5 2,17"></polyline>
                                    <polyline points="16,7 22,7 22,13"></polyline>
                                </svg>
                                +2.1%
                            </div>
                        </div>
                    </div>
                </div>
                <div class="alerte alerte-info">
                    <svg class="icone-alerte" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="10"></circle>
                        <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
                        <line x1="9" y1="9" x2="9.01" y2="9"></line>
                        <line x1="15" y1="9" x2="15.01" y2="9"></line>
                    </svg>
                    <strong>Bienvenue dans votre Gestionnaire de Cotisations Togo !</strong><br>
                    L'application est maintenant opérationnelle. Naviguez dans le menu pour commencer.
                </div>
            </div>
        `;
    }
}

// Composants temporaires pour les autres pages
class ComposantListeCotisants extends BaseComposant {
    async rendre() {
        return `
            <div class="conteneur-cotisants">
                <h1>
                    <svg class="icone-titre" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                        <circle cx="9" cy="7" r="4"></circle>
                        <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                    </svg>
                    Gestion des Cotisants
                </h1>
                <div class="alerte alerte-info">
                    <svg class="icone-alerte" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                        <polyline points="14,2 14,8 20,8"></polyline>
                        <line x1="16" y1="13" x2="8" y2="13"></line>
                        <line x1="16" y1="17" x2="8" y2="17"></line>
                        <polyline points="10,9 9,9 8,9"></polyline>
                    </svg>
                    Module en cours de développement...
                </div>
            </div>
        `;
    }
}

class ComposantGestionPaiements extends BaseComposant {
    async rendre() {
        return `
            <div class="conteneur-paiements">
                <h1>
                    <svg class="icone-titre" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
                        <line x1="1" y1="10" x2="23" y2="10"></line>
                    </svg>
                    Gestion des Paiements
                </h1>
                <div class="alerte alerte-info">
                    <svg class="icone-alerte" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
                        <line x1="1" y1="10" x2="23" y2="10"></line>
                    </svg>
                    Module en cours de développement...
                </div>
            </div>
        `;
    }
}

class ComposantStatistiques extends BaseComposant {
    async rendre() {
        return `
            <div class="conteneur-statistiques">
                <h1>
                    <svg class="icone-titre" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M16 4v12l-4-2-4 2V4"></path>
                        <rect x="6" y="2" width="12" height="20" rx="2"></rect>
                    </svg>
                    Classements et Classifications
                </h1>
                
                <div class="controles-classement">
                    <div class="groupe-controle">
                        <label>Type de Classement</label>
                        <select id="type-classement" class="select-moderne">
                            <option value="cantons">Classement par Canton</option>
                            <option value="villages">Classement par Village</option>
                            <option value="quartiers">Classement par Quartier</option>
                        </select>
                    </div>
                    
                    <div class="groupe-controle">
                        <label>Critère de Tri</label>
                        <select id="critere-classement" class="select-moderne">
                            <option value="montant_cotise">Montant Cotisé</option>
                            <option value="taux_participation">Taux de Participation</option>
                            <option value="nombre_cotisants">Nombre de Cotisants</option>
                        </select>
                    </div>
                    
                    <div class="groupe-controle">
                        <label>Action</label>
                        <button id="actualiser-classement" class="bouton bouton-primaire">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                            </svg>
                            Actualiser
                        </button>
                    </div>
                </div>
                
                <div id="selecteur-canton" class="selecteur-canton masque">
                    <label>Canton</label>
                    <select id="canton-selection" class="select-moderne">
                        <option value="">Sélectionner un canton...</option>
                    </select>
                </div>
                
                <div id="selecteur-village" class="selecteur-village masque">
                    <label>Village</label>
                    <select id="village-selection" class="select-moderne">
                        <option value="">Sélectionner un village...</option>
                    </select>
                </div>
                
                <div id="contenu-classement" class="contenu-classement">
                    <div class="spinner"></div>
                    <p>Chargement du classement...</p>
                </div>
            </div>
        `;
    }
    
    async initialiser() {
        await this.configurerEvenements();
        await this.chargerCantons();
        await this.actualiserClassement();
    }
    
    async configurerEvenements() {
        const typeSelect = document.getElementById('type-classement');
        const actualiserBtn = document.getElementById('actualiser-classement');
        
        if (typeSelect) {
            typeSelect.addEventListener('change', (e) => {
                this.gererChangementType(e.target.value);
            });
        }
        
        if (actualiserBtn) {
            actualiserBtn.addEventListener('click', () => {
                this.actualiserClassement();
            });
        }
    }
    
    async chargerCantons() {
        try {
            const cantons = await window.StockageDonnees.obtenirTous('cantons');
            const cantonSelect = document.getElementById('canton-selection');
            
            if (cantonSelect) {
                cantonSelect.innerHTML = '<option value="">Sélectionner un canton...</option>';
                cantons.forEach(canton => {
                    const option = document.createElement('option');
                    option.value = canton.id;
                    option.textContent = canton.nom;
                    cantonSelect.appendChild(option);
                });
                
                // Écouter les changements de canton pour charger les villages
                cantonSelect.addEventListener('change', (e) => {
                    this.chargerVillages(e.target.value);
                    this.actualiserClassement();
                });
            }
        } catch (erreur) {
            console.error('Erreur lors du chargement des cantons:', erreur);
        }
    }
    
    async chargerVillages(cantonId) {
        try {
            const villageSelect = document.getElementById('village-selection');
            
            if (!villageSelect || !cantonId) {
                if (villageSelect) {
                    villageSelect.innerHTML = '<option value="">Sélectionner un village...</option>';
                }
                return;
            }
            
            const villages = await window.StockageDonnees.rechercher('villages', { canton_id: parseInt(cantonId) });
            
            villageSelect.innerHTML = '<option value="">Sélectionner un village...</option>';
            villages.forEach(village => {
                const option = document.createElement('option');
                option.value = village.id;
                option.textContent = village.nom;
                villageSelect.appendChild(option);
            });
            
            // Écouter les changements de village
            villageSelect.addEventListener('change', () => {
                this.actualiserClassement();
            });
            
        } catch (erreur) {
            console.error('Erreur lors du chargement des villages:', erreur);
        }
    }
    
    gererChangementType(type) {
        const selecteurCanton = document.getElementById('selecteur-canton');
        const selecteurVillage = document.getElementById('selecteur-village');
        
        // Réinitialiser les sélecteurs
        selecteurCanton.classList.add('masque');
        selecteurVillage.classList.add('masque');
        
        if (type === 'villages') {
            selecteurCanton.classList.remove('masque');
        } else if (type === 'quartiers') {
            selecteurCanton.classList.remove('masque');
            selecteurVillage.classList.remove('masque');
        }
        
        this.actualiserClassement();
    }
    
    async actualiserClassement() {
        try {
            const contenu = document.getElementById('contenu-classement');
            const type = document.getElementById('type-classement').value;
            const critere = document.getElementById('critere-classement').value;
            
            contenu.innerHTML = '<div class="spinner"></div><p>Chargement...</p>';
            
            let donnees;
            
            if (type === 'cantons') {
                donnees = await window.ServiceClassification.obtenirClassementParCanton(critere, 'desc');
            } else if (type === 'villages') {
                const cantonId = document.getElementById('canton-selection').value;
                if (!cantonId) {
                    contenu.innerHTML = '<p class="message-vide">Veuillez sélectionner un canton</p>';
                    return;
                }
                donnees = await window.ServiceClassification.obtenirClassementParVillage(parseInt(cantonId), critere, 'desc');
            } else if (type === 'quartiers') {
                const cantonId = document.getElementById('canton-selection').value;
                const villageId = document.getElementById('village-selection').value;
                
                if (!cantonId) {
                    contenu.innerHTML = '<p class="message-vide">Veuillez sélectionner un canton</p>';
                    return;
                }
                if (!villageId) {
                    contenu.innerHTML = '<p class="message-vide">Veuillez sélectionner un village</p>';
                    return;
                }
                
                donnees = await window.ServiceClassification.obtenirClassementParQuartier(parseInt(villageId), critere, 'desc');
            }
            
            this.afficherClassement(donnees, type);
            
        } catch (erreur) {
            console.error('Erreur:', erreur);
            document.getElementById('contenu-classement').innerHTML = '<p>Erreur lors du chargement</p>';
        }
    }
    
    afficherClassement(donnees, type) {
        const contenu = document.getElementById('contenu-classement');
        
        if (!donnees || donnees.length === 0) {
            contenu.innerHTML = '<p>Aucune donnée disponible</p>';
            return;
        }
        
        let html = '<table class="tableau-moderne"><thead><tr>';
        html += '<th>Rang</th>';
        
        if (type === 'cantons') {
            html += '<th>Canton</th>';
        } else if (type === 'villages') {
            html += '<th>Village</th>';
        } else if (type === 'quartiers') {
            html += '<th>Quartier</th>';
        }
        
        html += '<th>Cotisants</th><th>Montant Total</th><th>Participation</th>';
        html += '</tr></thead><tbody>';
        
        donnees.forEach(item => {
            let nom;
            if (type === 'cantons') {
                nom = item.canton.nom;
            } else if (type === 'villages') {
                nom = item.village.nom;
            } else if (type === 'quartiers') {
                nom = item.quartier.nom;
            }
            
            const badge = item.rang <= 3 ? `badge-rang-${item.rang}` : 'badge-rang';
            
            html += `<tr>
                <td><span class="badge ${badge}">${item.rang}</span></td>
                <td><strong>${nom}</strong></td>
                <td>${item.statistiques.nombre_cotisants}</td>
                <td>${formaterMontant(item.statistiques.montant_total)} CFA</td>
                <td>${item.statistiques.taux_participation}%</td>
            </tr>`;
        });
        
        html += '</tbody></table>';
        contenu.innerHTML = html;
    }
}

class ComposantGestionCantons extends BaseComposant {
    constructor(options = {}) {
        super(options);
        this.etat = {
            cantons: [],
            villages: [],
            cantonSelectionne: null,
            modeEdition: false,
            formulaireVisible: false
        };
    }

    async rendre() {
        return `
            <div class="conteneur-cantons">
                <div class="en-tete-page">
                    <h1>
                        <svg class="icone-titre" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                            <circle cx="12" cy="10" r="3"></circle>
                        </svg>
                        Gestion des Cantons et Villages
                    </h1>
                    <button id="btn-nouveau-canton" class="bouton bouton-primaire">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="12" cy="12" r="10"></circle>
                            <line x1="12" y1="8" x2="12" y2="16"></line>
                            <line x1="8" y1="12" x2="16" y2="12"></line>
                        </svg>
                        Nouveau Canton
                    </button>
                </div>

                <!-- Formulaire Canton -->
                <div id="formulaire-canton" class="carte formulaire-carte masque">
                    <div class="carte-header">
                        <h3 id="titre-formulaire">Nouveau Canton</h3>
                        <button id="btn-fermer-formulaire" class="bouton-fermer-modal">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>
                    </div>
                    <div class="carte-body">
                        <form id="form-canton">
                            <div class="groupe-champ">
                                <label class="etiquette-champ" for="nom-canton">Nom du Canton *</label>
                                <input type="text" id="nom-canton" name="nom" class="champ-saisie" required placeholder="Ex: Golfe">
                                <div class="message-erreur" id="erreur-nom"></div>
                            </div>
                            <div class="groupe-champ">
                                <label class="etiquette-champ" for="description-canton">Description</label>
                                <textarea id="description-canton" name="description" class="champ-saisie" rows="3" placeholder="Description optionnelle du canton"></textarea>
                            </div>
                            <div class="actions-formulaire">
                                <button type="button" id="btn-annuler" class="bouton bouton-ghost">Annuler</button>
                                <button type="submit" id="btn-sauvegarder" class="bouton bouton-primaire">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h14a2 2 0 012 2v11l5-5 1.41-1.41L5 17.25V21z"></path>
                                    </svg>
                                    Sauvegarder
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                <!-- Formulaire Village -->
                <div id="formulaire-village" class="carte formulaire-carte masque">
                    <div class="carte-header">
                        <h3 id="titre-formulaire-village">Nouveau Village</h3>
                        <button id="btn-fermer-formulaire-village" class="bouton-fermer-modal">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>
                    </div>
                    <div class="carte-body">
                        <form id="form-village">
                            <div class="groupe-champ">
                                <label class="etiquette-champ" for="canton-village">Canton *</label>
                                <select id="canton-village" name="canton_id" class="champ-saisie" required>
                                    <option value="">Sélectionner un canton...</option>
                                </select>
                                <div class="message-erreur" id="erreur-canton-village"></div>
                            </div>
                            <div class="groupe-champ">
                                <label class="etiquette-champ" for="nom-village">Nom du Village *</label>
                                <input type="text" id="nom-village" name="nom" class="champ-saisie" required placeholder="Ex: Bè">
                                <div class="message-erreur" id="erreur-nom-village"></div>
                            </div>
                            <div class="groupe-champ">
                                <label class="etiquette-champ" for="population-village">Population (optionnel)</label>
                                <input type="number" id="population-village" name="population" class="champ-saisie" min="0" placeholder="Ex: 5000">
                            </div>
                            <div class="groupe-champ">
                                <label class="etiquette-champ" for="description-village">Description</label>
                                <textarea id="description-village" name="description" class="champ-saisie" rows="3" placeholder="Description optionnelle du village"></textarea>
                            </div>
                            <div class="actions-formulaire">
                                <button type="button" id="btn-annuler-village" class="bouton bouton-ghost">Annuler</button>
                                <button type="submit" id="btn-sauvegarder-village" class="bouton bouton-primaire">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h14a2 2 0 012 2v11l5-5 1.41-1.41L5 17.25V21z"></path>
                                    </svg>
                                    Sauvegarder
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                <!-- Formulaire Quartier -->
                <div id="formulaire-quartier" class="carte formulaire-carte masque">
                    <div class="carte-header">
                        <h3 id="titre-formulaire-quartier">Nouveau Quartier</h3>
                        <button id="btn-fermer-formulaire-quartier" class="bouton-fermer-modal">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>
                    </div>
                    <div class="carte-body">
                        <form id="form-quartier">
                            <div class="groupe-champ">
                                <label class="etiquette-champ" for="village-quartier">Village *</label>
                                <select id="village-quartier" name="village_id" class="champ-saisie" required>
                                    <option value="">Sélectionner un village...</option>
                                </select>
                                <div class="message-erreur" id="erreur-village-quartier"></div>
                            </div>
                            <div class="groupe-champ">
                                <label class="etiquette-champ" for="nom-quartier">Nom du Quartier *</label>
                                <input type="text" id="nom-quartier" name="nom" class="champ-saisie" required placeholder="Ex: Tokoin">
                                <div class="message-erreur" id="erreur-nom-quartier"></div>
                            </div>
                            <div class="groupe-champ">
                                <label class="etiquette-champ" for="description-quartier">Description</label>
                                <textarea id="description-quartier" name="description" class="champ-saisie" rows="3" placeholder="Description optionnelle du quartier"></textarea>
                            </div>
                            <div class="actions-formulaire">
                                <button type="button" id="btn-annuler-quartier" class="bouton bouton-ghost">Annuler</button>
                                <button type="submit" id="btn-sauvegarder-quartier" class="bouton bouton-primaire">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h14a2 2 0 012 2v11l5-5 1.41-1.41L5 17.25V21z"></path>
                                    </svg>
                                    Sauvegarder
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                <!-- Liste des Cantons -->
                <div class="carte">
                    <div class="carte-header">
                        <h3>Liste des Cantons</h3>
                        <div class="barre-recherche">
                            <input type="text" id="recherche-canton" placeholder="Rechercher un canton..." class="champ-saisie">
                            <svg class="icone-recherche" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <circle cx="11" cy="11" r="8"></circle>
                                <path d="M21 21l-4.35-4.35"></path>
                            </svg>
                        </div>
                    </div>
                    <div class="carte-body">
                        <div id="liste-cantons" class="tableau-conteneur">
                            <div class="spinner"></div>
                            <p>Chargement des cantons...</p>
                        </div>
                    </div>
                </div>

                <!-- Détails du Canton Sélectionné -->
                <div id="details-canton" class="carte masque">
                    <div class="carte-header">
                        <h3 id="nom-canton-selectionne">Villages du Canton</h3>
                        <button id="btn-nouveau-village" class="bouton bouton-secondaire">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <circle cx="12" cy="12" r="10"></circle>
                                <line x1="12" y1="8" x2="12" y2="16"></line>
                                <line x1="8" y1="12" x2="16" y2="12"></line>
                            </svg>
                            Nouveau Village
                        </button>
                    </div>
                    <div class="carte-body">
                        <div id="liste-villages" class="tableau-conteneur">
                            <p class="message-vide">Sélectionnez un canton pour voir ses villages</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    async initialiser() {
        await this.chargerCantons();
        this.configurerEvenements();
    }

    configurerEvenements() {
        // Bouton nouveau canton
        document.getElementById('btn-nouveau-canton')?.addEventListener('click', () => {
            this.afficherFormulaireCantonVide();
        });

        // Fermer formulaire
        document.getElementById('btn-fermer-formulaire')?.addEventListener('click', () => {
            this.masquerFormulaire();
        });

        // Annuler formulaire
        document.getElementById('btn-annuler')?.addEventListener('click', () => {
            this.masquerFormulaire();
        });

        // Soumettre formulaire
        document.getElementById('form-canton')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.sauvegarderCanton();
        });

        // Recherche
        document.getElementById('recherche-canton')?.addEventListener('input', (e) => {
            this.filtrerCantons(e.target.value);
        });

        // Nouveau village
        document.getElementById('btn-nouveau-village')?.addEventListener('click', () => {
            this.afficherFormulaireVillage();
        });

        // Formulaire village
        document.getElementById('btn-fermer-formulaire-village')?.addEventListener('click', () => {
            this.masquerFormulaireVillage();
        });

        document.getElementById('btn-annuler-village')?.addEventListener('click', () => {
            this.masquerFormulaireVillage();
        });

        document.getElementById('form-village')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.sauvegarderVillage();
        });
    }

    async chargerCantons() {
        try {
            const cantons = await window.StockageDonnees.obtenirTous('cantons');
            this.etat.cantons = cantons;
            this.afficherCantons(cantons);
            this.chargerCantonsFormulaire();
        } catch (erreur) {
            console.error('Erreur lors du chargement des cantons:', erreur);
            this.afficherErreur('Erreur lors du chargement des cantons');
        }
    }

    chargerCantonsFormulaire() {
        const selectCanton = document.getElementById('canton-village');
        if (!selectCanton) return;

        selectCanton.innerHTML = '<option value="">Sélectionner un canton...</option>';
        this.etat.cantons.forEach(canton => {
            const option = document.createElement('option');
            option.value = canton.id;
            option.textContent = canton.nom;
            selectCanton.appendChild(option);
        });
    }

    afficherCantons(cantons) {
        const conteneur = document.getElementById('liste-cantons');
        if (!conteneur) return;

        if (cantons.length === 0) {
            conteneur.innerHTML = '<p class="message-vide">Aucun canton trouvé. Créez le premier canton.</p>';
            return;
        }

        let html = `
            <table class="tableau">
                <thead>
                    <tr>
                        <th>Nom</th>
                        <th>Description</th>
                        <th>Villages</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
        `;

        cantons.forEach(canton => {
            const nombreVillages = this.compterVillages(canton.id);
            html += `
                <tr data-canton-id="${canton.id}">
                    <td><strong>${canton.nom}</strong></td>
                    <td>${canton.description || '-'}</td>
                    <td>
                        <span class="badge badge-info">${nombreVillages} village(s)</span>
                    </td>
                    <td>
                        <div class="actions-tableau">
                            <button class="bouton-action-tableau" onclick="composantCantons.voirCanton(${canton.id})" title="Voir">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                    <circle cx="12" cy="12" r="3"></circle>
                                </svg>
                            </button>
                            <button class="bouton-action-tableau" onclick="composantCantons.modifierCanton(${canton.id})" title="Modifier">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"></path>
                                    <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                </svg>
                            </button>
                            <button class="bouton-action-tableau" onclick="composantCantons.supprimerCanton(${canton.id})" title="Supprimer">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <polyline points="3,6 5,6 21,6"></polyline>
                                    <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"></path>
                                </svg>
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        });

        html += '</tbody></table>';
        conteneur.innerHTML = html;
    }

    compterVillages(cantonId) {
        return this.etat.villages.filter(v => v.canton_id === cantonId).length;
    }

    afficherFormulaireCantonVide() {
        this.etat.modeEdition = false;
        this.etat.cantonSelectionne = null;
        
        document.getElementById('titre-formulaire').textContent = 'Nouveau Canton';
        document.getElementById('form-canton').reset();
        document.getElementById('formulaire-canton').classList.remove('masque');
    }

    masquerFormulaire() {
        document.getElementById('formulaire-canton').classList.add('masque');
        document.getElementById('form-canton').reset();
        this.viderErreurs();
    }

    async sauvegarderCanton() {
        const formData = new FormData(document.getElementById('form-canton'));
        const canton = {
            nom: formData.get('nom').trim(),
            description: formData.get('description').trim()
        };

        // Validation
        if (!this.validerCanton(canton)) return;

        try {
            if (this.etat.modeEdition) {
                canton.id = this.etat.cantonSelectionne.id;
                await window.StockageDonnees.mettreAJour('cantons', canton.id, canton);
            } else {
                await window.StockageDonnees.ajouter('cantons', canton);
            }

            this.masquerFormulaire();
            await this.chargerCantons();
            this.afficherSucces(this.etat.modeEdition ? 'Canton modifié avec succès' : 'Canton créé avec succès');
        } catch (erreur) {
            console.error('Erreur lors de la sauvegarde:', erreur);
            this.afficherErreur('Erreur lors de la sauvegarde');
        }
    }

    validerCanton(canton) {
        this.viderErreurs();
        let valide = true;

        if (!canton.nom) {
            this.afficherErreurChamp('erreur-nom', 'Le nom est obligatoire');
            valide = false;
        } else if (canton.nom.length < 2) {
            this.afficherErreurChamp('erreur-nom', 'Le nom doit contenir au moins 2 caractères');
            valide = false;
        }

        return valide;
    }

    viderErreurs() {
        document.querySelectorAll('.message-erreur').forEach(el => el.textContent = '');
    }

    afficherErreurChamp(idChamp, message) {
        const champ = document.getElementById(idChamp);
        if (champ) champ.textContent = message;
    }

    voirCanton(cantonId) {
        const canton = this.etat.cantons.find(c => c.id === cantonId);
        if (!canton) return;

        this.etat.cantonSelectionne = canton;
        
        // Afficher la section des détails
        const detailsCanton = document.getElementById('details-canton');
        const nomCanton = document.getElementById('nom-canton-selectionne');
        
        if (detailsCanton && nomCanton) {
            nomCanton.textContent = `Villages du Canton ${canton.nom}`;
            detailsCanton.classList.remove('masque');
            
            // Charger et afficher les villages
            this.chargerVillages(cantonId);
        }
    }

    modifierCanton(cantonId) {
        const canton = this.etat.cantons.find(c => c.id === cantonId);
        if (!canton) return;

        this.etat.modeEdition = true;
        this.etat.cantonSelectionne = canton;

        document.getElementById('titre-formulaire').textContent = 'Modifier Canton';
        document.getElementById('nom-canton').value = canton.nom;
        document.getElementById('description-canton').value = canton.description || '';
        document.getElementById('formulaire-canton').classList.remove('masque');
    }

    async supprimerCanton(cantonId) {
        if (!confirm('Êtes-vous sûr de vouloir supprimer ce canton ?')) return;

        try {
            await window.StockageDonnees.supprimer('cantons', cantonId);
            await this.chargerCantons();
            this.afficherSucces('Canton supprimé avec succès');
        } catch (erreur) {
            console.error('Erreur lors de la suppression:', erreur);
            this.afficherErreur('Erreur lors de la suppression');
        }
    }

    filtrerCantons(terme) {
        const cantonsFiltres = this.etat.cantons.filter(canton => 
            canton.nom.toLowerCase().includes(terme.toLowerCase())
        );
        this.afficherCantons(cantonsFiltres);
    }

    afficherSucces(message) {
        // Implémentation simple - peut être améliorée avec des toasts
        console.log('Succès:', message);
    }

    afficherErreur(message) {
        // Implémentation simple - peut être améliorée avec des toasts
        console.error('Erreur:', message);
    }

    afficherFormulaireVillage() {
        this.etat.modeEditionVillage = false;
        this.etat.villageSelectionne = null;
        
        // Pré-sélectionner le canton si un canton est sélectionné
        const selectCanton = document.getElementById('canton-village');
        if (this.etat.cantonSelectionne && selectCanton) {
            selectCanton.value = this.etat.cantonSelectionne.id;
        }
        
        document.getElementById('titre-formulaire-village').textContent = 'Nouveau Village';
        document.getElementById('form-village').reset();
        if (this.etat.cantonSelectionne && selectCanton) {
            selectCanton.value = this.etat.cantonSelectionne.id;
        }
        document.getElementById('formulaire-village').classList.remove('masque');
    }

    masquerFormulaireVillage() {
        document.getElementById('formulaire-village').classList.add('masque');
        document.getElementById('form-village').reset();
        this.viderErreursVillage();
    }

    async chargerVillages(cantonId) {
        try {
            const villages = await window.StockageDonnees.rechercher('villages', { canton_id: parseInt(cantonId) });
            this.etat.villages = villages;
            this.afficherVillages(villages);
        } catch (erreur) {
            console.error('Erreur lors du chargement des villages:', erreur);
            this.afficherErreur('Erreur lors du chargement des villages');
        }
    }

    afficherVillages(villages) {
        const conteneur = document.getElementById('liste-villages');
        if (!conteneur) return;

        if (villages.length === 0) {
            conteneur.innerHTML = '<p class="message-vide">Aucun village dans ce canton. Créez le premier village.</p>';
            return;
        }

        let html = `
            <table class="tableau">
                <thead>
                    <tr>
                        <th>Nom</th>
                        <th>Population</th>
                        <th>Description</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
        `;

        villages.forEach(village => {
            html += `
                <tr data-village-id="${village.id}">
                    <td><strong>${village.nom}</strong></td>
                    <td>${village.population ? village.population.toLocaleString() : '-'}</td>
                    <td>${village.description || '-'}</td>
                    <td>
                        <div class="actions-tableau">
                            <button class="bouton-action-tableau" onclick="composantCantons.modifierVillage(${village.id})" title="Modifier">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"></path>
                                    <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                </svg>
                            </button>
                            <button class="bouton-action-tableau" onclick="composantCantons.supprimerVillage(${village.id})" title="Supprimer">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <polyline points="3,6 5,6 21,6"></polyline>
                                    <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"></path>
                                </svg>
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        });

        html += '</tbody></table>';
        conteneur.innerHTML = html;
    }

    async sauvegarderVillage() {
        const formData = new FormData(document.getElementById('form-village'));
        const village = {
            canton_id: parseInt(formData.get('canton_id')),
            nom: formData.get('nom').trim(),
            population: formData.get('population') ? parseInt(formData.get('population')) : null,
            description: formData.get('description').trim()
        };

        // Validation
        if (!this.validerVillage(village)) return;

        try {
            if (this.etat.modeEditionVillage) {
                village.id = this.etat.villageSelectionne.id;
                await window.StockageDonnees.mettreAJour('villages', village.id, village);
            } else {
                await window.StockageDonnees.ajouter('villages', village);
            }

            this.masquerFormulaireVillage();
            
            // Recharger les données
            await this.chargerCantons();
            if (this.etat.cantonSelectionne) {
                await this.chargerVillages(this.etat.cantonSelectionne.id);
            }
            
            this.afficherSucces(this.etat.modeEditionVillage ? 'Village modifié avec succès' : 'Village créé avec succès');
        } catch (erreur) {
            console.error('Erreur lors de la sauvegarde du village:', erreur);
            this.afficherErreur('Erreur lors de la sauvegarde du village');
        }
    }

    validerVillage(village) {
        this.viderErreursVillage();
        let valide = true;

        if (!village.canton_id) {
            this.afficherErreurChamp('erreur-canton-village', 'Le canton est obligatoire');
            valide = false;
        }

        if (!village.nom) {
            this.afficherErreurChamp('erreur-nom-village', 'Le nom est obligatoire');
            valide = false;
        } else if (village.nom.length < 2) {
            this.afficherErreurChamp('erreur-nom-village', 'Le nom doit contenir au moins 2 caractères');
            valide = false;
        }

        return valide;
    }

    viderErreursVillage() {
        document.getElementById('erreur-canton-village').textContent = '';
        document.getElementById('erreur-nom-village').textContent = '';
    }

    modifierVillage(villageId) {
        const village = this.etat.villages.find(v => v.id === villageId);
        if (!village) return;

        this.etat.modeEditionVillage = true;
        this.etat.villageSelectionne = village;

        document.getElementById('titre-formulaire-village').textContent = 'Modifier Village';
        document.getElementById('canton-village').value = village.canton_id;
        document.getElementById('nom-village').value = village.nom;
        document.getElementById('population-village').value = village.population || '';
        document.getElementById('description-village').value = village.description || '';
        document.getElementById('formulaire-village').classList.remove('masque');
    }

    async supprimerVillage(villageId) {
        if (!confirm('Êtes-vous sûr de vouloir supprimer ce village ?')) return;

        try {
            await window.StockageDonnees.supprimer('villages', villageId);
            
            // Recharger les données
            await this.chargerCantons();
            if (this.etat.cantonSelectionne) {
                await this.chargerVillages(this.etat.cantonSelectionne.id);
            }
            
            this.afficherSucces('Village supprimé avec succès');
        } catch (erreur) {
            console.error('Erreur lors de la suppression du village:', erreur);
            this.afficherErreur('Erreur lors de la suppression du village');
        }
    }
}

class ComposantRapports extends BaseComposant {
    async rendre() {
        return `
            <div class="conteneur-rapports">
                <h1>
                    <svg class="icone-titre" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                        <polyline points="14,2 14,8 20,8"></polyline>
                        <line x1="16" y1="13" x2="8" y2="13"></line>
                        <line x1="16" y1="17" x2="8" y2="17"></line>
                        <polyline points="10,9 9,9 8,9"></polyline>
                    </svg>
                    Génération de Rapports
                </h1>
                <div class="alerte alerte-info">
                    <svg class="icone-alerte" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                    </svg>
                    Module en cours de développement...
                </div>
            </div>
        `;
    }
}

class ComposantParametres extends BaseComposant {
    async rendre() {
        return `
            <div class="conteneur-parametres">
                <h1>
                    <svg class="icone-titre" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="3"></circle>
                        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1 1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                    </svg>
                    Paramètres
                </h1>
                <div class="alerte alerte-info">
                    <svg class="icone-alerte" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                        <path d="M9 12l2 2 4-4"></path>
                    </svg>
                    Module en cours de développement...
                </div>
            </div>
        `;
    }
}

// Rendre disponibles globalement
if (typeof window !== 'undefined') {
    window.BaseComposant = BaseComposant;
    window.ComposantTableauBord = ComposantTableauBord;
    window.ComposantListeCotisants = ComposantListeCotisants;
    window.ComposantGestionPaiements = ComposantGestionPaiements;
    window.ComposantStatistiques = ComposantStatistiques;
    window.ComposantGestionCantons = ComposantGestionCantons;
    window.ComposantRapports = ComposantRapports;
    window.ComposantParametres = ComposantParametres;
    
    // Référence globale pour les actions des tableaux
    window.composantCantons = null;
}