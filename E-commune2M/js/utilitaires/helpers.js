/**
 * Fonctions Utilitaires - Gestionnaire Cotisations Togo
 * Toutes les fonctions sont nommées en français pour une meilleure compréhension
 */

// === UTILITAIRES DE FORMATAGE ===

/**
 * Formate un montant en CFA avec séparateurs de milliers
 * @param {number} montant - Le montant à formater
 * @param {boolean} avecDevise - Inclure le symbole CFA
 * @returns {string} Montant formaté
 */
function formaterMontant(montant, avecDevise = true) {
    if (typeof montant !== 'number' || isNaN(montant)) {
        return avecDevise ? '0 CFA' : '0';
    }
    
    const montantFormate = new Intl.NumberFormat('fr-FR', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(montant);
    
    return avecDevise ? `${montantFormate} CFA` : montantFormate;
}

/**
 * Formate une date au format français
 * @param {Date|string} date - La date à formater
 * @param {string} format - 'court', 'long', 'complet'
 * @returns {string} Date formatée
 */
function formaterDate(date, format = 'court') {
    if (!date) return '';
    
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    if (isNaN(dateObj.getTime())) return '';
    
    const options = {
        'court': { day: '2-digit', month: '2-digit', year: 'numeric' },
        'long': { day: 'numeric', month: 'long', year: 'numeric' },
        'complet': { 
            weekday: 'long', 
            day: 'numeric', 
            month: 'long', 
            year: 'numeric' 
        }
    };
    
    return dateObj.toLocaleDateString('fr-FR', options[format] || options.court);
}

/**
 * Formate un nom complet (Nom + Prénoms)
 * @param {string} nom - Nom de famille
 * @param {string} prenoms - Prénoms
 * @returns {string} Nom complet formaté
 */
function formaterNomComplet(nom, prenoms) {
    const nomFormate = capitaliserMots(nom || '');
    const prenomsFormats = capitaliserMots(prenoms || '');
    return `${nomFormate} ${prenomsFormats}`.trim();
}

/**
 * Capitalise la première lettre de chaque mot
 * @param {string} texte - Texte à capitaliser
 * @returns {string} Texte capitalisé
 */
function capitaliserMots(texte) {
    if (!texte) return '';
    return texte.toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
}

/**
 * Formate un numéro de téléphone togolais
 * @param {string} telephone - Numéro de téléphone
 * @returns {string} Numéro formaté
 */
function formaterTelephone(telephone) {
    if (!telephone) return '';
    
    // Nettoyer le numéro
    const numeroNettoye = telephone.replace(/\D/g, '');
    
    // Format togolais : +228 XX XX XX XX
    if (numeroNettoye.length === 8) {
        return `+228 ${numeroNettoye.substring(0, 2)} ${numeroNettoye.substring(2, 4)} ${numeroNettoye.substring(4, 6)} ${numeroNettoye.substring(6, 8)}`;
    } else if (numeroNettoye.length === 11 && numeroNettoye.startsWith('228')) {
        const numero = numeroNettoye.substring(3);
        return `+228 ${numero.substring(0, 2)} ${numero.substring(2, 4)} ${numero.substring(4, 6)} ${numero.substring(6, 8)}`;
    }
    
    return telephone;
}

// === UTILITAIRES DE VALIDATION ===

/**
 * Valide une adresse email
 * @param {string} email - Email à valider
 * @returns {boolean} True si valide
 */
function validerEmail(email) {
    return REGEX_VALIDATION.EMAIL.test(email);
}

/**
 * Valide un numéro de téléphone togolais
 * @param {string} telephone - Numéro à valider
 * @returns {boolean} True si valide
 */
function validerTelephone(telephone) {
    return REGEX_VALIDATION.TELEPHONE_TOGO.test(telephone);
}

/**
 * Valide un montant
 * @param {string|number} montant - Montant à valider
 * @returns {boolean} True si valide
 */
function validerMontant(montant) {
    const montantNum = typeof montant === 'string' ? parseFloat(montant) : montant;
    return !isNaN(montantNum) && montantNum >= LIMITES.MONTANT_MIN && montantNum <= LIMITES.MONTANT_MAX;
}

/**
 * Valide un nom (nom de famille ou prénoms)
 * @param {string} nom - Nom à valider
 * @returns {boolean} True si valide
 */
function validerNom(nom) {
    return nom && nom.length >= LIMITES.NOM_MIN && nom.length <= LIMITES.NOM_MAX && REGEX_VALIDATION.NOM.test(nom);
}

/**
 * Valide une date
 * @param {string|Date} date - Date à valider
 * @returns {boolean} True si valide
 */
function validerDate(date) {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj instanceof Date && !isNaN(dateObj.getTime());
}

// === UTILITAIRES DE MANIPULATION DE DONNÉES ===

/**
 * Trie un tableau d'objets par une propriété
 * @param {Array} tableau - Tableau à trier
 * @param {string} propriete - Propriété de tri
 * @param {string} ordre - 'asc' ou 'desc'
 * @returns {Array} Tableau trié
 */
function trierTableau(tableau, propriete, ordre = 'asc') {
    return [...tableau].sort((a, b) => {
        let valeurA = obtenirValeurPropriete(a, propriete);
        let valeurB = obtenirValeurPropriete(b, propriete);
        
        // Gestion des valeurs nulles/undefined
        if (valeurA == null) valeurA = '';
        if (valeurB == null) valeurB = '';
        
        // Conversion pour comparaison
        if (typeof valeurA === 'string') valeurA = valeurA.toLowerCase();
        if (typeof valeurB === 'string') valeurB = valeurB.toLowerCase();
        
        if (ordre === 'desc') {
            return valeurB > valeurA ? 1 : valeurB < valeurA ? -1 : 0;
        } else {
            return valeurA > valeurB ? 1 : valeurA < valeurB ? -1 : 0;
        }
    });
}

/**
 * Filtre un tableau d'objets par une recherche textuelle
 * @param {Array} tableau - Tableau à filtrer
 * @param {string} recherche - Terme de recherche
 * @param {Array} proprietes - Propriétés à rechercher
 * @returns {Array} Tableau filtré
 */
function filtrerTableau(tableau, recherche, proprietes = []) {
    if (!recherche || recherche.trim() === '') return tableau;
    
    const termeRecherche = recherche.toLowerCase().trim();
    
    return tableau.filter(item => {
        if (proprietes.length === 0) {
            // Recherche dans toutes les propriétés
            return Object.values(item).some(valeur => 
                String(valeur).toLowerCase().includes(termeRecherche)
            );
        } else {
            // Recherche dans les propriétés spécifiées
            return proprietes.some(prop => {
                const valeur = obtenirValeurPropriete(item, prop);
                return String(valeur).toLowerCase().includes(termeRecherche);
            });
        }
    });
}

/**
 * Obtient la valeur d'une propriété imbriquée (ex: 'village.canton.nom')
 * @param {Object} objet - Objet source
 * @param {string} chemin - Chemin de la propriété
 * @returns {*} Valeur de la propriété
 */
function obtenirValeurPropriete(objet, chemin) {
    return chemin.split('.').reduce((obj, prop) => obj && obj[prop], objet);
}

/**
 * Groupe un tableau d'objets par une propriété
 * @param {Array} tableau - Tableau à grouper
 * @param {string} propriete - Propriété de groupement
 * @returns {Object} Objet groupé
 */
function grouperTableau(tableau, propriete) {
    return tableau.reduce((groupes, item) => {
        const cle = obtenirValeurPropriete(item, propriete);
        if (!groupes[cle]) groupes[cle] = [];
        groupes[cle].push(item);
        return groupes;
    }, {});
}

// === UTILITAIRES DE CALCUL ===

/**
 * Calcule la somme d'une propriété numérique dans un tableau
 * @param {Array} tableau - Tableau d'objets
 * @param {string} propriete - Propriété à sommer
 * @returns {number} Somme
 */
function calculerSomme(tableau, propriete) {
    return tableau.reduce((somme, item) => {
        const valeur = obtenirValeurPropriete(item, propriete);
        return somme + (typeof valeur === 'number' ? valeur : 0);
    }, 0);
}

/**
 * Calcule la moyenne d'une propriété numérique dans un tableau
 * @param {Array} tableau - Tableau d'objets
 * @param {string} propriete - Propriété pour la moyenne
 * @returns {number} Moyenne
 */
function calculerMoyenne(tableau, propriete) {
    if (tableau.length === 0) return 0;
    return calculerSomme(tableau, propriete) / tableau.length;
}

/**
 * Calcule des statistiques de base pour une propriété numérique
 * @param {Array} tableau - Tableau d'objets
 * @param {string} propriete - Propriété à analyser
 * @returns {Object} Statistiques (min, max, moyenne, somme, count)
 */
function calculerStatistiques(tableau, propriete) {
    if (tableau.length === 0) {
        return { min: 0, max: 0, moyenne: 0, somme: 0, count: 0 };
    }
    
    const valeurs = tableau.map(item => obtenirValeurPropriete(item, propriete))
                           .filter(val => typeof val === 'number' && !isNaN(val));
    
    if (valeurs.length === 0) {
        return { min: 0, max: 0, moyenne: 0, somme: 0, count: 0 };
    }
    
    const somme = valeurs.reduce((acc, val) => acc + val, 0);
    
    return {
        min: Math.min(...valeurs),
        max: Math.max(...valeurs),
        moyenne: somme / valeurs.length,
        somme: somme,
        count: valeurs.length
    };
}

// === UTILITAIRES DE DATES ===

/**
 * Obtient le début du mois pour une date
 * @param {Date} date - Date de référence
 * @returns {Date} Début du mois
 */
function obtenirDebutMois(date = new Date()) {
    return new Date(date.getFullYear(), date.getMonth(), 1);
}

/**
 * Obtient la fin du mois pour une date
 * @param {Date} date - Date de référence
 * @returns {Date} Fin du mois
 */
function obtenirFinMois(date = new Date()) {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999);
}

