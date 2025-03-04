// Initialisation de l'application

import { initFilters } from './filters.js';
import RestaurantMaps from './maps.js';

document.addEventListener('DOMContentLoaded', () => {
    // Initialiser les filtres
    initFilters();

    // Initialiser la carte
    if (document.getElementById('map')) {
        RestaurantMaps.init('map');
    }

    // Charger la liste des restaurants
    loadRestaurants();
});

function loadRestaurants() {
    const restaurants = [
        {
            name: 'Kafkaf',
            cuisine: 'Middle Eastern',
            rating: 4.9,
            description: 'Brunch créatif et ambiance cosy'
        },
        {
            name: 'L\'Épicerie du Nord',
            cuisine: 'Indien',
            rating: 4.8,
            description: 'Cuisine traditionnelle indienne authentique'
        },
        {
            name: 'Saveurs d\'Orient',
            cuisine: 'Marocain/Libanais',
            rating: 4.8,
            description: 'Cuisine orientale dans le Passage des Panoramas'
        },
        {
            name: 'La Maison Mère',
            cuisine: 'Franco-Américain',
            rating: 4.7,
            description: 'Bistrot mi-parisien mi-new-yorkais'
        },
        {
            name: 'Dessance',
            cuisine: 'Gastronomique',
            rating: 4.7,
            description: 'Restaurant gastronomique primé dans le Marais'
        }
    ];

    const restaurantsList = document.getElementById('restaurants');
    if (restaurantsList) {
        restaurants.forEach(restaurant => {
            const restaurantEl = document.createElement('div');
            restaurantEl.classList.add('restaurant-card');
            restaurantEl.innerHTML = `
                <h3>${restaurant.name}</h3>
                <p>Cuisine : ${restaurant.cuisine}</p>
                <p>Note : ${restaurant.rating}/5</p>
                <p>${restaurant.description}</p>
            `;
            restaurantsList.appendChild(restaurantEl);
        });
    }
}