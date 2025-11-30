/**
 * Composant Gestion des Paiements
 * Gestion complète des paiements : affichage, création, modification, suppression
 * Filtres par période, statut, mode, territoire, recherche
 */

class ComposantGestionPaiements extends BaseComposant {
    constructor(options = {}) {
        super(options);
        this.etat = {
            paiements: [],
            cotisants: [],
            cantons: [],
            villages: [],
            filtrePeriode: 'tout',
            filtreStatut: '',
            filtreMode: '',
            filtreCantonId: '',
            filtreVillageId: '',
            filtreRechercheCotisant: '',
            triColonne: 'date',
            triDirection: 'desc',
            modeEditionPaiement: false,
            paiementEnEdition: null
        };
        this.sauvegardePaiementEnCours = false;
    }

    async rendre() {
        return `
            <div class="conteneur-paiements">
                <div class="en-tete-page">
                    <h1>
                        <svg class="icone-titre" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
                            <line x1="1" y1="10" x2="23" y2="10"></line>
                        </svg>
                        Gestion des Paiements
                    </h1>
                    <button id="btn-nouveau-paiement" class="bouton bouton-primaire">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="12" cy="12" r="10"></circle>
                            <line x1="12" y1="8" x2="12" y2="16"></line>
                            <line x1="8" y1="12" x2="16" y2="12"></line>
                        </svg>
                        Nouveau Paiement
                    </button>
                </div>

                <div class="grille-kpi">
                    <div class="carte carte-kpi carte-kpi-succes">
                        <div class="carte-body">
                            <div class="kpi-icone">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
                                    <line x1="1" y1="10" x2="23" y2="10"></line>
                                </svg>
                            </div>
                            <div class="kpi-valeur" id="kpi-total-encaisse">-</div>
                            <div class="kpi-libelle">Total encaissé (CFA)</div>
                        </div>
                    </div>
                    <div class="carte carte-kpi">
                        <div class="carte-body">
                            <div class="kpi-icone">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                                    <circle cx="9" cy="7" r="4"></circle>
                                </svg>
                            </div>
                            <div class="kpi-valeur" id="kpi-paiements-confirmes">-</div>
                            <div class="kpi-libelle">Paiements confirmés</div>
                        </div>
                    </div>
                    <div class="carte carte-kpi carte-kpi-accent">
                        <div class="carte-body">
                            <div class="kpi-icone">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <circle cx="12" cy="12" r="10"></circle>
                                    <path d="M12 8v4"></path>
                                    <circle cx="12" cy="16" r="1"></circle>
                                </svg>
                            </div>
                            <div class="kpi-valeur" id="kpi-paiements-en-attente">-</div>
                            <div class="kpi-libelle">Paiements en attente</div>
                        </div>
                    </div>
                </div>

                <div class="barre-filtres barre-filtres-paiements">
                    <div class="filtre-groupe">
                        <label>Période</label>
                        <select id="filtre-periode-paiement" class="select-moderne">
                            <option value="tout">Toutes les périodes</option>
                            <option value="mois_courant">Mois en cours</option>
                            <option value="annee_courante">Année en cours</option>
                        </select>
                    </div>
                    <div class="filtre-groupe">
                        <label>Statut</label>
                        <select id="filtre-statut-paiement" class="select-moderne">
                            <option value="">Tous les statuts</option>
                            <option value="${STATUTS_PAIEMENT.CONFIRME}">Confirmé</option>
                            <option value="${STATUTS_PAIEMENT.EN_ATTENTE}">En attente</option>
                            <option value="${STATUTS_PAIEMENT.ANNULE}">Annulé</option>
                            <option value="${STATUTS_PAIEMENT.REMBOURSE}">Remboursé</option>
                        </select>
                    </div>
                    <div class="filtre-groupe">
                        <label>Mode</label>
                        <select id="filtre-mode-paiement" class="select-moderne">
                            <option value="">Tous les modes</option>
                            <option value="${MODES_PAIEMENT.ESPECES}">Espèces</option>
                            <option value="${MODES_PAIEMENT.MOBILE_MONEY}">Mobile Money</option>
                            <option value="${MODES_PAIEMENT.VIREMENT}">Virement</option>
                            <option value="${MODES_PAIEMENT.CHEQUE}">Chèque</option>
                            <option value="${MODES_PAIEMENT.AUTRE}">Autre</option>
                        </select>
                    </div>
                    <div class="filtre-groupe">
                        <label>Canton</label>
                        <select id="filtre-canton-paiement" class="select-moderne">
                            <option value="">Tous les cantons</option>
                        </select>
                    </div>
                    <div class="filtre-groupe">
                        <label>Village</label>
                        <select id="filtre-village-paiement" class="select-moderne">
                            <option value="">Tous les villages</option>
                        </select>
                    </div>
                    <div class="filtre-groupe">
                        <label>Recherche cotisant</label>
                        <input type="search" id="filtre-recherche-paiement" class="champ-saisie" placeholder="Nom ou prénom du cotisant">
                    </div>
                </div>

                <div class="carte">
                    <div class="carte-body">
                        <div id="liste-paiements" class="tableau-conteneur">
                            <div class="spinner"></div>
                            <p>Chargement des paiements...</p>
                        </div>
                    </div>
                </div>

                <div id="formulaire-paiement" class="overlay-modal masque">
                    <div class="modal formulaire-carte">
                        <div class="carte-header">
                            <h3 id="titre-formulaire-paiement">Nouveau Paiement</h3>
                            <button id="btn-fermer-formulaire-paiement" class="bouton-fermer-modal">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <line x1="18" y1="6" x2="6" y2="18"></line>
                                    <line x1="6" y1="6" x2="18" y2="18"></line>
                                </svg>
                            </button>
                        </div>
                        <div class="carte-body">
                            <form id="form-paiement">
                                <div class="groupe-champ">
                                    <label class="etiquette-champ" for="cotisant-paiement">Cotisant *</label>
                                    <select id="cotisant-paiement" name="cotisant_id" class="champ-saisie" required>
                                        <option value="">Sélectionner un cotisant...</option>
                                    </select>
                                </div>

                                <div class="groupe-champ double-champ">
                                    <div>
                                        <label class="etiquette-champ" for="montant-paiement">Montant (CFA) *</label>
                                        <input type="number" min="0" id="montant-paiement" name="montant" class="champ-saisie" required>
                                    </div>
                                    <div>
                                        <label class="etiquette-champ" for="date-paiement">Date de paiement *</label>
                                        <input type="date" id="date-paiement" name="date_paiement" class="champ-saisie" required>
                                    </div>
                                </div>

                                <div class="groupe-champ double-champ">
                                    <div>
                                        <label class="etiquette-champ" for="mode-paiement">Mode de paiement *</label>
                                        <select id="mode-paiement" name="mode_paiement" class="champ-saisie" required>
                                            <option value="">Sélectionner...</option>
                                            <option value="${MODES_PAIEMENT.ESPECES}">Espèces</option>
                                            <option value="${MODES_PAIEMENT.MOBILE_MONEY}">Mobile Money</option>
                                            <option value="${MODES_PAIEMENT.VIREMENT}">Virement Bancaire</option>
                                            <option value="${MODES_PAIEMENT.CHEQUE}">Chèque</option>
                                            <option value="${MODES_PAIEMENT.AUTRE}">Autre</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label class="etiquette-champ" for="statut-paiement">Statut *</label>
                                        <select id="statut-paiement" name="statut" class="champ-saisie" required>
                                            <option value="">Sélectionner...</option>
                                            <option value="${STATUTS_PAIEMENT.CONFIRME}">Confirmé</option>
                                            <option value="${STATUTS_PAIEMENT.EN_ATTENTE}">En attente</option>
                                            <option value="${STATUTS_PAIEMENT.ANNULE}">Annulé</option>
                                            <option value="${STATUTS_PAIEMENT.REMBOURSE}">Remboursé</option>
                                        </select>
                                    </div>
                                </div>

                                <div class="groupe-champ">
                                    <label class="etiquette-champ" for="reference-paiement">Référence</label>
                                    <input type="text" id="reference-paiement" name="reference" class="champ-saisie" placeholder="Numéro de reçu ou de transaction">
                                </div>

                                <div class="groupe-champ">
                                    <label class="etiquette-champ" for="commentaire-paiement">Commentaire</label>
                                    <textarea id="commentaire-paiement" name="commentaire" class="champ-saisie" rows="3" placeholder="Note interne (optionnelle)"></textarea>
                                </div>

                                <div class="actions-formulaire">
                                    <button type="button" id="btn-annuler-paiement" class="bouton bouton-ghost">Annuler</button>
                                    <button type="submit" id="btn-sauvegarder-paiement" class="bouton bouton-primaire">
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
            </div>
        `;
    }

