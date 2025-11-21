/**
 * Service de Classification et Classement
 * Gestionnaire Cotisations Togo
 */

class ServiceClassification {
    constructor() {
        this.stockage = window.StockageDonnees;
    }

    /**
     * Obtient le classement par canton
     */
    async obtenirClassementParCanton(critere = 'montant_cotise', ordre = 'desc') {
        try {
            const cotisants = await this.stockage.obtenirTous('cotisants');
            const paiements = await this.stockage.obtenirTous('paiements');
            const cantons = await this.stockage.obtenirTous('cantons');
            const villages = await this.stockage.obtenirTous('villages');

            const classementCantons = [];

            for (const canton of cantons) {
                const villagesCanton = villages.filter(v => v.canton_id === canton.id);
                const cotisantsCanton = cotisants.filter(c =>
                    villagesCanton.some(v => v.id === c.village_id)
                );

                const paiementsCanton = paiements.filter(p =>
                    cotisantsCanton.some(c => c.id === p.cotisant_id)
                );

                // Pour le moment, on base le montant total sur le montant de cotisation
                // saisi sur la fiche cotisant, afin que les statistiques soient utilisables
                // même avant la mise en place complète du module Paiements.
                const montantTotal = cotisantsCanton.reduce((sum, c) => sum + (c.montant_cotisation || 0), 0);
                const nombreCotisants = cotisantsCanton.length;

                // Statut actif cohérent avec les constantes globales
                const statutActif = (typeof window !== 'undefined'
                    && window.STATUTS_COTISANT
                    && window.STATUTS_COTISANT.ACTIF)
                    ? window.STATUTS_COTISANT.ACTIF
                    : 'ACTIF';

                const cotisantsActifs = cotisantsCanton.filter(c => c.statut === statutActif).length;
                const tauxParticipation = nombreCotisants > 0 ? (cotisantsActifs / nombreCotisants) * 100 : 0;

                classementCantons.push({
                    canton: canton,
                    villages: villagesCanton,
                    cotisants: cotisantsCanton,
                    statistiques: {
                        montant_total: montantTotal,
                        montant_moyen: nombreCotisants > 0 ? montantTotal / nombreCotisants : 0,
                        nombre_cotisants: nombreCotisants,
                        cotisants_actifs: cotisantsActifs,
                        taux_participation: Math.round(tauxParticipation * 100) / 100,
                        nombre_paiements: paiementsCanton.length
                    },
                    rang: 0
                });
            }

            // Trier selon le critère
            const classementTrie = this.trierClassement(classementCantons, critere, ordre);

            // Assigner les rangs
            classementTrie.forEach((item, index) => {
                item.rang = index + 1;
            });

            return classementTrie;

        } catch (erreur) {
            console.error('Erreur lors du classement par canton:', erreur);
            throw erreur;
        }
    }

    /**
     * Obtient le classement par village dans un canton
     */
    async obtenirClassementParVillage(cantonId, critere = 'montant_cotise', ordre = 'desc') {
        try {
            const cotisants = await this.stockage.obtenirTous('cotisants');
            const paiements = await this.stockage.obtenirTous('paiements');
            const villages = await this.stockage.rechercher('villages', { canton_id: cantonId });

            const classementVillages = [];

            for (const village of villages) {
                const cotisantsVillage = cotisants.filter(c => c.village_id === village.id);
                const paiementsVillage = paiements.filter(p =>
                    cotisantsVillage.some(c => c.id === p.cotisant_id)
                );

                const montantTotal = cotisantsVillage.reduce((sum, c) => sum + (c.montant_cotisation || 0), 0);
                const nombreCotisants = cotisantsVillage.length;

                const statutActif = (typeof window !== 'undefined'
                    && window.STATUTS_COTISANT
                    && window.STATUTS_COTISANT.ACTIF)
                    ? window.STATUTS_COTISANT.ACTIF
                    : 'ACTIF';

                const cotisantsActifs = cotisantsVillage.filter(c => c.statut === statutActif).length;
                const tauxParticipation = nombreCotisants > 0 ? (cotisantsActifs / nombreCotisants) * 100 : 0;

                classementVillages.push({
                    village: village,
                    cotisants: cotisantsVillage,
                    statistiques: {
                        montant_total: montantTotal,
                        montant_moyen: nombreCotisants > 0 ? montantTotal / nombreCotisants : 0,
                        nombre_cotisants: nombreCotisants,
                        cotisants_actifs: cotisantsActifs,
                        taux_participation: Math.round(tauxParticipation * 100) / 100,
                        nombre_paiements: paiementsVillage.length
                    },
                    rang: 0
                });
            }

            // Trier et assigner rangs
            const classementTrie = this.trierClassement(classementVillages, critere, ordre);
            classementTrie.forEach((item, index) => {
                item.rang = index + 1;
            });

            return classementTrie;

        } catch (erreur) {
            console.error('Erreur lors du classement par village:', erreur);
            throw erreur;
        }
    }

