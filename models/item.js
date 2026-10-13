
/**
 * @file      item.js
 * @author    Felix Gladu
 * @version   1.0
 * @date      13 octobre 2026
 * @brief     Définit la classe Item permettant de représenter
 *            un élément avec un ID, une date de création,
 *            un nom et un prix.
 */

class Item {
    constructor(id, nom, prix) {
        this.id = id;
        this.dateCreation = new Date();
        this.nom = nom;
        this.prix = prix;
    }

    // Retourne les informations de l'item
    getInfo() {
        return {
            id: this.id,
            dateCreation: this.dateCreation,
            nom: this.nom,
            prix: this.prix
        };
    }
}

// Exportation de la classe
module.exports = Item;
