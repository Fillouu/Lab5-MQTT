
/**
 * @file      supprimer.js
 * @author    Felix Gladu
 * @version   1.0
 * @date      13 octobre 2026
 * @brief     Gère la suppression des items par ID ou par nom
 *            et publie les suppressions sur MQTT.
 */

const express = require('express');
const router = express.Router();

const itemList = require('../models/itemList');
const mqttService = require('../services/mqttService');

/**
 * @brief Supprime un item à partir de son ID.
 */
router.post('/id', function (req, res) {

    const id = Number(req.body.id);

    // Valider l'identifiant
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

    // Supprimer l'item
    const resultat = itemList.supprimerParId(id);

    if (!resultat) {
        return res.status(404).render('pages/index', {
            title: 'Liste des items',
            items: itemList.obtenirItems(),
            erreur: "Aucun item trouvé avec l'ID " + id + "."
        });
        console.log('Suppression impossible : ID ' + id + ' introuvable');
    }

    // Publier la suppression sur MQTT
    mqttService.publier('ITEM/WEB/DELETE/ID', String(id));

    // Retourner à la page principale
    res.redirect('/');
});

/**
 * @brief Supprime un item à partir de son nom.
 */
router.post('/nom', function (req, res) {

    const nom = String(req.body.nom || '').trim();

    // Valider le nom
    if (nom === '') {
        return res.status(400).render('pages/index', {
            title: 'Liste des items',
            items: itemList.obtenirItems(),
            erreur: 'Veuillez entrer un nom valide.'
        });
    }

    // Supprimer l'item
    const resultat = itemList.supprimerParNom(nom);

    if (!resultat) {
        return res.status(404).render('pages/index', {
            title: 'Liste des items',
            items: itemList.obtenirItems(),
            erreur: "Aucun item trouvé avec le nom '" + nom + "'."
        });
        console.log('Suppression impossible : nom "' + nom + '" introuvable');
    }

    // Publier la suppression sur MQTT
    mqttService.publier('ITEM/WEB/DELETE/NAME', nom);

    // Retourner à la page principale
    res.redirect('/');
});

module.exports = router;
