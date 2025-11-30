/**
 * Composant Tableau de Bord
 * Affiche les indicateurs clés et les statistiques principales
 */

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
                            <div class="kpi-valeur" id="kpi-cotisants-actifs">-</div>
                            <div class="kpi-libelle">Cotisants Actifs</div>
                            <div class="kpi-evolution positif">
                                <svg class="icone-tendance" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <polyline points="22,7 13.5,15.5 8.5,10.5 2,17"></polyline>
                                    <polyline points="16,7 22,7 22,13"></polyline>
                                </svg>
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
                            <div class="kpi-valeur" id="kpi-total-collecte">-</div>
                            <div class="kpi-libelle">Total Collecté (CFA)</div>
                            <div class="kpi-evolution positif">
                                <svg class="icone-tendance" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <polyline points="22,7 13.5,15.5 8.5,10.5 2,17"></polyline>
                                    <polyline points="16,7 22,7 22,13"></polyline>
                                </svg>
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
                            <div class="kpi-valeur" id="kpi-taux-participation">-</div>
                            <div class="kpi-libelle">Taux de Participation</div>
                            <div class="kpi-evolution positif">
                                <svg class="icone-tendance" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <polyline points="22,7 13.5,15.5 8.5,10.5 2,17"></polyline>
                                    <polyline points="16,7 22,7 22,13"></polyline>
                                </svg>
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

    async initialiser() {
        await this.mettreAJourIndicateurs();
    }

    async mettreAJourIndicateurs() {
        try {
            const cotisants = await window.StockageDonnees.obtenirTous('cotisants');

            const nombreActifs = cotisants.filter(c => c.statut === STATUTS_COTISANT.ACTIF).length;
            const totalCollecte = cotisants.reduce((somme, c) => somme + (c.montant_cotisation || 0), 0);
            const tauxParticipation = cotisants.length > 0
                ? Math.round((nombreActifs / cotisants.length) * 100)
                : 0;

            const elActifs = document.getElementById('kpi-cotisants-actifs');
            const elTotal = document.getElementById('kpi-total-collecte');
            const elTaux = document.getElementById('kpi-taux-participation');

            if (elActifs) {
                elActifs.textContent = String(nombreActifs);
            }

            if (elTotal) {
                elTotal.textContent = formaterMontant(totalCollecte, false);
            }

            if (elTaux) {
                elTaux.textContent = `${tauxParticipation}%`;
            }
        } catch (erreur) {
            console.error('Erreur lors du calcul des indicateurs du tableau de bord:', erreur);
        }
    }
}

// Export global
if (typeof window !== 'undefined') {
    window.ComposantTableauBord = ComposantTableauBord;
}

