
/**
 * @file      index.js
 * @author    Felix Gladu
 * @version   1.0
 * @date      13 octobre 2026
 * @brief     Gère la route principale et transmet
 *            la liste des items à la page d'accueil.
 */

var express = require('express');
var router = express.Router();

// Importation de la liste Singleton
const itemList = require('../models/itemList');

// Route principale
router.get('/', function(req, res, next) {
    res.render('pages/index', {
        title: 'Liste des items',
        items: itemList.obtenirItems()
    });
});

module.exports = router;