    /**
     * Obtient le classement par quartier dans un village
     */
    async obtenirClassementParQuartier(villageId, critere = 'montant_cotise', ordre = 'desc') {
        try {
            const cotisants = await this.stockage.obtenirTous('cotisants');
            const paiements = await this.stockage.obtenirTous('paiements');
            const quartiers = await this.stockage.rechercher('quartiers', { village_id: parseInt(villageId) });

            // Grouper les cotisants par quartier_id dans le village sélectionné
            const cotisantsVillage = cotisants.filter(c => c.village_id === parseInt(villageId));
            const quartiersMap = new Map();

            // Initialiser la map avec tous les quartiers du village
            for (const quartier of quartiers) {
                quartiersMap.set(quartier.id, {
                    quartier: quartier,
                    cotisants: [],
                    statistiques: null,
                    rang: 0
                });
            }

            // Ajouter les cotisants à leurs quartiers respectifs
            for (const cotisant of cotisantsVillage) {
                if (cotisant.quartier_id && quartiersMap.has(cotisant.quartier_id)) {
                    quartiersMap.get(cotisant.quartier_id).cotisants.push(cotisant);
                }
            }

            const classementQuartiers = [];

            // Calculer les statistiques pour chaque quartier
            for (const [quartierId, data] of quartiersMap) {
                const paiementsQuartier = paiements.filter(p =>
                    data.cotisants.some(c => c.id === p.cotisant_id)
                );

                const montantTotal = data.cotisants.reduce((sum, c) => sum + (c.montant_cotisation || 0), 0);
                const nombreCotisants = data.cotisants.length;

                const statutActif = (typeof window !== 'undefined'
                    && window.STATUTS_COTISANT
                    && window.STATUTS_COTISANT.ACTIF)
                    ? window.STATUTS_COTISANT.ACTIF
                    : 'ACTIF';

                const cotisantsActifs = data.cotisants.filter(c => c.statut === statutActif).length;
                const tauxParticipation = nombreCotisants > 0 ? (cotisantsActifs / nombreCotisants) * 100 : 0;

                data.statistiques = {
                    montant_total: montantTotal,
                    montant_moyen: nombreCotisants > 0 ? montantTotal / nombreCotisants : 0,
                    nombre_cotisants: nombreCotisants,
                    cotisants_actifs: cotisantsActifs,
                    taux_participation: Math.round(tauxParticipation * 100) / 100,
                    nombre_paiements: paiementsQuartier.length
                };

                classementQuartiers.push(data);
            }

            // Trier et assigner rangs
            const classementTrie = this.trierClassement(classementQuartiers, critere, ordre);
            classementTrie.forEach((item, index) => {
                item.rang = index + 1;
            });

            return classementTrie;

        } catch (erreur) {
            console.error('Erreur lors du classement par quartier:', erreur);
            throw erreur;
        }
    }

    /**
     * Trie un classement selon un critère
     */
    trierClassement(classement, critere, ordre) {
        return classement.sort((a, b) => {
            let valeurA, valeurB;

            switch (critere) {
                case 'montant_cotise':
                    valeurA = a.statistiques.montant_total;
                    valeurB = b.statistiques.montant_total;
                    break;
                case 'taux_participation':
                    valeurA = a.statistiques.taux_participation;
                    valeurB = b.statistiques.taux_participation;
                    break;
                case 'nombre_cotisants':
                    valeurA = a.statistiques.nombre_cotisants || 0;
                    valeurB = b.statistiques.nombre_cotisants || 0;
                    break;
                default:
                    valeurA = a.statistiques.montant_total;
                    valeurB = b.statistiques.montant_total;
            }

            if (ordre === 'asc') {
                return valeurA - valeurB;
            } else {
                return valeurB - valeurA;
            }
        });
    }
}

// Instance globale
const serviceClassification = new ServiceClassification();

// Rendre disponible globalement
if (typeof window !== 'undefined') {
    window.ServiceClassification = serviceClassification;
}