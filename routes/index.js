
/**
 * @file      index.js
 * @author    Felix Gladu
 * @version   1.0
 * @date      13 octobre 2026
 * @brief     Gère la route principale et affiche
 *            la liste des items dans la page d'accueil.
 */

const express = require('express');
const router = express.Router();

const itemList = require('../models/itemList');

/**
 * @brief Affiche la page principale avec tous les items.
 */
router.get('/', function(req, res) {

    res.render('pages/index', {
        title: 'Liste des items',
        items: itemList.obtenirItems(),
        erreur: null
    });

});

module.exports = router;
