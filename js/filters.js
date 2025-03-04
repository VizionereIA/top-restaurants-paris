// Système de filtrage pour les restaurants

// Données des restaurants (à terme, à récupérer dynamiquement)
const restaurants = [
    {
        name: 'Kafkaf',
        cuisine: 'Middle Eastern',
        ambiance: 'Cozy',
        priceRange: '€€',
        rating: 4.5,
        location: 'Paris 10e'
    },
    {
        name: 'Epicerie du Nord',
        cuisine: 'Français',
        ambiance: 'Authentique',
        priceRange: '€€€',
        rating: 4.7,
        location: 'Paris 9e'
    },
    // ... autres restaurants
];

// Liste des filtres disponibles
const filterOptions = {
    cuisines: ['Middle Eastern', 'Français', 'Indien', 'Marocain', 'Libanais'],
    ambiances: ['Cozy', 'Authentique', 'Élégant'],
    priceRanges: ['€', '€€', '€€€'],
    ratings: [3, 4, 4.5, 5],
    locations: ['Paris 9e', 'Paris 10e', 'Paris 11e', 'Paris 12e']
};

// État des filtres actifs
let activeFilters = {
    cuisine: null,
    ambiance: null,
    priceRange: null,
    minRating: null,
    location: null
};

// Fonction de filtrage
function filterRestaurants() {
    const filteredRestaurants = restaurants.filter(restaurant => {
        // Vérification de chaque critère de filtre
        const cuisineMatch = !activeFilters.cuisine || restaurant.cuisine === activeFilters.cuisine;
        const ambianceMatch = !activeFilters.ambiance || restaurant.ambiance === activeFilters.ambiance;
        const priceRangeMatch = !activeFilters.priceRange || restaurant.priceRange === activeFilters.priceRange;
        const ratingMatch = !activeFilters.minRating || restaurant.rating >= activeFilters.minRating;
        const locationMatch = !activeFilters.location || restaurant.location === activeFilters.location;

        return cuisineMatch && ambianceMatch && priceRangeMatch && ratingMatch && locationMatch;
    });

    // Mise à jour de l'affichage
    updateRestaurantDisplay(filteredRestaurants);
}

// Fonction pour mettre à jour l'affichage des restaurants
function updateRestaurantDisplay(filteredRestaurants) {
    const restaurantContainer = document.getElementById('restaurant-list');
    restaurantContainer.innerHTML = ''; // Vider la liste actuelle

    filteredRestaurants.forEach(restaurant => {
        const restaurantElement = createRestaurantElement(restaurant);
        restaurantContainer.appendChild(restaurantElement);
    });

    // Mise à jour du compteur de résultats
    updateResultCount(filteredRestaurants.length);
}

// Créer un élément HTML pour un restaurant
function createRestaurantElement(restaurant) {
    const div = document.createElement('div');
    div.classList.add('restaurant-card');
    div.innerHTML = `
        <h3>${restaurant.name}</h3>
        <p>Cuisine: ${restaurant.cuisine}</p>
        <p>Ambiance: ${restaurant.ambiance}</p>
        <p>Prix: ${restaurant.priceRange}</p>
        <p>Note: ${restaurant.rating}/5</p>
        <p>Lieu: ${restaurant.location}</p>
    `;
    return div;
}

// Mettre à jour le compteur de résultats
function updateResultCount(count) {
    const resultCounter = document.getElementById('result-count');
    resultCounter.textContent = `${count} restaurant(s) trouvé(s)`;
}

// Initialiser les écouteurs d'événements pour les filtres
function initializeFilterListeners() {
    // Filtres par cuisine
    const cuisineSelect = document.getElementById('cuisine-filter');
    cuisineSelect.addEventListener('change', (e) => {
        activeFilters.cuisine = e.target.value || null;
        filterRestaurants();
    });

    // Filtres par ambiance
    const ambianceSelect = document.getElementById('ambiance-filter');
    ambianceSelect.addEventListener('change', (e) => {
        activeFilters.ambiance = e.target.value || null;
        filterRestaurants();
    });

    // Filtres par gamme de prix
    const priceRangeSelect = document.getElementById('price-filter');
    priceRangeSelect.addEventListener('change', (e) => {
        activeFilters.priceRange = e.target.value || null;
        filterRestaurants();
    });

    // Filtres par note minimale
    const ratingSelect = document.getElementById('rating-filter');
    ratingSelect.addEventListener('change', (e) => {
        activeFilters.minRating = e.target.value ? parseFloat(e.target.value) : null;
        filterRestaurants();
    });

    // Filtres par lieu
    const locationSelect = document.getElementById('location-filter');
    locationSelect.addEventListener('change', (e) => {
        activeFilters.location = e.target.value || null;
        filterRestaurants();
    });

    // Bouton de réinitialisation
    const resetButton = document.getElementById('reset-filters');
    resetButton.addEventListener('click', resetFilters);
}

// Réinitialiser tous les filtres
function resetFilters() {
    // Réinitialiser l'objet des filtres actifs
    activeFilters = {
        cuisine: null,
        ambiance: null,
        priceRange: null,
        minRating: null,
        location: null
    };

    // Réinitialiser les éléments de sélection
    document.getElementById('cuisine-filter').selectedIndex = 0;
    document.getElementById('ambiance-filter').selectedIndex = 0;
    document.getElementById('price-filter').selectedIndex = 0;
    document.getElementById('rating-filter').selectedIndex = 0;
    document.getElementById('location-filter').selectedIndex = 0;

    // Réafficher tous les restaurants
    filterRestaurants();
}

// Initialisation au chargement de la page
document.addEventListener('DOMContentLoaded', () => {
    initializeFilterListeners();
    filterRestaurants(); // Afficher tous les restaurants initialement
});

// Exporter pour des tests potentiels
export { 
    filterRestaurants, 
    resetFilters, 
    filterOptions, 
    activeFilters 
};