/**
 * Composant Liste des Cotisants
 * Gestion complète des cotisants : affichage, création, modification, suppression
 * Filtres par canton/village/quartier, recherche, tri
 */

class ComposantListeCotisants extends BaseComposant {
    constructor(options = {}) {
        super(options);
        this.etat = {
            cotisants: [],
            cantons: [],
            villages: [],
            quartiers: [],
            filtreCantonId: '',
            filtreVillageId: '',
            filtreQuartierId: '',
            filtreRecherche: '',
            triColonne: 'nom',
            triDirection: 'asc',
            cotisantSelectionneId: null,
            modeEditionCotisant: false,
            cotisantEnEdition: null
        };
        this.sauvegardeCotisantEnCours = false;
    }

    async rendre() {
        return `
            <div class="conteneur-cotisants">
                <div class="en-tete-page">
                    <h1>
                        <svg class="icone-titre" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                            <circle cx="9" cy="7" r="4"></circle>
                            <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                        </svg>
                        Gestion des Cotisants
                    </h1>
                    <button id="btn-nouveau-cotisant" class="bouton bouton-primaire">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="12" cy="12" r="10"></circle>
                            <line x1="12" y1="8" x2="12" y2="16"></line>
                            <line x1="8" y1="12" x2="16" y2="12"></line>
                        </svg>
                        Nouveau Cotisant
                    </button>
                </div>

                <!-- Filtres canton / village / quartier -->
                <div class="barre-filtres barre-filtres-cotisants">
                    <div class="filtre-groupe">
                        <label>Canton</label>
                        <select id="filtre-canton" class="select-moderne">
                            <option value="">Tous les cantons</option>
                        </select>
                    </div>
                    <div class="filtre-groupe">
                        <label>Village</label>
                        <select id="filtre-village" class="select-moderne">
                            <option value="">Tous les villages</option>
                        </select>
                    </div>
                    <div class="filtre-groupe">
                        <label>Quartier</label>
                        <select id="filtre-quartier" class="select-moderne">
                            <option value="">Tous les quartiers</option>
                        </select>
                    </div>
                    <div class="filtre-groupe">
                        <label>Recherche</label>
                        <input type="search" id="filtre-recherche" class="champ-saisie" placeholder="Rechercher...">
                    </div>
                    <div class="filtre-groupe">
                        <button type="button" id="btn-reinitialiser-filtres-cotisants" class="bouton bouton-secondaire">
                            Réinitialiser les filtres
                        </button>
                    </div>
                </div>

                <!-- Liste des cotisants -->
                <div class="carte">
                    <div class="carte-body">
                        <div id="liste-cotisants" class="tableau-conteneur">
                            <div class="spinner"></div>
                            <p>Chargement des cotisants...</p>
                        </div>
                    </div>
                </div>

                <!-- Formulaire Cotisant -->
                <div id="formulaire-cotisant" class="overlay-modal masque">
                    <div class="modal formulaire-carte">
                        <div class="carte-header">
                            <h3 id="titre-formulaire-cotisant">Nouveau Cotisant</h3>
                            <button id="btn-fermer-formulaire-cotisant" class="bouton-fermer-modal">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <line x1="18" y1="6" x2="6" y2="18"></line>
                                    <line x1="6" y1="6" x2="18" y2="18"></line>
                                </svg>
                            </button>
                        </div>
                        <div class="carte-body">
                            <form id="form-cotisant">
                                <!-- Relationnel : Canton / Village / Quartier -->
                                <div class="groupe-champ triple-champ">
                                    <div>
                                        <label class="etiquette-champ" for="canton-cotisant">Canton *</label>
                                        <select id="canton-cotisant" name="canton_id" class="champ-saisie" required>
                                            <option value="">Sélectionner un canton...</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label class="etiquette-champ" for="village-cotisant">Village *</label>
                                        <select id="village-cotisant" name="village_id" class="champ-saisie" required>
                                            <option value="">Sélectionner un village...</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label class="etiquette-champ" for="quartier-cotisant">Quartier *</label>
                                        <select id="quartier-cotisant" name="quartier_id" class="champ-saisie" required>
                                            <option value="">Sélectionner un quartier...</option>
                                        </select>
                                    </div>
                                </div>

                                <!-- Identité -->
                                <div class="groupe-champ double-champ">
                                    <div>
                                        <label class="etiquette-champ" for="nom-cotisant">Nom *</label>
                                        <input type="text" id="nom-cotisant" name="nom" class="champ-saisie" required autofocus>
                                    </div>
                                    <div>
                                        <label class="etiquette-champ" for="prenom-cotisant">Prénom *</label>
                                        <input type="text" id="prenom-cotisant" name="prenom" class="champ-saisie" required>
                                    </div>
                                </div>

                                <div class="groupe-champ double-champ">
                                    <div>
                                        <label class="etiquette-champ" for="sexe-cotisant">Sexe *</label>
                                        <select id="sexe-cotisant" name="sexe" class="champ-saisie" required>
                                            <option value="">Sélectionner...</option>
                                            <option value="F">Femme</option>
                                            <option value="M">Homme</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label class="etiquette-champ" for="fonction-cotisant">Fonction *</label>
                                        <select id="fonction-cotisant" name="fonction" class="champ-saisie" required>
                                            <option value="">Sélectionner...</option>
                                            <option value="cultivateur">Cultivateur / Agricultrice</option>
                                            <option value="enseignant">Enseignant(e)</option>
                                            <option value="employe">Employé(e)</option>
                                            <option value="directeur">Directeur / Cadre</option>
                                            <option value="commercant">Commerçant(e)</option>
                                            <option value="autre">Autre</option>
                                        </select>
                                    </div>
                                </div>

                                <div class="groupe-champ">
                                    <label class="etiquette-champ" for="autre-fonction-cotisant">Autre fonction (si nécessaire)</label>
                                    <input type="text" id="autre-fonction-cotisant" name="autre_fonction" class="champ-saisie" placeholder="Préciser la fonction">
                                </div>

                                <div class="groupe-champ double-champ">
                                    <div>
                                        <label class="etiquette-champ" for="telephone-cotisant">Téléphone</label>
                                        <input type="tel" id="telephone-cotisant" name="telephone" class="champ-saisie" placeholder="Ex : 90 00 00 00">
                                    </div>
                                    <div>
                                        <label class="etiquette-champ" for="montant-cotisation">Montant de la cotisation (CFA) *</label>
                                        <input type="number" min="0" id="montant-cotisation" name="montant_cotisation" class="champ-saisie" required>
                                    </div>
                                </div>

                                <div class="groupe-champ">
                                    <label class="etiquette-champ" for="date-cotisation">Date de cotisation</label>
                                    <input type="date" id="date-cotisation" name="date_cotisation" class="champ-saisie">
                                </div>

                                <div class="actions-formulaire">
                                    <button type="button" id="btn-annuler-cotisant" class="bouton bouton-ghost">Annuler</button>
                                    <button type="submit" id="btn-sauvegarder-cotisant" class="bouton bouton-primaire">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                            <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h14a2 2 0 012 2v11l-5 5-1.41-1.41L5 17.25V21z"></path>
                                        </svg>
                                        Enregistrer
                                    </button>
                                </div>
                            </form>
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
        await this.chargerStructureTerritoriale();
        await this.chargerCotisants();
        this.configurerEvenements();
    }

    async chargerStructureTerritoriale() {
        const [cantons, villages, quartiers] = await Promise.all([
            window.StockageDonnees.obtenirTous('cantons'),
            window.StockageDonnees.obtenirTous('villages'),
            window.StockageDonnees.obtenirTous('quartiers')
        ]);

        this.etat.cantons = cantons;
        this.etat.villages = villages;
        this.etat.quartiers = quartiers;

        this.peuplerSelectsFiltres();
        this.peuplerSelectsFormulaire();
    }

    async chargerCotisants() {
        const cotisants = await window.StockageDonnees.obtenirTous('cotisants');
        this.etat.cotisants = cotisants;
        this.afficherCotisants();
    }

    peuplerSelectsFiltres() {
        const { cantons, villages, quartiers } = this.etat;
        const selectCanton = document.getElementById('filtre-canton');
        const selectVillage = document.getElementById('filtre-village');
        const selectQuartier = document.getElementById('filtre-quartier');

        if (selectCanton) {
            selectCanton.innerHTML = '<option value="">Tous les cantons</option>';
            cantons.forEach(c => {
                const opt = document.createElement('option');
                opt.value = c.id;
                opt.textContent = c.nom;
                selectCanton.appendChild(opt);
            });
        }

        if (selectVillage) {
            selectVillage.innerHTML = '<option value="">Tous les villages</option>';
            villages.forEach(v => {
                const opt = document.createElement('option');
                opt.value = v.id;
                opt.textContent = v.nom;
                selectVillage.appendChild(opt);
            });
        }

        if (selectQuartier) {
            selectQuartier.innerHTML = '<option value="">Tous les quartiers</option>';
            quartiers.forEach(q => {
                const opt = document.createElement('option');
                opt.value = q.id;
                opt.textContent = q.nom;
                selectQuartier.appendChild(opt);
            });
        }
    }

    peuplerSelectsFormulaire() {
        const { cantons, villages, quartiers } = this.etat;
        const selectCanton = document.getElementById('canton-cotisant');
        const selectVillage = document.getElementById('village-cotisant');
        const selectQuartier = document.getElementById('quartier-cotisant');

        if (selectCanton) {
            selectCanton.innerHTML = '<option value="">Sélectionner un canton...</option>';
            cantons.forEach(c => {
                const opt = document.createElement('option');
                opt.value = c.id;
                opt.textContent = c.nom;
                selectCanton.appendChild(opt);
            });
        }

        if (selectVillage) {
            selectVillage.innerHTML = '<option value="">Sélectionner un village...</option>';
            villages.forEach(v => {
                const opt = document.createElement('option');
                opt.value = v.id;
                opt.textContent = v.nom;
                opt.dataset.cantonId = v.canton_id;
                selectVillage.appendChild(opt);
            });
        }

        if (selectQuartier) {
            selectQuartier.innerHTML = '<option value="">Sélectionner un quartier...</option>';
            quartiers.forEach(q => {
                const opt = document.createElement('option');
                opt.value = q.id;
                opt.textContent = q.nom;
                opt.dataset.villageId = q.village_id;
                opt.dataset.cantonId = q.canton_id;
                selectQuartier.appendChild(opt);
            });
        }
    }

    configurerEvenements() {
        const btnNouveau = document.getElementById('btn-nouveau-cotisant');
        const btnFermer = document.getElementById('btn-fermer-formulaire-cotisant');
        const btnAnnuler = document.getElementById('btn-annuler-cotisant');
        const form = document.getElementById('form-cotisant');

        btnNouveau?.addEventListener('click', () => this.afficherFormulaireCotisant());
        btnFermer?.addEventListener('click', () => this.masquerFormulaireCotisant());
        btnAnnuler?.addEventListener('click', () => this.masquerFormulaireCotisant());

        form?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.sauvegarderCotisant();
        });

        // Filtres liste
        const filtreCanton = document.getElementById('filtre-canton');
        const filtreVillage = document.getElementById('filtre-village');
        const filtreQuartier = document.getElementById('filtre-quartier');
        const filtreRecherche = document.getElementById('filtre-recherche');
        const btnReinitialiserFiltres = document.getElementById('btn-reinitialiser-filtres-cotisants');

        filtreCanton?.addEventListener('change', (e) => {
            this.etat.filtreCantonId = e.target.value;
            this.afficherCotisants();
        });

        filtreVillage?.addEventListener('change', (e) => {
            this.etat.filtreVillageId = e.target.value;
            this.afficherCotisants();
        });

        filtreQuartier?.addEventListener('change', (e) => {
            this.etat.filtreQuartierId = e.target.value;
            this.afficherCotisants();
        });

        filtreRecherche?.addEventListener('input', (e) => {
            this.etat.filtreRecherche = e.target.value.trim();
            this.afficherCotisants();
        });

        btnReinitialiserFiltres?.addEventListener('click', () => {
            this.etat.filtreCantonId = '';
            this.etat.filtreVillageId = '';
            this.etat.filtreQuartierId = '';
            this.etat.filtreRecherche = '';

            if (filtreCanton) filtreCanton.value = '';
            if (filtreVillage) filtreVillage.value = '';
            if (filtreQuartier) filtreQuartier.value = '';
            if (filtreRecherche) filtreRecherche.value = '';

            this.afficherCotisants();
        });

        // Dépendances Canton → Village → Quartier (formulaire)
        const cantonSelect = document.getElementById('canton-cotisant');
        const villageSelect = document.getElementById('village-cotisant');
        const quartierSelect = document.getElementById('quartier-cotisant');

        cantonSelect?.addEventListener('change', (e) => {
            const cantonId = e.target.value;
            this.filtrerVillagesPourCanton(cantonId);
            this.filtrerQuartiersPourVillage('');
        });

        villageSelect?.addEventListener('change', (e) => {
            const villageId = e.target.value;
            this.filtrerQuartiersPourVillage(villageId);
            const village = this.etat.villages.find(v => String(v.id) === String(villageId));
            if (village && cantonSelect) {
                cantonSelect.value = village.canton_id;
            }
        });

        quartierSelect?.addEventListener('change', (e) => {
            const option = e.target.selectedOptions[0];
            if (!option) return;
            const villageId = option.dataset.villageId;
            const cantonId = option.dataset.cantonId;

            if (villageId && villageSelect) {
                const villageOptionExiste = Array.from(villageSelect.options).some(opt => opt.value === String(villageId));
                if (villageOptionExiste) {
                    villageSelect.value = String(villageId);
                }
            }

            if (cantonId && cantonSelect) {
                const cantonOptionExiste = Array.from(cantonSelect.options).some(opt => opt.value === String(cantonId));
                if (cantonOptionExiste) {
                    cantonSelect.value = String(cantonId);
                }
            }
        });

        // Event delegation pour supprimer un cotisant
        this.deleguerEvenement('#liste-cotisants', '[data-action="supprimer-cotisant"]', 'click', (e, cible) => {
            const id = parseInt(cible.dataset.id, 10);
            if (!isNaN(id)) {
                this.supprimerCotisant(id);
            }
        });

        // Event delegation pour éditer un cotisant
        this.deleguerEvenement('#liste-cotisants', '[data-action="editer-cotisant"]', 'click', (e, cible) => {
            const id = parseInt(cible.dataset.id, 10);
            if (!isNaN(id)) {
                this.ouvrirEditionCotisant(id);
            }
        });

        // Tri des colonnes
        this.deleguerEvenement('#liste-cotisants', 'th[data-tri-colonne]', 'click', (e, cible) => {
            const colonne = cible.dataset.triColonne;
            if (!colonne) return;

            let { triColonne, triDirection } = this.etat;

            if (triColonne === colonne) {
                triDirection = triDirection === 'asc' ? 'desc' : 'asc';
            } else {
                triColonne = colonne;
                triDirection = 'asc';
            }

            this.etat.triColonne = triColonne;
            this.etat.triDirection = triDirection;
            this.afficherCotisants();
        });

        // Sélection visuelle d'une ligne
        this.deleguerEvenement('#liste-cotisants', 'tbody tr', 'click', (e, cible) => {
            const idAttr = cible.dataset.id;
            const id = idAttr ? parseInt(idAttr, 10) : NaN;
            if (isNaN(id)) return;

            if (this.etat.cotisantSelectionneId === id) {
                this.etat.cotisantSelectionneId = null;
            } else {
                this.etat.cotisantSelectionneId = id;
            }

            this.afficherCotisants();
        });
    }

    filtrerVillagesPourCanton(cantonId) {
        const villageSelect = document.getElementById('village-cotisant');
        if (!villageSelect) return;
        villageSelect.innerHTML = '<option value="">Sélectionner un village...</option>';

        this.etat.villages
            .filter(v => !cantonId || String(v.canton_id) === String(cantonId))
            .forEach(v => {
                const opt = document.createElement('option');
                opt.value = v.id;
                opt.textContent = v.nom;
                opt.dataset.cantonId = v.canton_id;
                villageSelect.appendChild(opt);
            });
    }

    filtrerQuartiersPourVillage(villageId) {
        const quartierSelect = document.getElementById('quartier-cotisant');
        if (!quartierSelect || !villageId) {
            if (quartierSelect) {
                quartierSelect.innerHTML = '<option value="">Sélectionner un quartier...</option>';
            }
            return;
        }

        const quartiers = this.etat.quartiers.filter(q => String(q.village_id) === String(villageId));

        quartierSelect.innerHTML = '<option value="">Sélectionner un quartier...</option>';
        quartiers.forEach(q => {
            const opt = document.createElement('option');
            opt.value = q.id;
            opt.textContent = q.nom;
            opt.dataset.villageId = villageId;
            opt.dataset.cantonId = q.canton_id;
            quartierSelect.appendChild(opt);
        });
    }

    ouvrirEditionCotisant(id) {
        const cotisant = this.etat.cotisants.find(c => c.id === id);
        if (!cotisant) return;

        this.etat.modeEditionCotisant = true;
        this.etat.cotisantEnEdition = cotisant;

        const overlay = document.getElementById('formulaire-cotisant');
        const form = document.getElementById('form-cotisant');
        const titre = document.getElementById('titre-formulaire-cotisant');
        if (!overlay || !form) return;

        form.reset();
        this.remplirFormulaireCotisant(cotisant);
        if (titre) {
            titre.textContent = 'Modifier Cotisant';
        }

        overlay.classList.remove('masque');
        document.body.classList.add('modal-open');

        const champNom = document.getElementById('nom-cotisant');
        if (champNom) {
            setTimeout(() => champNom.focus(), 0);
        }
    }

    remplirFormulaireCotisant(cotisant) {
        const form = document.getElementById('form-cotisant');
        if (!form || !cotisant) return;

        const cantonSelect = document.getElementById('canton-cotisant');
        const villageSelect = document.getElementById('village-cotisant');
        const quartierSelect = document.getElementById('quartier-cotisant');

        if (cantonSelect && cotisant.canton_id != null) {
            cantonSelect.value = cotisant.canton_id;
            this.filtrerVillagesPourCanton(cotisant.canton_id);
        }

        if (villageSelect && cotisant.village_id != null) {
            villageSelect.value = cotisant.village_id;
            this.filtrerQuartiersPourVillage(cotisant.village_id);
        }

        if (quartierSelect && cotisant.quartier_id != null) {
            quartierSelect.value = cotisant.quartier_id;
        }

        form.nom.value = cotisant.nom || '';
        form.prenom.value = cotisant.prenom || '';
        form.sexe.value = cotisant.sexe || '';
        form.telephone.value = cotisant.telephone || '';
        form.fonction.value = cotisant.fonction || '';
        if (form.autre_fonction) {
            form.autre_fonction.value = cotisant.autre_fonction || '';
        }
        form.montant_cotisation.value = cotisant.montant_cotisation != null ? cotisant.montant_cotisation : '';
        form.date_cotisation.value = cotisant.date_cotisation || '';
    }

    afficherFormulaireCotisant() {
        const overlay = document.getElementById('formulaire-cotisant');
        const form = document.getElementById('form-cotisant');
        const titre = document.getElementById('titre-formulaire-cotisant');
        if (overlay && form) {
            this.etat.modeEditionCotisant = false;
            this.etat.cotisantEnEdition = null;
            form.reset();
            if (titre) {
                titre.textContent = 'Nouveau Cotisant';
            }
            overlay.classList.remove('masque');
            document.body.classList.add('modal-open');

            const champNom = document.getElementById('nom-cotisant');
            if (champNom) {
                setTimeout(() => champNom.focus(), 0);
            }
        }
    }

    masquerFormulaireCotisant() {
        const overlay = document.getElementById('formulaire-cotisant');
        if (overlay) {
            overlay.classList.add('masque');
            document.body.classList.remove('modal-open');
        }
        this.etat.modeEditionCotisant = false;
        this.etat.cotisantEnEdition = null;
    }

    async sauvegarderCotisant() {
        if (this.sauvegardeCotisantEnCours) {
            return;
        }

        const form = document.getElementById('form-cotisant');
        if (!form) {
            return;
        }

        const cantonId = form.canton_id ? form.canton_id.value : '';
        const villageId = form.village_id ? form.village_id.value : '';
        const quartierId = form.quartier_id ? form.quartier_id.value : '';
        const nom = form.nom ? form.nom.value.trim() : '';
        const prenom = form.prenom ? form.prenom.value.trim() : '';
        const sexe = form.sexe ? form.sexe.value : '';
        const fonction = form.fonction ? form.fonction.value : '';
        const autreFonction = form.autre_fonction ? form.autre_fonction.value.trim() : '';
        const telephone = form.telephone ? form.telephone.value.trim() : '';
        const montantBrut = form.montant_cotisation ? form.montant_cotisation.value : '';
        const dateCotisation = form.date_cotisation ? form.date_cotisation.value : '';

        if (!cantonId || !villageId || !quartierId || !nom || !prenom || !sexe || !fonction || !montantBrut) {
            console.error('Champs obligatoires manquants lors de la sauvegarde du cotisant');
            return;
        }

        const montantCotisation = Number(montantBrut);

        const statutActif = (typeof window !== 'undefined'
            && window.STATUTS_COTISANT
            && window.STATUTS_COTISANT.ACTIF)
            ? window.STATUTS_COTISANT.ACTIF
            : 'actif';

        const donneesCotisant = {
            canton_id: parseInt(cantonId, 10),
            village_id: parseInt(villageId, 10),
            quartier_id: parseInt(quartierId, 10),
            nom,
            prenom,
            sexe,
            fonction,
            autre_fonction: autreFonction || null,
            telephone: telephone || null,
            montant_cotisation: isNaN(montantCotisation) ? 0 : montantCotisation,
            date_cotisation: dateCotisation || null,
            statut: statutActif
        };

        this.sauvegardeCotisantEnCours = true;

        try {
            if (this.etat.modeEditionCotisant && this.etat.cotisantEnEdition) {
                const cotisantMisAJour = {
                    ...this.etat.cotisantEnEdition,
                    ...donneesCotisant
                };
                await window.StockageDonnees.mettreAJour('cotisants', cotisantMisAJour);
            } else {
                await window.StockageDonnees.ajouter('cotisants', donneesCotisant);
            }

            this.masquerFormulaireCotisant();
            await this.chargerCotisants();
        } catch (erreur) {
            console.error('Erreur lors de la sauvegarde du cotisant:', erreur);
        } finally {
            this.sauvegardeCotisantEnCours = false;
        }
    }

    afficherCotisants() {
        const conteneur = document.getElementById('liste-cotisants');
        if (!conteneur) return;

        if (!this.etat.cotisants || this.etat.cotisants.length === 0) {
            conteneur.innerHTML = '<p class="message-vide">Aucun cotisant enregistré pour le moment.</p>';
            return;
        }

        const {
            filtreCantonId,
            filtreVillageId,
            filtreQuartierId,
            filtreRecherche,
            triColonne,
            triDirection,
            cotisantSelectionneId
        } = this.etat;

        const cotisantsFiltres = this.etat.cotisants.filter(c => {
            if (filtreQuartierId && String(c.quartier_id) !== String(filtreQuartierId)) return false;
            if (filtreVillageId && String(c.village_id) !== String(filtreVillageId)) return false;
            if (filtreCantonId && String(c.canton_id) !== String(filtreCantonId)) return false;

            if (filtreRecherche && filtreRecherche.trim() !== '') {
                const terme = filtreRecherche.trim().toLowerCase();
                const texteCible = `${c.nom || ''} ${c.prenom || ''} ${c.telephone || ''}`.toLowerCase();
                if (!texteCible.includes(terme)) return false;
            }
            return true;
        });

        if (cotisantsFiltres.length === 0) {
            conteneur.innerHTML = '<p class="message-vide">Aucun cotisant ne correspond aux filtres sélectionnés.</p>';
            return;
        }

        const colonneTri = triColonne || 'nom';
        const directionTri = triDirection || 'asc';
        const facteur = directionTri === 'desc' ? -1 : 1;

        const comparer = (a, b) => {
            let valeurA;
            let valeurB;

            switch (colonneTri) {
                case 'nom': {
                    valeurA = `${a.nom || ''} ${a.prenom || ''}`.toLowerCase();
                    valeurB = `${b.nom || ''} ${b.prenom || ''}`.toLowerCase();
                    break;
                }
                case 'montant': {
                    valeurA = Number(a.montant_cotisation || 0);
                    valeurB = Number(b.montant_cotisation || 0);
                    break;
                }
                case 'date': {
                    valeurA = a.date_cotisation || '';
                    valeurB = b.date_cotisation || '';
                    break;
                }
                default:
                    return 0;
            }

            if (valeurA < valeurB) return -1 * facteur;
            if (valeurA > valeurB) return 1 * facteur;
            return 0;
        };

        const cotisantsTries = [...cotisantsFiltres].sort(comparer);

        const total = cotisantsTries.length;
        const totalMontant = cotisantsTries.reduce((somme, c) => somme + (c.montant_cotisation || 0), 0);
        const libelleTotal = total > 1 ? `${total} cotisants trouvés` : `${total} cotisant trouvé`;

        const classeTriNom = 'triable' + (colonneTri === 'nom' ? ` tri-${directionTri}` : '');
        const classeTriMontant = 'triable' + (colonneTri === 'montant' ? ` tri-${directionTri}` : '');
        const classeTriDate = 'triable' + (colonneTri === 'date' ? ` tri-${directionTri}` : '');

        let html = `
            <div class="resume-cotisants">
                <span class="resume-cotisants-compteur">${libelleTotal}</span>
            </div>
            <table class="tableau tableau-cotisants">
                <thead>
                    <tr>
                        <th data-tri-colonne="nom" class="${classeTriNom}">Nom & Prénom</th>
                        <th>Sexe</th>
                        <th>Quartier</th>
                        <th>Fonction</th>
                        <th data-tri-colonne="montant" class="${classeTriMontant}">Montant (CFA)</th>
                        <th data-tri-colonne="date" class="${classeTriDate}">Date</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
        `;

        const idSelectionne = cotisantSelectionneId;

        cotisantsTries.forEach(c => {
            const quartier = this.etat.quartiers.find(q => q.id === c.quartier_id);
            const village = this.etat.villages.find(v => v.id === c.village_id);
            const canton = this.etat.cantons.find(ct => ct.id === c.canton_id);

            const libelleTerritoire = [
                quartier ? quartier.nom : null,
                village ? village.nom : null,
                canton ? canton.nom : null
            ].filter(Boolean).join(' · ');

            const estSelectionne = idSelectionne != null && c.id === idSelectionne;
            const classesLigne = estSelectionne ? 'ligne-cotisant-selectionnee' : '';

            html += `
                <tr data-id="${c.id}" class="${classesLigne}">
                    <td><strong>${c.nom}</strong><br><span class="texte-secondaire">${c.prenom || ''}</span></td>
                    <td>${c.sexe === 'F' ? 'Femme' : c.sexe === 'M' ? 'Homme' : '-'}</td>
                    <td>${libelleTerritoire || '-'}</td>
                    <td>${c.fonction || (c.autre_fonction || '-')}</td>
                    <td>${c.montant_cotisation ? formaterMontant(c.montant_cotisation, false) : 0}</td>
                    <td>${c.date_cotisation || '-'}</td>
                    <td>
                        <div class="actions-tableau">
                            <button class="bouton-action-tableau" data-action="editer-cotisant" data-id="${c.id}" title="Modifier ce cotisant">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M12 20h9"></path>
                                    <path d="M5 20l1.5-5.5L18 3l3 3-11.5 11.5L5 20z"></path>
                                </svg>
                            </button>
                            <button class="bouton-action-tableau" data-action="supprimer-cotisant" data-id="${c.id}" title="Supprimer ce cotisant">
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

        html += `
                </tbody>
                <tfoot>
                    <tr class="ligne-totaux-cotisants">
                        <td colspan="4" class="texte-secondaire">Total des montants visibles</td>
                        <td>${formaterMontant(totalMontant, false)}</td>
                        <td colspan="2"></td>
                    </tr>
                </tfoot>
            </table>
        `;
        conteneur.innerHTML = html;
    }

    rechercherGlobalement(terme) {
        this.etat.filtreRecherche = (terme || '').trim();
        this.afficherCotisants();
    }

    async supprimerCotisant(id) {
        const cotisant = this.etat.cotisants.find(c => c.id === id);
        const nomComplet = cotisant
            ? `${cotisant.prenom ? cotisant.prenom + ' ' : ''}${cotisant.nom}`.trim()
            : '';

        const ok = await this.demanderConfirmation({
            titre: 'Supprimer ce cotisant',
            message: `Êtes-vous sûr de vouloir supprimer le cotisant ${nomComplet || ''} ? Cette action est définitive.`,
            texteConfirmer: 'Supprimer le cotisant'
        });
        if (!ok) return;

        try {
            await window.StockageDonnees.supprimer('cotisants', id);
            await this.chargerCotisants();
        } catch (erreur) {
            console.error('Erreur lors de la suppression du cotisant:', erreur);
            alert('Erreur lors de la suppression du cotisant.');
        }
    }
}

// Export global
if (typeof window !== 'undefined') {
    window.ComposantListeCotisants = ComposantListeCotisants;
}