/**
 * Calcule la différence en jours entre deux dates
 * @param {Date} date1 - Première date
 * @param {Date} date2 - Deuxième date
 * @returns {number} Différence en jours
 */
function calculerDifferenceJours(date1, date2) {
    const diffTime = Math.abs(date2 - date1);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Vérifie si une date est dans une période
 * @param {Date} date - Date à vérifier
 * @param {Date} debut - Début de période
 * @param {Date} fin - Fin de période
 * @returns {boolean} True si dans la période
 */
function estDansPeriode(date, debut, fin) {
    return date >= debut && date <= fin;
}

// === UTILITAIRES DOM ===

/**
 * Crée un élément HTML avec attributs et contenu
 * @param {string} tag - Tag HTML
 * @param {Object} attributs - Attributs de l'élément
 * @param {string|Node} contenu - Contenu de l'élément
 * @returns {HTMLElement} Élément créé
 */
function creerElement(tag, attributs = {}, contenu = '') {
    const element = document.createElement(tag);
    
    // Ajouter les attributs
    Object.entries(attributs).forEach(([cle, valeur]) => {
        if (cle === 'className') {
            element.className = valeur;
        } else if (cle === 'dataset') {
            Object.entries(valeur).forEach(([dataCle, dataValeur]) => {
                element.dataset[dataCle] = dataValeur;
            });
        } else {
            element.setAttribute(cle, valeur);
        }
    });
    
    // Ajouter le contenu
    if (typeof contenu === 'string') {
        element.innerHTML = contenu;
    } else if (contenu instanceof Node) {
        element.appendChild(contenu);
    }
    
    return element;
}

/**
 * Affiche un message de notification
 * @param {string} message - Message à afficher
 * @param {string} type - Type de notification ('succes', 'erreur', 'info', 'avertissement')
 * @param {number} duree - Durée d'affichage en ms
 */
function afficherNotification(message, type = 'info', duree = 3000) {
    // Créer le conteneur de notifications s'il n'existe pas
    let conteneur = document.getElementById('conteneur-notifications');
    if (!conteneur) {
        conteneur = creerElement('div', {
            id: 'conteneur-notifications',
            className: 'conteneur-notifications',
            style: 'position: fixed; top: 20px; right: 20px; z-index: 10000;'
        });
        document.body.appendChild(conteneur);
    }
    
    // Créer la notification
    const notification = creerElement('div', {
        className: `alerte alerte-${type} animation-fadeIn`,
        style: 'margin-bottom: 10px; min-width: 300px;'
    }, message);
    
    conteneur.appendChild(notification);
    
    // Supprimer automatiquement après la durée spécifiée
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.opacity = '0';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }
    }, duree);
}

