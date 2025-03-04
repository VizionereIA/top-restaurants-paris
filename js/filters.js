// Système de filtrage pour les restaurants
import { loadRestaurantsData } from './data.js';

// État des filtres actifs
let activeFilters = {
    cuisine: '',
    priceRange: '',
    minRating: 0,
    arrondissement: '',
    searchTerm: ''
};

// Fonction d'initialisation des filtres
export function initFilters() {
    const filtersContainer = document.getElementById('filters');
    if (!filtersContainer) return;

    // Création des filtres HTML
    filtersContainer.innerHTML = `
        <div class="filter-row">
            <div class="filter-group">
                <label for="cuisine-filter">Cuisine</label>
                <select id="cuisine-filter">
                    <option value="">Toutes les cuisines</option>
                    <option value="Middle Eastern">Moyen-Orient</option>
                    <option value="Indien">Indien</option>
                    <option value="Marocain/Libanais">Marocain/Libanais</option>
                    <option value="Franco-Américain">Franco-Américain</option>
                    <option value="Gastronomique">Gastronomique</option>
                </select>
            </div>
            <div class="filter-group">
                <label for="price-filter">Prix</label>
                <select id="price-filter">
                    <option value="">Tous les prix</option>
                    <option value="€">€ - Économique</option>
                    <option value="€€">€€ - Modéré</option>
                    <option value="€€€">€€€ - Élevé</option>
                </select>
            </div>
            <div class="filter-group">
                <label for="rating-filter">Note minimum</label>
                <select id="rating-filter">
                    <option value="0">Toutes les notes</option>
                    <option value="4">4★ et plus</option>
                    <option value="4.5">4.5★ et plus</option>
                    <option value="4.8">4.8★ et plus</option>
                </select>
            </div>
            <div class="filter-group">
                <label for="arrondissement-filter">Arrondissement</label>
                <select id="arrondissement-filter">
                    <option value="">Tous les arrondissements</option>
                    <option value="75002">Paris 2e</option>
                    <option value="75003">Paris 3e</option>
                    <option value="75009">Paris 9e</option>
                    <option value="75010">Paris 10e</option>
                    <option value="75011">Paris 11e</option>
                </select>
            </div>
        </div>
        <div class="filter-row">
            <div class="search-group">
                <input type="text" id="search-filter" placeholder="Rechercher un restaurant...">
                <button id="search-button"><i class="fas fa-search"></i></button>
            </div>
            <button id="reset-filters">Réinitialiser les filtres</button>
            <div id="result-count">5 restaurant(s) trouvé(s)</div>
        </div>
    `;

    // Ajout des écouteurs d'événements
    document.getElementById('cuisine-filter').addEventListener('change', updateFilters);
    document.getElementById('price-filter').addEventListener('change', updateFilters);
    document.getElementById('rating-filter').addEventListener('change', updateFilters);
    document.getElementById('arrondissement-filter').addEventListener('change', updateFilters);
    document.getElementById('search-filter').addEventListener('input', updateFilters);
    document.getElementById('reset-filters').addEventListener('click', resetFilters);

    // Appliquer les filtres initiaux
    applyFilters();
}

// Mettre à jour les filtres en fonction des sélections
function updateFilters(event) {
    const id = event.target.id;
    const value = event.target.value;

    switch (id) {
        case 'cuisine-filter':
            activeFilters.cuisine = value;
            break;
        case 'price-filter':
            activeFilters.priceRange = value;
            break;
        case 'rating-filter':
            activeFilters.minRating = parseFloat(value);
            break;
        case 'arrondissement-filter':
            activeFilters.arrondissement = value;
            break;
        case 'search-filter':
            activeFilters.searchTerm = value.toLowerCase();
            break;
    }

    applyFilters();
}

// Réinitialiser tous les filtres
function resetFilters() {
    // Réinitialiser les valeurs des sélecteurs
    document.getElementById('cuisine-filter').value = '';
    document.getElementById('price-filter').value = '';
    document.getElementById('rating-filter').value = '0';
    document.getElementById('arrondissement-filter').value = '';
    document.getElementById('search-filter').value = '';

    // Réinitialiser l'état des filtres
    activeFilters = {
        cuisine: '',
        priceRange: '',
        minRating: 0,
        arrondissement: '',
        searchTerm: ''
    };

    // Réappliquer les filtres
    applyFilters();
}

// Appliquer les filtres aux données
async function applyFilters() {
    const restaurants = await loadRestaurantsData();
    
    const filteredRestaurants = restaurants.filter(restaurant => {
        // Filtre par cuisine
        if (activeFilters.cuisine && restaurant.cuisine !== activeFilters.cuisine) {
            return false;
        }
        
        // Filtre par prix
        if (activeFilters.priceRange && restaurant.priceRange !== activeFilters.priceRange) {
            return false;
        }
        
        // Filtre par note minimale
        if (restaurant.rating < activeFilters.minRating) {
            return false;
        }
        
        // Filtre par arrondissement
        if (activeFilters.arrondissement && !restaurant.address.includes(activeFilters.arrondissement)) {
            return false;
        }
        
        // Filtre par terme de recherche
        if (activeFilters.searchTerm) {
            const searchTermLower = activeFilters.searchTerm.toLowerCase();
            return restaurant.name.toLowerCase().includes(searchTermLower) ||
                restaurant.description.toLowerCase().includes(searchTermLower);
        }
        
        return true;
    });
    
    // Mettre à jour l'affichage
    updateRestaurantsDisplay(filteredRestaurants);
    updateResultCount(filteredRestaurants.length);
}

// Mettre à jour l'affichage des restaurants
function updateRestaurantsDisplay(restaurants) {
    const restaurantsContainer = document.getElementById('restaurants');
    if (!restaurantsContainer) return;
    
    // Vider le conteneur
    restaurantsContainer.innerHTML = '';
    
    if (restaurants.length === 0) {
        restaurantsContainer.innerHTML = '<p class="no-results">Aucun restaurant ne correspond à vos critères.</p>';
        return;
    }
    
    // Créer une carte pour chaque restaurant
    restaurants.forEach(restaurant => {
        const card = document.createElement('div');
        card.className = 'restaurant-card';
        
        card.innerHTML = `
            <div class="restaurant-image" style="background-image: url('${restaurant.imageUrl}');">
                <span class="restaurant-price">${restaurant.priceRange}</span>
                <span class="restaurant-rating">${restaurant.rating}★</span>
            </div>
            <div class="restaurant-info">
                <h3>${restaurant.name}</h3>
                <p class="restaurant-cuisine">${restaurant.cuisine}</p>
                <p class="restaurant-description">${restaurant.description}</p>
                <a href="restaurant.html?id=${restaurant.id}" class="view-details">Voir détails</a>
            </div>
        `;
        
        restaurantsContainer.appendChild(card);
    });
}

// Mettre à jour le compteur de résultats
function updateResultCount(count) {
    const resultCount = document.getElementById('result-count');
    if (resultCount) {
        resultCount.textContent = `${count} restaurant(s) trouvé(s)`;
    }
}

// Exporter les fonctions nécessaires
export { applyFilters, resetFilters, activeFilters };