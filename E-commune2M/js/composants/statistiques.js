/**
 * Composant Statistiques et Classements
 * Affiche les classements par canton, village ou quartier
 * avec différents critères de tri
 */

class ComposantStatistiques extends BaseComposant {
    constructor(options = {}) {
        super(options);
    }

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
        const critereSelect = document.getElementById('critere-classement');
        const actualiserBtn = document.getElementById('actualiser-classement');

        if (typeSelect) {
            typeSelect.addEventListener('change', (e) => {
                this.gererChangementType(e.target.value);
            });
        }

        if (critereSelect) {
            critereSelect.addEventListener('change', () => {
                this.actualiserClassement();
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

            const villages = await window.StockageDonnees.rechercher('villages', { canton_id: parseInt(cantonId, 10) });

            villageSelect.innerHTML = '<option value="">Sélectionner un village...</option>';
            villages.forEach(village => {
                const option = document.createElement('option');
                option.value = village.id;
                option.textContent = village.nom;
                villageSelect.appendChild(option);
            });

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

        if (!selecteurCanton || !selecteurVillage) return;

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

            if (!contenu) return;
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
                donnees = await window.ServiceClassification.obtenirClassementParVillage(parseInt(cantonId, 10), critere, 'desc');
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

                donnees = await window.ServiceClassification.obtenirClassementParQuartier(parseInt(villageId, 10), critere, 'desc');
            }

            this.afficherClassement(donnees, type);

        } catch (erreur) {
            console.error('Erreur:', erreur);
            const contenu = document.getElementById('contenu-classement');
            if (contenu) {
                contenu.innerHTML = '<p>Erreur lors du chargement</p>';
            }
        }
    }

    afficherClassement(donnees, type) {
        const contenu = document.getElementById('contenu-classement');
        if (!contenu) return;

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
            if (type === 'cantons') nom = item.canton.nom;
            else if (type === 'villages') nom = item.village.nom;
            else if (type === 'quartiers') nom = item.quartier.nom;

            const badge = item.rang <= 3 ? `badge-rang-${item.rang}` : 'badge-rang';

            html += `
                <tr>
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

// Export global
if (typeof window !== 'undefined') {
    window.ComposantStatistiques = ComposantStatistiques;
}

