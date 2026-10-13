
/**
 * @file      itemList.js
 * @author    Felix Gladu
 * @version   1.0
 * @date      13 octobre 2026
 * @brief     Gère une liste d'items à l'aide du patron Singleton.
 *            Permet d'ajouter, supprimer, modifier et consulter
 *            les items de l'application.
 */

const Item = require('./item');

class ItemList {
    constructor() {
        // Vérifie si une instance existe déjà
        if (ItemList.instance) {
            return ItemList.instance;
        }

        // Initialisation de la liste
        this.items = [];
        this.prochainId = 1;

        // Items de démonstration
        this.ajouterItem('Clavier', 49.99);
        this.ajouterItem('Souris', 24.99);
        this.ajouterItem('Écran', 199.99);
        this.ajouterItem('Casque', 79.99);
        this.ajouterItem('Webcam', 59.99);

        // Conservation de l'instance unique
        ItemList.instance = this;
    }

    // Ajoute un nouvel item
    ajouterItem(nom, prix) {
        const item = new Item(this.prochainId, nom, prix);

        this.items.push(item);
        this.prochainId++;

        return item;
    }

    // Retourne tous les items
    obtenirItems() {
        return this.items;
    }

    // Recherche un item par son ID
    obtenirItemParId(id) {
        return this.items.find(item => item.id === Number(id));
    }

    // Supprime un item par son ID
    supprimerParId(id) {
        const index = this.items.findIndex(
            item => item.id === Number(id)
        );

        if (index === -1) {
            return false;
        }

        this.items.splice(index, 1);
        return true;
    }

    // Supprime le premier item correspondant au nom
    supprimerParNom(nom) {
        const index = this.items.findIndex(
            item => item.nom === nom
        );

        if (index === -1) {
            return false;
        }

        this.items.splice(index, 1);
        return true;
    }

    // Modifie le nom et le prix d'un item
    modifierItem(id, nom, prix) {
        const item = this.obtenirItemParId(id);

        if (!item) {
            return false;
        }

        item.nom = nom;
        item.prix = Number(prix);

        return true;
    }
}

// Exportation d'une instance unique
module.exports = new ItemList();
