
/**
 * @file      socket.js
 * @author    Felix Gladu
 * @version   1.0
 * @date      13 octobre 2026
 * @brief     Gère la connexion Socket.io entre
 *            le navigateur et le serveur Node.js.
 */

// Connexion au serveur Socket.io
const socket = io();

// Connexion réussie
socket.on('connect', function() {

    console.log(
        'Socket.io connecté au serveur : ' + socket.id
    );

});

// Déconnexion du serveur
socket.on('disconnect', function() {

    console.log('Socket.io déconnecté du serveur.');

});

// Gestion des erreurs de connexion
socket.on('connect_error', function(erreur) {

    console.error(
        'Erreur de connexion Socket.io :',
        erreur.message
    );

});


/**
 * @brief Actualise la page lorsque la liste
 *        des items est modifiée par MQTT.
 */

socket.on('itemsUpdated', function() {

    console.log('Liste modifiée par MQTT.');

    // Recharger la page pour afficher la nouvelle liste
    window.location.reload();

});
