/**
 * Composant Gestion des Cantons et Villages
 * Gestionnaire Cotisations Togo
 *
 * Ce composant permet de gérer la hiérarchie géographique :
 * - Cantons (niveau 1)
 * - Villages (niveau 2, liés aux cantons)
 * - Quartiers (niveau 3, liés aux villages)
 */

class ComposantGestionCantons extends BaseComposant {
    constructor(options = {}) {
        super(options);
        this.etat = {
            cantons: [],
            villages: [],          // villages du canton sélectionné
            quartiers: [],
            tousLesVillages: [],   // tous les villages, pour compter par canton
            cantonSelectionne: null,
            villageSelectionne: null,
            quartierSelectionne: null,
            modeEdition: false,
            modeEditionVillage: false,
            modeEditionQuartier: false,
            formulaireVisible: false
        };
        this.sauvegardeQuartierEnCours = false;
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
                    <button id="btn-nouveau-canton" class="bouton bouton-primaire" title="Créer un nouveau canton">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="12" cy="12" r="10"></circle>
                            <line x1="12" y1="8" x2="12" y2="16"></line>
                            <line x1="8" y1="12" x2="16" y2="12"></line>
                        </svg>
                        Nouveau Canton
                    </button>
                </div>

                <!-- Formulaire Canton -->
                <div id="formulaire-canton" class="overlay-modal masque">
                    <div class="modal formulaire-carte">
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
                </div>

                <!-- Formulaire Village -->
                <div id="formulaire-village" class="overlay-modal masque">
                    <div class="modal formulaire-carte">
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
                </div>

                <!-- Formulaire Quartier -->
                <div id="formulaire-quartier" class="overlay-modal masque">
                    <div class="modal formulaire-carte">
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
                        <button id="btn-nouveau-village" class="bouton bouton-secondaire" title="Créer un nouveau village dans ce canton">
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
                        <div id="liste-quartiers" class="tableau-conteneur">
                            <p class="message-vide">Sélectionnez un village pour voir ses quartiers</p>
                        </div>
                    </div>
                </div>
                
                                <!-- Modale de confirmation de suppression -->
                <div id="modal-confirmation-suppression" class="overlay-modal masque">
                    <div class="modal modal-confirmation">
                        <div class="modal-confirmation-header">
                            <div class="modal-confirmation-icone">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <circle cx="12" cy="12" r="10"></circle>
                                    <line x1="12" y1="8" x2="12" y2="12"></line>
                                    <circle cx="12" cy="16" r="1"></circle>
                                </svg>
                            </div>
                            <div class="modal-confirmation-titres">
                                <h3 id="confirmation-titre">Confirmer la suppression</h3>
                                <p id="confirmation-sous-titre">Cette action est irréversible.</p>
                            </div>
                        </div>
                        <div class="modal-confirmation-body">
                            <p id="confirmation-message">Êtes-vous sûr de vouloir supprimer cet élément&nbsp;?</p>
                        </div>
                        <div class="modal-confirmation-actions">
                            <button id="btn-confirmation-annuler" class="bouton bouton-ghost">
                                Annuler
                            </button>
                            <button id="btn-confirmation-confirmer" class="bouton bouton-danger">
                                Supprimer
                            </button>
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

        // Formulaire quartier
        document.getElementById('btn-fermer-formulaire-quartier')?.addEventListener('click', () => {
            this.masquerFormulaireQuartier();
        });

        document.getElementById('btn-annuler-quartier')?.addEventListener('click', () => {
            this.masquerFormulaireQuartier();
        });

        document.getElementById('form-quartier')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.sauvegarderQuartier();
        });
    }

    async chargerCantons() {
        try {
            // On charge tous les cantons
            const cantons = await window.StockageDonnees.obtenirTous('cantons');

            // On charge aussi tous les villages pour pouvoir compter par canton
            const tousLesVillages = await window.StockageDonnees.obtenirTous('villages');

            this.etat.cantons = cantons;
            this.etat.tousLesVillages = tousLesVillages;

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
                            <button class="bouton-action-tableau" onclick="composantCantons.voirCanton(${canton.id})" title="Voir les villages de ce canton">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                    <circle cx="12" cy="12" r="3"></circle>
                                </svg>
                            </button>
                            <button class="bouton-action-tableau" onclick="composantCantons.modifierCanton(${canton.id})" title="Modifier ce canton">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"></path>
                                    <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                </svg>
                            </button>
                            <button class="bouton-action-tableau" onclick="composantCantons.supprimerCanton(${canton.id})" title="Supprimer ce canton">
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
        if (!this.etat.tousLesVillages) {
            return 0;
        }

        return this.etat.tousLesVillages.filter(v => v.canton_id === cantonId).length;
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

    afficherFormulaireCantonVide() {
        this.etat.modeEdition = false;
        this.etat.cantonSelectionne = null;

        // Fermer les autres formulaires avant d'ouvrir celui du canton
        this.masquerFormulaireVillage();
        this.masquerFormulaireQuartier();

        document.getElementById('titre-formulaire').textContent = 'Nouveau Canton';
        document.getElementById('form-canton').reset();
        document.getElementById('formulaire-canton').classList.remove('masque');
        document.body.classList.add('modal-open');
    }

    masquerFormulaire() {
        document.getElementById('formulaire-canton').classList.add('masque');
        document.getElementById('form-canton').reset();
        this.viderErreurs();
        document.body.classList.remove('modal-open');
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
            if (this.etat.modeEdition && this.etat.cantonSelectionne) {
                const cantonMisAJour = {
                    ...this.etat.cantonSelectionne,
                    ...canton
                };
                await window.StockageDonnees.mettreAJour('cantons', cantonMisAJour);
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

        // Met à jour le canton courant
        this.etat.cantonSelectionne = canton;

        // Réinitialise la sélection de village et les quartiers
        this.etat.villageSelectionne = null;
        this.etat.quartiers = [];

        const listeQuartiers = document.getElementById('liste-quartiers');
        if (listeQuartiers) {
            listeQuartiers.innerHTML = '<p class="message-vide">Sélectionnez un village pour voir ses quartiers</p>';
        }


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

        // Fermer les autres formulaires avant d'ouvrir celui du canton
        this.masquerFormulaireVillage();
        this.masquerFormulaireQuartier();

        document.getElementById('titre-formulaire').textContent = 'Modifier Canton';
        document.getElementById('nom-canton').value = canton.nom;
        document.getElementById('description-canton').value = canton.description || '';
        document.getElementById('formulaire-canton').classList.remove('masque');
        document.body.classList.add('modal-open');
    }

    async supprimerCanton(cantonId) {
        const canton = this.etat.cantons.find(c => c.id === cantonId);
        const ok = await this.demanderConfirmation({
            titre: 'Supprimer ce canton',
            message: `Êtes-vous sûr de vouloir supprimer le canton ${canton ? canton.nom : ''} ? Cette action est définitive.`,
            texteConfirmer: 'Supprimer le canton'
        });
        if (!ok) return;

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

        // Fermer les formulaires canton et quartier avant d'ouvrir celui du village
        this.masquerFormulaire();
        this.masquerFormulaireQuartier();

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
        document.body.classList.add('modal-open');
    }

    masquerFormulaireVillage() {
        document.getElementById('formulaire-village').classList.add('masque');
        document.getElementById('form-village').reset();
        this.viderErreursVillage();
        document.body.classList.remove('modal-open');
    }

    async chargerVillages(cantonId) {
        try {
            const villages = await window.StockageDonnees.rechercher('villages', { canton_id: parseInt(cantonId) });
            this.etat.villages = villages;
            this.chargerVillagesFormulaireQuartier();
            this.afficherVillages(villages);
        } catch (erreur) {
            console.error('Erreur lors du chargement des villages:', erreur);
            this.afficherErreur('Erreur lors du chargement des villages');
        }
    }

    chargerVillagesFormulaireQuartier() {
        const selectVillage = document.getElementById('village-quartier');
        if (!selectVillage) return;

        selectVillage.innerHTML = '<option value="">Sélectionner un village...</option>';
        this.etat.villages.forEach(village => {
            const option = document.createElement('option');
            option.value = village.id;
            option.textContent = village.nom;
            selectVillage.appendChild(option);
        });
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
                            <button class="bouton-action-tableau" onclick="composantCantons.modifierVillage(${village.id})" title="Modifier ce village">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"></path>
                                    <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                </svg>
                            </button>
                            <button class="bouton-action-tableau" onclick="composantCantons.supprimerVillage(${village.id})" title="Supprimer ce village">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <polyline points="3,6 5,6 21,6"></polyline>
                                    <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"></path>
                                </svg>
                            </button>
                            <button class="bouton-action-tableau" onclick="composantCantons.voirQuartiersVillage(${village.id})" title="Voir les quartiers de ce village">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                    <circle cx="12" cy="12" r="3"></circle>
                                </svg>
                            </button>
                            <button class="bouton-action-tableau" onclick="composantCantons.afficherFormulaireQuartier(${village.id})" title="Ajouter un quartier à ce village">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <circle cx="12" cy="12" r="10"></circle>
                                    <line x1="12" y1="8" x2="12" y2="16"></line>
                                    <line x1="8" y1="12" x2="16" y2="12"></line>
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

    async chargerQuartiers(villageId) {
        try {
            const quartiers = await window.StockageDonnees.rechercher('quartiers', { village_id: parseInt(villageId) });
            this.etat.quartiers = quartiers;
            this.afficherQuartiers(quartiers);
        } catch (erreur) {
            console.error('Erreur lors du chargement des quartiers:', erreur);
            this.afficherErreur('Erreur lors du chargement des quartiers');
        }
    }

    afficherQuartiers(quartiers) {
        const conteneur = document.getElementById('liste-quartiers');
        if (!conteneur) return;

        if (!this.etat.villageSelectionne) {
            conteneur.innerHTML = '<p class="message-vide">Sélectionnez un village pour voir ses quartiers</p>';
            return;
        }

        if (!quartiers || quartiers.length === 0) {
            conteneur.innerHTML = `<p class="message-vide">Aucun quartier dans le village ${this.etat.villageSelectionne.nom}. Créez le premier quartier.</p>`;
            return;
        }
        // On récupère le nom du canton pour afficher tout le chemin
        const nomCanton = this.etat.cantonSelectionne ? this.etat.cantonSelectionne.nom : '';

        let html = `
            <div class="en-tete-quartiers">
                <span class="badge-hierarchie niveau-quartier">Niveau 3 · Quartiers</span>
                <div class="chemin-hierarchie">
                    ${nomCanton ? `Canton ${nomCanton} > ` : ''}Village ${this.etat.villageSelectionne.nom} > Quartiers
                </div>
            </div>
            <table class="tableau quartiers-du-village">
                <thead>
                    <tr>
                        <th>Nom</th>
                        <th>Description</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
        `;

        quartiers.forEach(quartier => {
            html += `
                <tr data-quartier-id="${quartier.id}">
                    <td><strong>${quartier.nom}</strong></td>
                    <td>${quartier.description || '-'}</td>
                    <td>
                        <div class="actions-tableau">
                            <button class="bouton-action-tableau" onclick="composantCantons.modifierQuartier(${quartier.id})" title="Modifier ce quartier">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"></path>
                                    <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                </svg>
                            </button>
                            <button class="bouton-action-tableau" onclick="composantCantons.supprimerQuartier(${quartier.id})" title="Supprimer ce quartier">
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
            if (this.etat.modeEditionVillage && this.etat.villageSelectionne) {
                const villageMisAJour = {
                    ...this.etat.villageSelectionne,
                    ...village
                };
                await window.StockageDonnees.mettreAJour('villages', villageMisAJour);
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

        // Fermer les formulaires canton et quartier avant d'ouvrir celui du village
        this.masquerFormulaire();
        this.masquerFormulaireQuartier();

        document.getElementById('titre-formulaire-village').textContent = 'Modifier Village';
        document.getElementById('canton-village').value = village.canton_id;
        document.getElementById('nom-village').value = village.nom;
        document.getElementById('population-village').value = village.population || '';
        document.getElementById('description-village').value = village.description || '';
        document.getElementById('formulaire-village').classList.remove('masque');
        document.body.classList.add('modal-open');
    }

    async supprimerVillage(villageId) {
        const village = this.etat.villages.find(v => v.id === villageId);
        const ok = await this.demanderConfirmation({
            titre: 'Supprimer ce village',
            message: `Êtes-vous sûr de vouloir supprimer le village ${village ? village.nom : ''} ?`,
            texteConfirmer: 'Supprimer le village'
        });
        if (!ok) return;

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

    voirQuartiersVillage(villageId) {
        // Si on clique à nouveau sur le même village => on masque les quartiers (toggle OFF)
        if (this.etat.villageSelectionne && this.etat.villageSelectionne.id === villageId) {
            this.etat.villageSelectionne = null;
            this.etat.quartiers = [];

            // Retirer le surlignage sur toutes les lignes de villages
            const lignes = document.querySelectorAll('#liste-villages table tbody tr');
            lignes.forEach(tr => tr.classList.remove('ligne-village-selectionnee'));

            const listeQuartiers = document.getElementById('liste-quartiers');
            if (listeQuartiers) {
                listeQuartiers.innerHTML = '<p class="message-vide">Sélectionnez un village pour voir ses quartiers</p>';
            }

            return;
        }

        // Sinon, on sélectionne ce village (toggle ON)
        const village = this.etat.villages.find(v => v.id === villageId);
        if (!village) return;

        this.etat.villageSelectionne = village;
        this.etat.quartiers = [];

        // Surligner la ligne du village sélectionné
        const lignes = document.querySelectorAll('#liste-villages table tbody tr');
        lignes.forEach(tr => tr.classList.remove('ligne-village-selectionnee'));
        const ligneSelectionnee = document.querySelector(`#liste-villages table tbody tr[data-village-id="${villageId}"]`);
        if (ligneSelectionnee) {
            ligneSelectionnee.classList.add('ligne-village-selectionnee');
        }

        const listeQuartiers = document.getElementById('liste-quartiers');
        if (listeQuartiers) {
            listeQuartiers.innerHTML = '<p class="message-vide">Chargement des quartiers...</p>';
        }

        // Charger et afficher les quartiers de ce village
        this.chargerQuartiers(villageId);
    }
    afficherFormulaireQuartier(villageId = null) {
        this.etat.modeEditionQuartier = false;
        this.etat.quartierSelectionne = null;

        if (villageId) {
            const village = this.etat.villages.find(v => v.id === villageId);
            if (village) {
                this.etat.villageSelectionne = village;
            }
        }

        // Fermer les formulaires canton et village avant d'ouvrir celui du quartier
        this.masquerFormulaire();
        this.masquerFormulaireVillage();

        const selectVillage = document.getElementById('village-quartier');
        if (selectVillage) {
            this.chargerVillagesFormulaireQuartier();
            if (villageId) {
                selectVillage.value = villageId;
            }
        }

        document.getElementById('titre-formulaire-quartier').textContent = 'Nouveau Quartier';
        document.getElementById('form-quartier').reset();
        if (selectVillage && villageId) {
            selectVillage.value = villageId;
        }
        document.getElementById('formulaire-quartier').classList.remove('masque');
        document.body.classList.add('modal-open');
    }

    masquerFormulaireQuartier() {
        document.getElementById('formulaire-quartier').classList.add('masque');
        document.getElementById('form-quartier').reset();
        this.viderErreursQuartier();
        document.body.classList.remove('modal-open');
    }

    async sauvegarderQuartier() {
        // Empêche une deuxième soumission pendant que la première est en cours
        if (this.sauvegardeQuartierEnCours) {
            return;
        }

        const form = document.getElementById('form-quartier');
        if (!form) return;

        const formData = new FormData(form);
        const quartier = {
            village_id: parseInt(formData.get('village_id')),
            nom: formData.get('nom').trim(),
            description: formData.get('description').trim()
        };

        // Validation
        if (!this.validerQuartier(quartier)) return;

        // On bloque les soumissions suivantes
        this.sauvegardeQuartierEnCours = true;
        const boutonSauvegarder = document.getElementById('btn-sauvegarder-quartier');
        if (boutonSauvegarder) {
            boutonSauvegarder.disabled = true;
        }

        try {
            if (this.etat.modeEditionQuartier && this.etat.quartierSelectionne) {
                const quartierMisAJour = {
                    ...this.etat.quartierSelectionne,
                    ...quartier
                };
                await window.StockageDonnees.mettreAJour('quartiers', quartierMisAJour);
            } else {
                await window.StockageDonnees.ajouter('quartiers', quartier);
            }

            this.masquerFormulaireQuartier();

            if (this.etat.villageSelectionne) {
                await this.chargerQuartiers(this.etat.villageSelectionne.id);
            }

            this.afficherSucces(
                this.etat.modeEditionQuartier
                    ? 'Quartier modifié avec succès'
                    : 'Quartier créé avec succès'
            );
        } catch (erreur) {
            console.error('Erreur lors de la sauvegarde du quartier:', erreur);
            this.afficherErreur('Erreur lors de la sauvegarde du quartier');
        } finally {
            this.sauvegardeQuartierEnCours = false;
            if (boutonSauvegarder) {
                boutonSauvegarder.disabled = false;
            }
        }
    }

    modifierQuartier(quartierId) {
        const quartier = this.etat.quartiers.find(q => q.id === quartierId);
        if (!quartier) return;

        const village = this.etat.villages.find(v => v.id === quartier.village_id);
        if (village) {
            this.etat.villageSelectionne = village;
        }

        this.etat.modeEditionQuartier = true;
        this.etat.quartierSelectionne = quartier;

        // Fermer les formulaires canton et village avant d'ouvrir celui du quartier
        this.masquerFormulaire();
        this.masquerFormulaireVillage();

        const selectVillage = document.getElementById('village-quartier');
        if (selectVillage) {
            this.chargerVillagesFormulaireQuartier();
            selectVillage.value = quartier.village_id;
        }

        document.getElementById('titre-formulaire-quartier').textContent = 'Modifier Quartier';
        document.getElementById('nom-quartier').value = quartier.nom;
        document.getElementById('description-quartier').value = quartier.description || '';
        document.getElementById('formulaire-quartier').classList.remove('masque');
        document.body.classList.add('modal-open');
    }

    async supprimerQuartier(quartierId) {

        const quartier = this.etat.quartiers.find(q => q.id === quartierId);
        const ok = await this.demanderConfirmation({
            titre: 'Supprimer ce quartier',
            message: `Êtes-vous sûr de vouloir supprimer le quartier ${quartier ? quartier.nom : ''} ?`,
            texteConfirmer: 'Supprimer le quartier'
        });
        if (!ok) return;

        try {
            await window.StockageDonnees.supprimer('quartiers', quartierId);

            if (this.etat.villageSelectionne) {
                await this.chargerQuartiers(this.etat.villageSelectionne.id);
            }

            this.afficherSucces('Quartier supprimé avec succès');
        } catch (erreur) {
            console.error('Erreur lors de la suppression du quartier:', erreur);
            this.afficherErreur('Erreur lors de la suppression du quartier');
        }
    }

    validerQuartier(quartier) {
        this.viderErreursQuartier();
        let valide = true;

        if (!quartier.village_id) {
            this.afficherErreurChamp('erreur-village-quartier', 'Le village est obligatoire');
            valide = false;
        }

        if (!quartier.nom) {
            this.afficherErreurChamp('erreur-nom-quartier', 'Le nom est obligatoire');
            valide = false;
        } else if (quartier.nom.length < 2) {
            this.afficherErreurChamp('erreur-nom-quartier', 'Le nom doit contenir au moins 2 caractères');
            valide = false;
        }

        return valide;
    }

    viderErreursQuartier() {
        const errVillage = document.getElementById('erreur-village-quartier');
        const errNom = document.getElementById('erreur-nom-quartier');
        if (errVillage) errVillage.textContent = '';
        if (errNom) errNom.textContent = '';
    }
}

// Rendre disponible globalement
if (typeof window !== 'undefined') {
    window.ComposantGestionCantons = ComposantGestionCantons;
}

