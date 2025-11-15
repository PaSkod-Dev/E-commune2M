/**
 * Service de Stockage de Données - IndexedDB
 * Gestionnaire Cotisations Togo
 */

class ServiceStockageDonnees {
    constructor() {
        this.nomBaseDonnees = CONFIG_APPLICATION.nomBaseDonnees;
        this.versionBaseDonnees = CONFIG_APPLICATION.versionBaseDonnees;
        this.baseDonnees = null;
        this.transactionEnCours = false;
        
        // Définition des magasins (tables)
        this.magasins = {
            COTISANTS: 'cotisants',
            PAIEMENTS: 'paiements',
            CANTONS: 'cantons',
            VILLAGES: 'villages',
            QUARTIERS: 'quartiers',
            TYPES_COTISATION: 'types_cotisation',
            PARAMETRES: 'parametres'
        };
        
        this.initialiserBaseDonnees();
    }
    
    /**
     * Initialise la base de données IndexedDB
     */
    async initialiserBaseDonnees() {
        return new Promise((resoudre, rejeter) => {
            const requete = indexedDB.open(this.nomBaseDonnees, this.versionBaseDonnees);
            
            requete.onerror = () => {
                console.error('Erreur ouverture base de données:', requete.error);
                rejeter(requete.error);
            };
            
            requete.onsuccess = () => {
                this.baseDonnees = requete.result;
                console.log('Base de données ouverte avec succès');
                this.chargerDonneesInitiales();
                resoudre(this.baseDonnees);
            };
            
            requete.onupgradeneeded = (event) => {
                this.baseDonnees = event.target.result;
                this.creerMagasins();
            };
        });
    }
    
    /**
     * Crée les magasins (tables) de la base de données
     */
    creerMagasins() {
        // Magasin des cotisants
        if (!this.baseDonnees.objectStoreNames.contains(this.magasins.COTISANTS)) {
            const magasinCotisants = this.baseDonnees.createObjectStore(this.magasins.COTISANTS, {
                keyPath: 'id',
                autoIncrement: true
            });
            magasinCotisants.createIndex('nom', 'nom', { unique: false });
            magasinCotisants.createIndex('village_id', 'village_id', { unique: false });
            magasinCotisants.createIndex('statut', 'statut', { unique: false });
        }
        
        // Magasin des paiements
        if (!this.baseDonnees.objectStoreNames.contains(this.magasins.PAIEMENTS)) {
            const magasinPaiements = this.baseDonnees.createObjectStore(this.magasins.PAIEMENTS, {
                keyPath: 'id',
                autoIncrement: true
            });
            magasinPaiements.createIndex('cotisant_id', 'cotisant_id', { unique: false });
            magasinPaiements.createIndex('date_paiement', 'date_paiement', { unique: false });
            magasinPaiements.createIndex('statut', 'statut', { unique: false });
        }
        
        // Magasin des cantons
        if (!this.baseDonnees.objectStoreNames.contains(this.magasins.CANTONS)) {
            const magasinCantons = this.baseDonnees.createObjectStore(this.magasins.CANTONS, {
                keyPath: 'id',
                autoIncrement: true
            });
            magasinCantons.createIndex('nom', 'nom', { unique: true });
        }
        
        // Magasin des villages
        if (!this.baseDonnees.objectStoreNames.contains(this.magasins.VILLAGES)) {
            const magasinVillages = this.baseDonnees.createObjectStore(this.magasins.VILLAGES, {
                keyPath: 'id',
                autoIncrement: true
            });
            magasinVillages.createIndex('canton_id', 'canton_id', { unique: false });
            magasinVillages.createIndex('nom', 'nom', { unique: false });
        }
        
        // Magasin des quartiers
        if (!this.baseDonnees.objectStoreNames.contains(this.magasins.QUARTIERS)) {
            const magasinQuartiers = this.baseDonnees.createObjectStore(this.magasins.QUARTIERS, {
                keyPath: 'id',
                autoIncrement: true
            });
            magasinQuartiers.createIndex('village_id', 'village_id', { unique: false });
            magasinQuartiers.createIndex('nom', 'nom', { unique: false });
        }
        
        // Magasin des types de cotisation
        if (!this.baseDonnees.objectStoreNames.contains(this.magasins.TYPES_COTISATION)) {
            const magasinTypes = this.baseDonnees.createObjectStore(this.magasins.TYPES_COTISATION, {
                keyPath: 'id',
                autoIncrement: true
            });
            magasinTypes.createIndex('nom', 'nom', { unique: true });
        }
        
        // Magasin des paramètres
        if (!this.baseDonnees.objectStoreNames.contains(this.magasins.PARAMETRES)) {
            this.baseDonnees.createObjectStore(this.magasins.PARAMETRES, {
                keyPath: 'cle'
            });
        }
    }
    
