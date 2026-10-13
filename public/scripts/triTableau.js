
/**
 * @file      triTableau.js
 * @author    Felix Gladu
 * @version   1.0
 * @date      13 octobre 2026
 * @brief     Permet de trier les items du tableau HTML
 *            par ID, date de création, nom ou prix.
 */

document.addEventListener('DOMContentLoaded', function() {

    const tableau = document.querySelector('#tableau-items');

    if (!tableau) {
        return;
    }

    const entetes = tableau.querySelectorAll('thead th');
    const corps = tableau.querySelector('tbody');

    let colonneActive = -1;
    let ordreCroissant = true;

    // Parcourir les colonnes du tableau
    entetes.forEach(function(entete, index) {

        entete.style.cursor = 'pointer';

        entete.addEventListener('click', function() {

            // Inverser le tri si la même colonne est sélectionnée
            if (colonneActive === index) {
                ordreCroissant = !ordreCroissant;
            } else {
                colonneActive = index;
                ordreCroissant = true;
            }

            // Récupérer toutes les lignes
            const lignes = Array.from(
                corps.querySelectorAll('tr')
            );

            // Trier les lignes
            lignes.sort(function(ligneA, ligneB) {

                const celluleA = ligneA.cells[index];
                const celluleB = ligneB.cells[index];

                const valeurA = celluleA.dataset.sort
                    || celluleA.textContent.trim();

                const valeurB = celluleB.dataset.sort
                    || celluleB.textContent.trim();

                const type = entete.dataset.type || 'texte';

                let comparaison = 0;

                if (type === 'nombre' || type === 'date') {

                    const nombreA = Number(valeurA);
                    const nombreB = Number(valeurB);

                    comparaison = nombreA - nombreB;

                } else {

                    comparaison = valeurA.localeCompare(
                        valeurB,
                        'fr',
                        { sensitivity: 'base', numeric: true }
                    );
                }

                return ordreCroissant
                    ? comparaison
                    : -comparaison;
            });

            // Réinsérer les lignes dans le bon ordre
            lignes.forEach(function(ligne) {
                corps.appendChild(ligne);
            });

            // Mettre à jour les indicateurs de tri
            entetes.forEach(function(th) {
                th.removeAttribute('aria-sort');
            });

            entete.setAttribute(
                'aria-sort',
                ordreCroissant ? 'ascending' : 'descending'
            );

        });
    });
});
