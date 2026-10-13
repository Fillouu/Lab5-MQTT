
/**
 * @file      index.js
 * @author    Felix Gladu
 * @version   1.1
 * @date      13 octobre 2026
 * @brief     Gère l'affichage des items et leur ajout
 *            à partir d'un formulaire HTML.
 */

var express = require('express');
var router = express.Router();

// Importation de la liste Singleton
const itemList = require('../models/itemList');

// Service MQTT
const mqttService = require('../services/mqttService');

// Affichage de la page principale
router.get('/', function(req, res, next) {
    res.render('pages/index', {
        title: 'Liste des items',
        items: itemList.obtenirItems(),
        erreur: null
    });
});

// Ajout d'un nouvel item
router.post('/ajouter', function(req, res, next) {
    const nom = String(req.body.nom || '').trim();
    const prix = Number(req.body.prix);

    // Validation des informations
    if (
        nom === '' ||
        req.body.prix === undefined ||
        String(req.body.prix).trim() === '' ||
        !Number.isFinite(prix) ||
        prix < 0
    ) {
        return res.status(400).render('pages/index', {
            title: 'Liste des items',
            items: itemList.obtenirItems(),
            erreur: 'Veuillez entrer un nom et un prix valide.'
        });
    }

    
    // Ajout de l'item dans la liste
    const nouvelItem = itemList.ajouterItem(nom, prix);

    // Publication de l'ajout sur MQTT
    const message = nouvelItem.nom + ';' + nouvelItem.prix;

    mqttService.publier('ITEM/WEB/NEW', message);

    // Retour à la page principale
    res.redirect('/');
});


/**
 * @brief Supprime un item à partir de son identifiant.
 *        Affiche un message d'erreur si l'ID est invalide
 *        ou si l'item n'existe pas.
 */

router.post('/supprimer/id', function(req, res, next) {

    const id = Number(req.body.id);

    // Validation de l'identifiant
    if (
        String(req.body.id || '').trim() === '' ||
        !Number.isSafeInteger(id) ||
        id <= 0
    ) {
        return res.status(400).render('pages/index', {
            title: 'Liste des items',
            items: itemList.obtenirItems(),
            erreur: 'Veuillez entrer un ID valide.'
        });
    }

    // Suppression de l'item
    const resultat = itemList.supprimerParId(id);

    // Vérification du résultat
    if (!resultat) {
        return res.status(404).render('pages/index', {
            title: 'Liste des items',
            items: itemList.obtenirItems(),
            erreur: "Aucun item trouvé avec l'ID " + id + "."
        });
    }

    
    // Publication MQTT après une suppression réussie
    mqttService.publier(
        'ITEM/WEB/DELETE/ID',
        String(id)
    );

    // Retour à la page principale
    res.redirect('/');
});


/**
 * @brief Supprime un item à partir de son nom.
 *        Affiche un message d'erreur si le nom
 *        est vide ou si l'item n'existe pas.
 */

router.post('/supprimer/nom', function(req, res, next) {

    const nom = String(req.body.nom || '').trim();

    // Vérification du nom
    if (nom === '') {
        return res.status(400).render('pages/index', {
            title: 'Liste des items',
            items: itemList.obtenirItems(),
            erreur: 'Veuillez entrer un nom valide.'
        });
    }

    // Suppression de l'item
    const resultat = itemList.supprimerParNom(nom);

    // Vérification du résultat
    if (!resultat) {
        return res.status(404).render('pages/index', {
            title: 'Liste des items',
            items: itemList.obtenirItems(),
            erreur: 'Aucun item trouvé avec le nom "' + nom + '".'
        });
    }

    
    // Publication MQTT après une suppression réussie
    mqttService.publier(
        'ITEM/WEB/DELETE/NAME',
        nom
    );

    // Retour à la page principale
    res.redirect('/');

});


module.exports = router;
