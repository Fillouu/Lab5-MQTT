/**
 * @file      app.js
 * @author    Felix Gladu
 * @version   1.0
 * @date      13 octobre 2026
 * @brief     Configure et démarre le serveur Web Express
 *            du laboratoire 5.
 */

const PORT = 3000;

var express = require('express');

var app = express();

// Configuration du moteur de vues EJS
app.set('view engine', 'ejs');
app.set('views', './views');

// Configuration des fichiers statiques
app.use(express.static('./public'));

// Configuration pour recevoir les données
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Route principale
app.use(require('./routes/index'));

// Démarrage du serveur Web
let server = app.listen(PORT, function() {
    console.log('Serveur démarré sur http://localhost:' + PORT);
});

// Exportation de l'application
module.exports = { app: app };

