
/**
 * @file      mqttService.js
 * @author    Felix Gladu
 * @version   1.0
 * @date      13 octobre 2026
 * @brief     Gère la connexion au broker Mosquitto,
 *            les abonnements et les messages MQTT.
 */

const mqtt = require('mqtt');

// Importation de la liste Singleton
const itemList = require('../models/itemList');

// Adresse du broker MQTT
const BROKER_URL = 'mqtt://localhost:1883';

// Connexion au broker
const client = mqtt.connect(BROKER_URL);

// Topics reçus du module externe
const TOPICS = [
    'ITEM/MODULE/NEW',
    'ITEM/MODULE/DELETE/ID',
    'ITEM/MODULE/DELETE/NAME'
];

// Connexion réussie
client.on('connect', function() {

    console.log('MQTT connecté au broker Mosquitto.');

    // Abonnement aux topics
    client.subscribe(TOPICS, function(erreur) {

        if (erreur) {
            console.error(
                'Erreur abonnement MQTT :',
                erreur.message
            );
            return;
        }

        console.log('Abonnements MQTT réussis.');
    });
});

// Réception des messages MQTT
client.on('message', function(topic, message) {

    const contenu = message.toString();

    console.log('MQTT reçu :', topic, contenu);

    switch (topic) {

        case 'ITEM/MODULE/NEW': {

            // Format provisoire : nom;prix
            const parties = contenu.split(';');

            if (parties.length !== 2) {
                console.log('Format item invalide.');
                return;
            }

            const nom = parties[0].trim();
            const prix = Number(parties[1]);

            if (
                nom === '' ||
                parties[1].trim() === '' ||
                !Number.isFinite(prix) ||
                prix < 0
            ) {
                console.log('Données item invalides.');
                return;
            }

            itemList.ajouterItem(nom, prix);

            console.log('Item ajouté depuis MQTT.');
            break;
        }

        case 'ITEM/MODULE/DELETE/ID': {

            const id = Number(contenu);

            if (!Number.isSafeInteger(id) || id <= 0) {
                console.log('ID MQTT invalide.');
                return;
            }

            const resultat = itemList.supprimerParId(id);

            console.log(
                resultat
                    ? 'Item supprimé par ID.'
                    : 'ID introuvable.'
            );

            break;
        }

        case 'ITEM/MODULE/DELETE/NAME': {

            const nom = contenu.trim();

            if (nom === '') {
                console.log('Nom MQTT invalide.');
                return;
            }

            const resultat = itemList.supprimerParNom(nom);

            console.log(
                resultat
                    ? 'Item supprimé par nom.'
                    : 'Nom introuvable.'
            );

            break;
        }
    }
});

// Gestion des erreurs
client.on('error', function(erreur) {
    console.error('Erreur MQTT :', erreur.message);
});

// Gestion de la déconnexion
client.on('offline', function() {
    console.log('MQTT hors ligne.');
});

// Publication d'un message MQTT
function publier(topic, message) {

    if (!client.connected) {
        console.error('Publication impossible : MQTT déconnecté.');
        return false;
    }

    client.publish(topic, String(message));
    return true;
}

module.exports = {
    client,
    publier
};