// === UTILITAIRES DE STOCKAGE ===

/**
 * Sauvegarde des données dans le localStorage
 * @param {string} cle - Clé de stockage
 * @param {*} donnees - Données à sauvegarder
 */
function sauvegarderDansStockage(cle, donnees) {
    try {
        localStorage.setItem(cle, JSON.stringify(donnees));
    } catch (error) {
        console.error('Erreur lors de la sauvegarde dans le stockage local:', error);
    }
}

/**
 * Récupère des données du localStorage
 * @param {string} cle - Clé de stockage
 * @param {*} valeurParDefaut - Valeur par défaut si non trouvé
 * @returns {*} Données récupérées
 */
function recupererDuStockage(cle, valeurParDefaut = null) {
    try {
        const donnees = localStorage.getItem(cle);
        return donnees ? JSON.parse(donnees) : valeurParDefaut;
    } catch (error) {
        console.error('Erreur lors de la récupération du stockage local:', error);
        return valeurParDefaut;
    }
}

// === UTILITAIRES D'EXPORT ===

/**
 * Convertit un tableau d'objets en CSV
 * @param {Array} donnees - Données à convertir
 * @param {Array} colonnes - Colonnes à inclure
 * @returns {string} Contenu CSV
 */
function convertirEnCSV(donnees, colonnes = []) {
    if (donnees.length === 0) return '';
    
    const colonnesToutes = colonnes.length > 0 ? colonnes : Object.keys(donnees[0]);
    
    // En-têtes
    const entetes = colonnesToutes.join(',');
    
    // Lignes de données
    const lignes = donnees.map(item => {
        return colonnesToutes.map(col => {
            const valeur = obtenirValeurPropriete(item, col);
            // Échapper les guillemets et encapsuler si nécessaire
            const valeurStr = String(valeur || '');
            return valeurStr.includes(',') || valeurStr.includes('"') || valeurStr.includes('\n')
                ? `"${valeurStr.replace(/"/g, '""')}"`
                : valeurStr;
        }).join(',');
    });
    
    return [entetes, ...lignes].join('\n');
}