    /**
     * Charge les données initiales
     */
    async chargerDonneesInitiales() {
        try {
            // Vérifier si les données existent déjà
            const cantons = await this.obtenirTous(this.magasins.CANTONS);
            if (cantons.length === 0) {
                await this.insererDonneesInitiales();
            }
        } catch (erreur) {
            console.error('Erreur lors du chargement des données initiales:', erreur);
        }
    }
    
    /**
     * Insère les données initiales
     */
    async insererDonneesInitiales() {
        // Cantons du Togo
        const cantons = [
            { nom: 'Golfe', chef_lieu: 'Lomé', code: 'GLF' },
            { nom: 'Kloto', chef_lieu: 'Kpalimé', code: 'KLT' },
            { nom: 'Ogou', chef_lieu: 'Atakpamé', code: 'OGU' },
            { nom: 'Tchaoudjo', chef_lieu: 'Sokodé', code: 'TCH' }
        ];
        
        for (const canton of cantons) {
            await this.ajouter(this.magasins.CANTONS, canton);
        }
        
        // Types de cotisation par défaut
        const typesCotisation = [
            { nom: 'Cotisation Mensuelle', montant_requis: 5000, periodicite: 'mensuelle' },
            { nom: 'Cotisation Développement', montant_requis: 25000, periodicite: 'trimestrielle' },
            { nom: 'Cotisation Solidarité', montant_requis: 10000, periodicite: 'mensuelle' }
        ];
        
        for (const type of typesCotisation) {
            await this.ajouter(this.magasins.TYPES_COTISATION, type);
        }
    }
    
    /**
     * Ajoute un enregistrement
     */
    async ajouter(nomMagasin, donnees) {
        return new Promise((resoudre, rejeter) => {
            const transaction = this.baseDonnees.transaction([nomMagasin], 'readwrite');
            const magasin = transaction.objectStore(nomMagasin);
            
            // Ajouter timestamp de création
            donnees.date_creation = new Date();
            donnees.date_modification = new Date();
            
            const requete = magasin.add(donnees);
            
            requete.onsuccess = () => {
                resoudre(requete.result);
                this.emettrEvenement(EVENEMENTS.DONNEES_SAUVEGARDEES, { type: 'ajout', magasin: nomMagasin, id: requete.result });
            };
            
            requete.onerror = () => {
                rejeter(requete.error);
            };
        });
    }
    
    /**
     * Obtient un enregistrement par ID
     */
    async obtenirParId(nomMagasin, id) {
        return new Promise((resoudre, rejeter) => {
            const transaction = this.baseDonnees.transaction([nomMagasin], 'readonly');
            const magasin = transaction.objectStore(nomMagasin);
            const requete = magasin.get(id);
            
            requete.onsuccess = () => {
                resoudre(requete.result);
            };
            
            requete.onerror = () => {
                rejeter(requete.error);
            };
        });
    }
    
    /**
     * Obtient tous les enregistrements d'un magasin
     */
    async obtenirTous(nomMagasin) {
        return new Promise((resoudre, rejeter) => {
            const transaction = this.baseDonnees.transaction([nomMagasin], 'readonly');
            const magasin = transaction.objectStore(nomMagasin);
            const requete = magasin.getAll();
            
            requete.onsuccess = () => {
                resoudre(requete.result);
            };
            
            requete.onerror = () => {
                rejeter(requete.error);
            };
        });
    }
    