    async initialiser() {
        await this.chargerDonneesInitiales();
        this.configurerEvenements();
    }

    async chargerDonneesInitiales() {
        try {
            const [paiements, cotisants, cantons, villages] = await Promise.all([
                window.StockageDonnees.obtenirTous('paiements'),
                window.StockageDonnees.obtenirTous('cotisants'),
                window.StockageDonnees.obtenirTous('cantons'),
                window.StockageDonnees.obtenirTous('villages')
            ]);

            this.etat.paiements = paiements || [];
            this.etat.cotisants = cotisants || [];
            this.etat.cantons = cantons || [];
            this.etat.villages = villages || [];

            this.peuplerFiltresTerritoirePaiements();
            this.peuplerSelectCotisantPaiement();
            this.mettreAJourIndicateurs();
            this.afficherPaiements();
        } catch (erreur) {
            console.error('Erreur lors du chargement des paiements:', erreur);
        }
    }

    async chargerPaiements() {
        try {
            const paiements = await window.StockageDonnees.obtenirTous('paiements');
            this.etat.paiements = paiements || [];
            this.mettreAJourIndicateurs();
            this.afficherPaiements();
        } catch (erreur) {
            console.error('Erreur lors du rechargement des paiements:', erreur);
        }
    }

    peuplerFiltresTerritoirePaiements() {
        const { cantons, villages } = this.etat;
        const selectCanton = document.getElementById('filtre-canton-paiement');
        const selectVillage = document.getElementById('filtre-village-paiement');

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
                opt.dataset.cantonId = v.canton_id;
                selectVillage.appendChild(opt);
            });
        }
    }

    mettreAJourVillagesPourCantonPaiements(cantonId) {
        const selectVillage = document.getElementById('filtre-village-paiement');
        if (!selectVillage) return;

        selectVillage.innerHTML = '<option value="">Tous les villages</option>';

        this.etat.villages
            .filter(v => !cantonId || String(v.canton_id) === String(cantonId))
            .forEach(v => {
                const opt = document.createElement('option');
                opt.value = v.id;
                opt.textContent = v.nom;
                opt.dataset.cantonId = v.canton_id;
                selectVillage.appendChild(opt);
            });
    }

    peuplerSelectCotisantPaiement() {
        const selectCotisant = document.getElementById('cotisant-paiement');
        if (!selectCotisant) return;

        selectCotisant.innerHTML = '<option value="">Sélectionner un cotisant...</option>';

        const cotisantsTries = [...this.etat.cotisants].sort((a, b) => {
            const nomA = `${a.nom || ''} ${a.prenom || ''}`.toLowerCase();
            const nomB = `${b.nom || ''} ${b.prenom || ''}`.toLowerCase();
            if (nomA < nomB) return -1;
            if (nomA > nomB) return 1;
            return 0;
        });

        cotisantsTries.forEach(c => {
            const opt = document.createElement('option');
            opt.value = c.id;
            opt.textContent = `${c.nom || ''} ${c.prenom || ''}`.trim();
            selectCotisant.appendChild(opt);
        });
    }

    mettreAJourIndicateurs() {
        const paiements = this.etat.paiements || [];

        const totalConfirme = paiements
            .filter(p => p.statut === STATUTS_PAIEMENT.CONFIRME)
            .reduce((somme, p) => somme + (p.montant || 0), 0);

        const nbConfirmes = paiements.filter(p => p.statut === STATUTS_PAIEMENT.CONFIRME).length;
        const nbEnAttente = paiements.filter(p => p.statut === STATUTS_PAIEMENT.EN_ATTENTE).length;

        const elTotal = document.getElementById('kpi-total-encaisse');
        const elConfirmes = document.getElementById('kpi-paiements-confirmes');
        const elEnAttente = document.getElementById('kpi-paiements-en-attente');

        if (elTotal) {
            elTotal.textContent = formaterMontant(totalConfirme, false);
        }
        if (elConfirmes) {
            elConfirmes.textContent = String(nbConfirmes);
        }
        if (elEnAttente) {
            elEnAttente.textContent = String(nbEnAttente);
        }
    }

    configurerEvenements() {
        const btnNouveau = document.getElementById('btn-nouveau-paiement');
        const btnFermer = document.getElementById('btn-fermer-formulaire-paiement');
        const btnAnnuler = document.getElementById('btn-annuler-paiement');
        const form = document.getElementById('form-paiement');

        btnNouveau?.addEventListener('click', () => this.afficherFormulairePaiement());
        btnFermer?.addEventListener('click', () => this.masquerFormulairePaiement());
        btnAnnuler?.addEventListener('click', () => this.masquerFormulairePaiement());

        form?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.sauvegarderPaiement();
        });

        const filtrePeriode = document.getElementById('filtre-periode-paiement');
        const filtreStatut = document.getElementById('filtre-statut-paiement');
        const filtreMode = document.getElementById('filtre-mode-paiement');
        const filtreCanton = document.getElementById('filtre-canton-paiement');
        const filtreVillage = document.getElementById('filtre-village-paiement');
        const filtreRecherche = document.getElementById('filtre-recherche-paiement');

        filtrePeriode?.addEventListener('change', (e) => {
            this.etat.filtrePeriode = e.target.value;
            this.afficherPaiements();
        });

        filtreStatut?.addEventListener('change', (e) => {
            this.etat.filtreStatut = e.target.value;
            this.afficherPaiements();
        });

        filtreMode?.addEventListener('change', (e) => {
            this.etat.filtreMode = e.target.value;
            this.afficherPaiements();
        });

        filtreCanton?.addEventListener('change', (e) => {
            this.etat.filtreCantonId = e.target.value;
            this.mettreAJourVillagesPourCantonPaiements(e.target.value);
            this.afficherPaiements();
        });

        filtreVillage?.addEventListener('change', (e) => {
            this.etat.filtreVillageId = e.target.value;
            this.afficherPaiements();
        });

        filtreRecherche?.addEventListener('input', (e) => {
            this.etat.filtreRechercheCotisant = e.target.value.trim();
            this.afficherPaiements();
        });

        this.deleguerEvenement('#liste-paiements', '[data-action="supprimer-paiement"]', 'click', (e, cible) => {
            const id = parseInt(cible.dataset.id, 10);
            if (!isNaN(id)) {
                this.supprimerPaiement(id);
            }
        });

        this.deleguerEvenement('#liste-paiements', '[data-action="editer-paiement"]', 'click', (e, cible) => {
            const id = parseInt(cible.dataset.id, 10);
            if (!isNaN(id)) {
                const paiement = this.etat.paiements.find(p => p.id === id);
                if (paiement) {
                    this.afficherFormulairePaiement(paiement);
                }
            }
        });

        this.deleguerEvenement('#liste-paiements', 'th[data-tri-colonne]', 'click', (e, cible) => {
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
            this.afficherPaiements();
        });
    }

    afficherPaiements() {
        const conteneur = document.getElementById('liste-paiements');
        if (!conteneur) return;

        const {
            paiements,
            cotisants,
            cantons,
            villages,
            filtrePeriode,
            filtreStatut,
            filtreMode,
            filtreCantonId,
            filtreVillageId,
            filtreRechercheCotisant,
            triColonne,
            triDirection
        } = this.etat;

        if (!paiements || paiements.length === 0) {
            conteneur.innerHTML = '<p class="message-vide">Aucun paiement enregistré pour le moment.</p>';
            return;
        }

        const maintenant = new Date();
        const moisCourant = maintenant.getMonth();
        const anneeCourante = maintenant.getFullYear();

        const cotisantsParId = new Map((cotisants || []).map(c => [c.id, c]));
        const cantonsParId = new Map((cantons || []).map(c => [c.id, c]));
        const villagesParId = new Map((villages || []).map(v => [v.id, v]));

        const paiementsFiltres = paiements.filter(p => {
            const cotisant = cotisantsParId.get(p.cotisant_id);
            if (!cotisant) return false;

            if (filtreStatut && p.statut !== filtreStatut) return false;
            if (filtreMode && p.mode_paiement !== filtreMode) return false;

            if (filtreCantonId && String(cotisant.canton_id) !== String(filtreCantonId)) return false;
            if (filtreVillageId && String(cotisant.village_id) !== String(filtreVillageId)) return false;

            if (filtrePeriode && filtrePeriode !== 'tout') {
                if (!p.date_paiement) return false;
                const d = new Date(p.date_paiement);
                if (isNaN(d.getTime())) return false;

                const mois = d.getMonth();
                const annee = d.getFullYear();

                if (filtrePeriode === 'mois_courant') {
                    if (mois !== moisCourant || annee !== anneeCourante) return false;
                } else if (filtrePeriode === 'annee_courante') {
                    if (annee !== anneeCourante) return false;
                }
            }

            if (filtreRechercheCotisant && filtreRechercheCotisant.trim() !== '') {
                const terme = filtreRechercheCotisant.trim().toLowerCase();
                const texteCible = `${cotisant.nom || ''} ${cotisant.prenom || ''}`.toLowerCase();
                if (!texteCible.includes(terme)) return false;
            }

            return true;
        });

        if (paiementsFiltres.length === 0) {
            conteneur.innerHTML = '<p class="message-vide">Aucun paiement ne correspond aux filtres sélectionnés.</p>';
            return;
        }

        const colonneTri = triColonne || 'date';
        const direction = triDirection || 'desc';
        const facteur = direction === 'desc' ? -1 : 1;

        const paiementsTries = [...paiementsFiltres].sort((a, b) => {
            let valeurA;
            let valeurB;

            const cotisantA = cotisantsParId.get(a.cotisant_id);
            const cotisantB = cotisantsParId.get(b.cotisant_id);

            switch (colonneTri) {
                case 'cotisant': {
                    valeurA = `${cotisantA?.nom || ''} ${cotisantA?.prenom || ''}`.toLowerCase();
                    valeurB = `${cotisantB?.nom || ''} ${cotisantB?.prenom || ''}`.toLowerCase();
                    break;
                }
                case 'montant': {
                    valeurA = Number(a.montant || 0);
                    valeurB = Number(b.montant || 0);
                    break;
                }
                case 'statut': {
                    valeurA = a.statut || '';
                    valeurB = b.statut || '';
                    break;
                }
                case 'date':
                default: {
                    valeurA = a.date_paiement || '';
                    valeurB = b.date_paiement || '';
                    break;
                }
            }

            if (valeurA < valeurB) return -1 * facteur;
            if (valeurA > valeurB) return 1 * facteur;
            return 0;
        });

        const totalVisible = paiementsTries
            .filter(p => p.statut === STATUTS_PAIEMENT.CONFIRME)
            .reduce((somme, p) => somme + (p.montant || 0), 0);

        const classeTriDate = 'triable' + (colonneTri === 'date' ? ` tri-${direction}` : '');
        const classeTriCotisant = 'triable' + (colonneTri === 'cotisant' ? ` tri-${direction}` : '');
        const classeTriMontant = 'triable' + (colonneTri === 'montant' ? ` tri-${direction}` : '');
        const classeTriStatut = 'triable' + (colonneTri === 'statut' ? ` tri-${direction}` : '');

        let html = `
            <table class="tableau tableau-paiements">
                <thead>
                    <tr>
                        <th data-tri-colonne="date" class="${classeTriDate}">Date</th>
                        <th data-tri-colonne="cotisant" class="${classeTriCotisant}">Cotisant</th>
                        <th>Territoire</th>
                        <th data-tri-colonne="montant" class="${classeTriMontant}">Montant (CFA)</th>
                        <th>Mode</th>
                        <th data-tri-colonne="statut" class="${classeTriStatut}">Statut</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
        `;

        paiementsTries.forEach(p => {
            const cotisant = cotisantsParId.get(p.cotisant_id);
            const canton = cotisant ? cantonsParId.get(cotisant.canton_id) : null;
            const village = cotisant ? villagesParId.get(cotisant.village_id) : null;

            const libelleCotisant = cotisant
                ? `${cotisant.nom || ''} ${cotisant.prenom || ''}`.trim()
                : 'Cotisant inconnu';

            const libelleTerritoire = [
                village ? village.nom : null,
                canton ? canton.nom : null
            ].filter(Boolean).join(' · ');

            const libelleStatut = window.LIBELLES_STATUTS_PAIEMENT
                ? (window.LIBELLES_STATUTS_PAIEMENT[p.statut] || p.statut || '-')
                : (p.statut || '-');

            const libelleMode = window.LIBELLES_MODES_PAIEMENT
                ? (window.LIBELLES_MODES_PAIEMENT[p.mode_paiement] || p.mode_paiement || '-')
                : (p.mode_paiement || '-');

            html += `
                <tr data-id="${p.id}">
                    <td>${p.date_paiement || '-'}</td>
                    <td><strong>${libelleCotisant}</strong></td>
                    <td>${libelleTerritoire || '-'}</td>
                    <td>${p.montant ? formaterMontant(p.montant, false) : 0}</td>
                    <td>${libelleMode}</td>
                    <td>${libelleStatut}</td>
                    <td>
                        <div class="actions-tableau">
                            <button class="bouton-action-tableau" data-action="editer-paiement" data-id="${p.id}" title="Modifier ce paiement">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M12 20h9"></path>
                                    <path d="M5 20l1.5-5.5L18 3l3 3-11.5 11.5L5 20z"></path>
                                </svg>
                            </button>
                            <button class="bouton-action-tableau" data-action="supprimer-paiement" data-id="${p.id}" title="Supprimer ce paiement">
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
                        <td colspan="3" class="texte-secondaire">Total encaissé (paiements visibles, statut confirmé)</td>
                        <td>${formaterMontant(totalVisible, false)}</td>
                        <td colspan="3"></td>
                    </tr>
                </tfoot>
            </table>
        `;

        conteneur.innerHTML = html;
    }

    afficherFormulairePaiement(paiement = null) {
        const overlay = document.getElementById('formulaire-paiement');
        const form = document.getElementById('form-paiement');
        const titre = document.getElementById('titre-formulaire-paiement');
        if (!overlay || !form) return;

        this.etat.modeEditionPaiement = !!paiement;
        this.etat.paiementEnEdition = paiement || null;

        this.peuplerSelectCotisantPaiement();
        form.reset();

        if (paiement) {
            if (titre) {
                titre.textContent = 'Modifier Paiement';
            }
            this.remplirFormulairePaiement(paiement);
        } else {
            if (titre) {
                titre.textContent = 'Nouveau Paiement';
            }
            const champDate = document.getElementById('date-paiement');
            if (champDate) {
                const aujourdHui = new Date();
                const yyyy = aujourdHui.getFullYear();
                const mm = String(aujourdHui.getMonth() + 1).padStart(2, '0');
                const dd = String(aujourdHui.getDate()).padStart(2, '0');
                champDate.value = `${yyyy}-${mm}-${dd}`;
            }
        }

        overlay.classList.remove('masque');
        document.body.classList.add('modal-open');
    }

    remplirFormulairePaiement(paiement) {
        const form = document.getElementById('form-paiement');
        if (!form || !paiement) return;

        if (form.cotisant_id) form.cotisant_id.value = paiement.cotisant_id || '';
        if (form.montant) form.montant.value = paiement.montant != null ? paiement.montant : '';
        if (form.date_paiement) form.date_paiement.value = paiement.date_paiement || '';
        if (form.mode_paiement) form.mode_paiement.value = paiement.mode_paiement || '';
        if (form.statut) form.statut.value = paiement.statut || '';
        if (form.reference) form.reference.value = paiement.reference || '';
        if (form.commentaire) form.commentaire.value = paiement.commentaire || '';
    }

    masquerFormulairePaiement() {
        const overlay = document.getElementById('formulaire-paiement');
        if (overlay) {
            overlay.classList.add('masque');
            document.body.classList.remove('modal-open');
        }
        this.etat.modeEditionPaiement = false;
        this.etat.paiementEnEdition = null;
    }

    async sauvegarderPaiement() {
        if (this.sauvegardePaiementEnCours) {
            return;
        }

        const form = document.getElementById('form-paiement');
        if (!form) {
            return;
        }

        const cotisantId = form.cotisant_id ? form.cotisant_id.value : '';
        const montantBrut = form.montant ? form.montant.value : '';
        const datePaiement = form.date_paiement ? form.date_paiement.value : '';
        const modePaiement = form.mode_paiement ? form.mode_paiement.value : '';
        const statut = form.statut ? form.statut.value : '';
        const reference = form.reference ? form.reference.value.trim() : '';
        const commentaire = form.commentaire ? form.commentaire.value.trim() : '';

        if (!cotisantId || !montantBrut || !datePaiement || !modePaiement || !statut) {
            console.error('Champs obligatoires manquants lors de la sauvegarde du paiement');
            return;
        }

        const montant = Number(montantBrut);

        const paiementDonnees = {
            cotisant_id: parseInt(cotisantId, 10),
            montant: isNaN(montant) ? 0 : montant,
            date_paiement: datePaiement,
            mode_paiement: modePaiement,
            statut: statut,
            reference: reference || null,
            commentaire: commentaire || null
        };

        this.sauvegardePaiementEnCours = true;

        try {
            if (this.etat.modeEditionPaiement && this.etat.paiementEnEdition) {
                const paiementMisAJour = {
                    ...this.etat.paiementEnEdition,
                    ...paiementDonnees
                };
                await window.StockageDonnees.mettreAJour('paiements', paiementMisAJour);
            } else {
                await window.StockageDonnees.ajouter('paiements', paiementDonnees);
            }

            this.masquerFormulairePaiement();
            await this.chargerPaiements();
        } catch (erreur) {
            console.error('Erreur lors de la sauvegarde du paiement:', erreur);
        } finally {
            this.sauvegardePaiementEnCours = false;
        }
    }

    async supprimerPaiement(id) {
        const paiement = this.etat.paiements.find(p => p.id === id);
        const montantTexte = paiement ? formaterMontant(paiement.montant || 0, false) : '';
        const ok = await this.demanderConfirmation({
            titre: 'Supprimer ce paiement',
            message: paiement
                ? `Êtes-vous sûr de vouloir supprimer le paiement de ${montantTexte} CFA ?`
                : 'Êtes-vous sûr de vouloir supprimer ce paiement ?',
            texteConfirmer: 'Supprimer le paiement'
        });
        if (!ok) return;

        try {
            await window.StockageDonnees.supprimer('paiements', id);
            await this.chargerPaiements();
        } catch (erreur) {
            console.error('Erreur lors de la suppression du paiement:', erreur);
        }
    }
}

// Export global
if (typeof window !== 'undefined') {
    window.ComposantGestionPaiements = ComposantGestionPaiements;
}

