
/**
 * @file      ajouter.js
 * @author    Felix Gladu
 * @version   1.0
 * @date      13 octobre 2026
 * @brief     Gère l'ajout des items et publie
 *            les nouveaux items sur MQTT.
 */

const express = require('express');
const router = express.Router();

const itemList = require('../models/itemList');
const mqttService = require('../services/mqttService');

/**
 * @brief Ajoute un nouvel item dans la liste.
 */
router.post('/', function(req, res) {

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
            erreur: 'Veuillez entrer un nom et un prix valides.'
        });
    }

    // Ajouter l'item dans la liste
    const nouvelItem = itemList.ajouterItem(nom, prix);

    // Publier le nouvel item sur MQTT
    const messageMQTT = nouvelItem.nom + ';' + nouvelItem.prix;

    mqttService.publier('ITEM/WEB/NEW', messageMQTT);

    // Retourner à la page principale
    res.redirect('/');
});

module.exports = router;