/**
 * Télécharge un fichier
 * @param {string} contenu - Contenu du fichier
 * @param {string} nomFichier - Nom du fichier
 * @param {string} typeMime - Type MIME
 */
function telechargerFichier(contenu, nomFichier, typeMime = 'text/plain') {
    const blob = new Blob([contenu], { type: typeMime });
    const url = URL.createObjectURL(blob);
    
    const lien = creerElement('a', {
        href: url,
        download: nomFichier,
        style: 'display: none;'
    });
    
    document.body.appendChild(lien);
    lien.click();
    document.body.removeChild(lien);
    
    // Libérer la mémoire
    setTimeout(() => URL.revokeObjectURL(url), 100);
}

// === UTILITAIRES DE DEBOUNCE ===

/**
 * Crée une fonction debounce
 * @param {Function} fonction - Fonction à debouncer
 * @param {number} delai - Délai en ms
 * @returns {Function} Fonction debouncée
 */
function creerDebounce(fonction, delai) {
    let timeoutId;
    return function (...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => fonction.apply(this, args), delai);
    };
}

// Rendre les fonctions disponibles globalement
if (typeof window !== 'undefined') {
    window.UtilitairesTogo = {
        formaterMontant,
        formaterDate,
        formaterNomComplet,
        capitaliserMots,
        formaterTelephone,
        validerEmail,
        validerTelephone,
        validerMontant,
        validerNom,
        validerDate,
        trierTableau,
        filtrerTableau,
        obtenirValeurPropriete,
        grouperTableau,
        calculerSomme,
        calculerMoyenne,
        calculerStatistiques,
        obtenirDebutMois,
        obtenirFinMois,
        calculerDifferenceJours,
        estDansPeriode,
        creerElement,
        afficherNotification,
        sauvegarderDansStockage,
        recupererDuStockage,
        convertirEnCSV,
        telechargerFichier,
        creerDebounce
    };
}