    /**
     * Met à jour un enregistrement
     */
    async mettreAJour(nomMagasin, donnees) {
        return new Promise((resoudre, rejeter) => {
            const transaction = this.baseDonnees.transaction([nomMagasin], 'readwrite');
            const magasin = transaction.objectStore(nomMagasin);
            
            // Mettre à jour timestamp de modification
            donnees.date_modification = new Date();
            
            const requete = magasin.put(donnees);
            
            requete.onsuccess = () => {
                resoudre(requete.result);
                this.emettrEvenement(EVENEMENTS.DONNEES_SAUVEGARDEES, { type: 'modification', magasin: nomMagasin, id: donnees.id });
            };
            
            requete.onerror = () => {
                rejeter(requete.error);
            };
        });
    }
    
    /**
     * Supprime un enregistrement
     */
    async supprimer(nomMagasin, id) {
        return new Promise((resoudre, rejeter) => {
            const transaction = this.baseDonnees.transaction([nomMagasin], 'readwrite');
            const magasin = transaction.objectStore(nomMagasin);
            const requete = magasin.delete(id);
            
            requete.onsuccess = () => {
                resoudre(true);
                this.emettrEvenement(EVENEMENTS.DONNEES_SAUVEGARDEES, { type: 'suppression', magasin: nomMagasin, id });
            };
            
            requete.onerror = () => {
                rejeter(requete.error);
            };
        });
    }
    
    /**
     * Recherche avec filtres
     */
    async rechercher(nomMagasin, filtres = {}) {
        const tousLesEnregistrements = await this.obtenirTous(nomMagasin);
        
        return tousLesEnregistrements.filter(enregistrement => {
            return Object.entries(filtres).every(([cle, valeur]) => {
                if (valeur === null || valeur === undefined) return true;
                
                const valeurEnregistrement = obtenirValeurPropriete(enregistrement, cle);
                
                if (typeof valeur === 'string') {
                    return String(valeurEnregistrement).toLowerCase().includes(valeur.toLowerCase());
                }
                
                return valeurEnregistrement === valeur;
            });
        });
    }
    
    /**
     * Exporte toutes les données
     */
    async exporterToutesDonnees() {
        const donnees = {};
        
        for (const nomMagasin of Object.values(this.magasins)) {
            donnees[nomMagasin] = await this.obtenirTous(nomMagasin);
        }
        
        return {
            version: this.versionBaseDonnees,
            date_export: new Date(),
            donnees: donnees
        };
    }
    
    /**
     * Importe des données
     */
    async importerDonnees(donneesImport) {
        try {
            for (const [nomMagasin, enregistrements] of Object.entries(donneesImport.donnees)) {
                if (Object.values(this.magasins).includes(nomMagasin)) {
                    // Vider le magasin existant
                    await this.viderMagasin(nomMagasin);
                    
                    // Ajouter les nouveaux enregistrements
                    for (const enregistrement of enregistrements) {
                        await this.ajouter(nomMagasin, enregistrement);
                    }
                }
            }
            
            return true;
        } catch (erreur) {
            console.error('Erreur lors de l\'import:', erreur);
            throw erreur;
        }
    }
    
    /**
     * Vide un magasin
     */
    async viderMagasin(nomMagasin) {
        return new Promise((resoudre, rejeter) => {
            const transaction = this.baseDonnees.transaction([nomMagasin], 'readwrite');
            const magasin = transaction.objectStore(nomMagasin);
            const requete = magasin.clear();
            
            requete.onsuccess = () => {
                resoudre(true);
            };
            
            requete.onerror = () => {
                rejeter(requete.error);
            };
        });
    }
    
    /**
     * Émet un événement personnalisé
     */
    emettrEvenement(nomEvenement, donnees) {
        const evenement = new CustomEvent(nomEvenement, { detail: donnees });
        document.dispatchEvent(evenement);
    }
}

// Instance globale du service
const stockageDonnees = new ServiceStockageDonnees();

// Rendre disponible globalement
if (typeof window !== 'undefined') {
    window.StockageDonnees = stockageDonnees;
}