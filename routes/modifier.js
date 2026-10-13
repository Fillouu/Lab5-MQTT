
/**
 * @file      modifier.js
 * @author    Felix Gladu
 * @version   1.0
 * @date      13 octobre 2026
 * @brief     Gère la modification des items et publie
 *            les modifications sur MQTT.
 */

const express = require('express');
const router = express.Router();

const itemList = require('../models/itemList');
const mqttService = require('../services/mqttService');

/**
 * @brief Modifie le nom et le prix d'un item existant.
 */
router.post('/', function(req, res) {

    const id = Number(req.body.id);
    const nom = String(req.body.nom || '').trim();
    const prix = Number(req.body.prix);

    // Validation des informations
    if (
        String(req.body.id || '').trim() === '' ||
        !Number.isSafeInteger(id) ||
        id <= 0 ||
        nom === '' ||
        req.body.prix === undefined ||
        String(req.body.prix).trim() === '' ||
        !Number.isFinite(prix) ||
        prix < 0
    ) {
        return res.status(400).render('pages/index', {
            title: 'Liste des items',
            items: itemList.obtenirItems(),
            erreur: 'Veuillez entrer un ID, un nom et un prix valides.'
        });
    }

    // Modifier l'item dans la liste
    const resultat = itemList.modifierItem(id, nom, prix);

    // Vérifier si l'item existe
    if (!resultat) {
        return res.status(404).render('pages/index', {
            title: 'Liste des items',
            items: itemList.obtenirItems(),
            erreur: "Aucun item trouvé avec l'ID " + id + "."
        });
    }

    // Préparer le message MQTT
    const messageMQTT = id + ';' + nom + ';' + prix;

    // Publier la modification sur MQTT
    mqttService.publier('ITEM/WEB/MODIFY', messageMQTT);

    console.log('Modification MQTT publiée : ' + messageMQTT);

    // Retourner à la page principale
    res.redirect('/');
});

module.exports = router;
