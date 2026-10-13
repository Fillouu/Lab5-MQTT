
/**
 * @file      app.js
 * @author    Felix Gladu
 * @version   2.0
 * @date      13 octobre 2026
 * @brief     Initialise le serveur Express, les routes,
 *            la connexion MQTT et Socket.io.
 */

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

// Initialisation Express
const app = express();
const PORT = 3000;

// Création du serveur HTTP
const server = http.createServer(app);

// Initialisation Socket.io
const io = new Server(server);

// Configuration EJS
app.set('view engine', 'ejs');
app.set('views', './views');

// Middlewares
app.use(express.static('./public'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes Express
app.use(require('./routes/index'));

// Initialisation du service MQTT
const mqttService = require('./services/mqttService');

// Transmettre Socket.io au service MQTT
mqttService.setSocketIO(io);

// Connexion des navigateurs avec Socket.io
io.on('connection', function(socket) {

    console.log('Client Socket.io connecté : ' + socket.id);

    // Déconnexion du navigateur
    socket.on('disconnect', function() {
        console.log('Client Socket.io déconnecté : ' + socket.id);
    });
});

// Démarrage du serveur
server.listen(PORT, function() {
    console.log('Serveur démarré sur http://localhost:' + PORT);
});

// Exportation pour les autres modules
module.exports = {
    app: app,
    server: server,
    io: io
};
