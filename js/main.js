// Script principal de l'application

import { initFilters } from './filters.js';
import RestaurantMaps from './maps.js';
import { initThemeToggle } from './theme-toggle.js';
import { loadRestaurantsData, getRestaurantById } from './data.js';

// Initialisation au chargement de la page
document.addEventListener('DOMContentLoaded', async () => {
    // Initialiser le thème
    initThemeToggle();
    
    // Détecter la page courante
    const currentPage = getCurrentPage();
    
    if (currentPage === 'home') {
        // Page d'accueil
        initHomePage();
    } else if (currentPage === 'restaurant') {
        // Page de détail d'un restaurant
        await initRestaurantPage();
    }
});

// Déterminer la page actuelle
function getCurrentPage() {
    const path = window.location.pathname;
    if (path.includes('restaurant.html')) {
        return 'restaurant';
    }
    return 'home';
}

// Initialiser la page d'accueil
async function initHomePage() {
    // Initialiser les filtres
    initFilters();
    
    // Initialiser la carte
    if (document.getElementById('map')) {
        RestaurantMaps.init('map');
    }
    
    // Charger et afficher les restaurants
    const restaurants = await loadRestaurantsData();
    displayRestaurants(restaurants);
}

// Initialiser la page de détail d'un restaurant
async function initRestaurantPage() {
    // Récupérer l'ID du restaurant depuis l'URL
    const urlParams = new URLSearchParams(window.location.search);
    const restaurantId = urlParams.get('id');
    
    if (!restaurantId) {
        showError('Restaurant non trouvé');
        return;
    }
    
    // Récupérer les données du restaurant
    const restaurant = await getRestaurantById(restaurantId);
    
    if (!restaurant) {
        showError('Restaurant non trouvé');
        return;
    }
    
    // Afficher les détails du restaurant
    displayRestaurantDetails(restaurant);
    
    // Initialiser la carte du restaurant
    if (document.getElementById('restaurant-map')) {
        RestaurantMaps.initSingle('restaurant-map', restaurant);
    }
    
    // Initialiser le formulaire de réservation
    initReservationForm(restaurant);
}

// Afficher les restaurants sur la page d'accueil
function displayRestaurants(restaurants) {
    const restaurantsContainer = document.getElementById('restaurants');
    if (!restaurantsContainer) return;
    
    restaurantsContainer.innerHTML = '';
    
    restaurants.forEach(restaurant => {
        const card = createRestaurantCard(restaurant);
        restaurantsContainer.appendChild(card);
    });
}

// Créer une carte de restaurant
function createRestaurantCard(restaurant) {
    const card = document.createElement('div');
    card.className = 'restaurant-card';
    
    // Image du restaurant avec fallback
    const imageUrl = restaurant.imageUrl || 'img/placeholder-restaurant.jpg';
    
    card.innerHTML = `
        <div class="restaurant-image" style="background-image: url('${imageUrl}');">
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
    
    return card;
}

// Afficher les détails d'un restaurant sur sa page dédiée
function displayRestaurantDetails(restaurant) {
    const detailsContainer = document.getElementById('restaurant-details');
    if (!detailsContainer) return;
    
    // Mettre à jour le titre de la page
    document.title = `${restaurant.name} - Top Restaurants de Paris`;
    
    // Image principale avec fallback
    const mainImageUrl = restaurant.imageUrl || 'img/placeholder-restaurant.jpg';
    
    // Construire la section des horaires
    let hoursHtml = '';
    if (restaurant.openingHours) {
        hoursHtml = `
            <div class="opening-hours">
                <h3>Horaires d'ouverture</h3>
                <ul>
                    <li><span>Lundi:</span> ${restaurant.openingHours.monday || 'Fermé'}</li>
                    <li><span>Mardi:</span> ${restaurant.openingHours.tuesday || 'Fermé'}</li>
                    <li><span>Mercredi:</span> ${restaurant.openingHours.wednesday || 'Fermé'}</li>
                    <li><span>Jeudi:</span> ${restaurant.openingHours.thursday || 'Fermé'}</li>
                    <li><span>Vendredi:</span> ${restaurant.openingHours.friday || 'Fermé'}</li>
                    <li><span>Samedi:</span> ${restaurant.openingHours.saturday || 'Fermé'}</li>
                    <li><span>Dimanche:</span> ${restaurant.openingHours.sunday || 'Fermé'}</li>
                </ul>
            </div>
        `;
    }
    
    // Construire la section des spécialités
    let specialtiesHtml = '';
    if (restaurant.specialties && restaurant.specialties.length > 0) {
        const specialtiesItems = restaurant.specialties
            .map(specialty => `<li>${specialty}</li>`)
            .join('');
            
        specialtiesHtml = `
            <div class="specialties">
                <h3>Nos spécialités</h3>
                <ul>${specialtiesItems}</ul>
            </div>
        `;
    }
    
    // Construire la galerie d'images
    let galleryHtml = '';
    if (restaurant.galleryImages && restaurant.galleryImages.length > 0) {
        const galleryItems = restaurant.galleryImages
            .map(image => `<div class="gallery-item" style="background-image: url('${image}');"></div>`)
            .join('');
            
        galleryHtml = `
            <div class="restaurant-gallery">
                <h3>Galerie</h3>
                <div class="gallery-container">${galleryItems}</div>
            </div>
        `;
    }
    
    // Construire la section des avis
    let reviewsHtml = '';
    if (restaurant.reviews && restaurant.reviews.length > 0) {
        const reviewItems = restaurant.reviews
            .map(review => `
                <div class="review-item">
                    <div class="review-header">
                        <span class="review-author">${review.author}</span>
                        <span class="review-rating">${review.rating}★</span>
                        <span class="review-date">${review.date}</span>
                    </div>
                    <p class="review-content">${review.content}</p>
                </div>
            `)
            .join('');
            
        reviewsHtml = `
            <div class="restaurant-reviews">
                <h3>Avis clients</h3>
                <div class="reviews-container">${reviewItems}</div>
            </div>
        `;
    }
    
    // Assembler le HTML complet
    detailsContainer.innerHTML = `
        <div class="restaurant-header">
            <div class="main-image" style="background-image: url('${mainImageUrl}');">
                <div class="restaurant-badges">
                    <span class="restaurant-price">${restaurant.priceRange}</span>
                    <span class="restaurant-rating">${restaurant.rating}★</span>
                </div>
            </div>
            <div class="restaurant-title">
                <h1>${restaurant.name}</h1>
                <p class="restaurant-cuisine">${restaurant.cuisine}</p>
                <p class="restaurant-address">${restaurant.address}</p>
                <div class="restaurant-contacts">
                    <a href="tel:${restaurant.phone}" class="contact-phone">${restaurant.phone}</a>
                    <a href="${restaurant.website}" target="_blank" class="contact-website">Visiter le site web</a>
                </div>
            </div>
        </div>
        
        <div class="restaurant-content">
            <div class="restaurant-description">
                <h3>À propos</h3>
                <p>${restaurant.longDescription || restaurant.description}</p>
            </div>
            
            <div class="restaurant-details">
                ${specialtiesHtml}
                ${hoursHtml}
            </div>
            
            ${galleryHtml}
            
            <div class="restaurant-location">
                <h3>Emplacement</h3>
                <div id="restaurant-map" class="single-map"></div>
            </div>
            
            ${reviewsHtml}
            
            <div class="reservation-section">
                <h3>Réserver une table</h3>
                <form id="reservation-form" class="reservation-form">
                    <div class="form-group">
                        <label for="reservation-name">Nom</label>
                        <input type="text" id="reservation-name" required>
                    </div>
                    <div class="form-group">
                        <label for="reservation-email">Email</label>
                        <input type="email" id="reservation-email" required>
                    </div>
                    <div class="form-group">
                        <label for="reservation-phone">Téléphone</label>
                        <input type="tel" id="reservation-phone" required>
                    </div>
                    <div class="form-group">
                        <label for="reservation-date">Date</label>
                        <input type="date" id="reservation-date" required>
                    </div>
                    <div class="form-group">
                        <label for="reservation-time">Heure</label>
                        <input type="time" id="reservation-time" required>
                    </div>
                    <div class="form-group">
                        <label for="reservation-guests">Nombre de personnes</label>
                        <select id="reservation-guests" required>
                            <option value="1">1 personne</option>
                            <option value="2" selected>2 personnes</option>
                            <option value="3">3 personnes</option>
                            <option value="4">4 personnes</option>
                            <option value="5">5 personnes</option>
                            <option value="6">6 personnes</option>
                            <option value="7">7 personnes</option>
                            <option value="8">8+ personnes</option>
                        </select>
                    </div>
                    <div class="form-group full-width">
                        <label for="reservation-notes">Remarques spéciales</label>
                        <textarea id="reservation-notes" rows="3"></textarea>
                    </div>
                    <button type="submit" id="submit-reservation">Réserver maintenant</button>
                </form>
            </div>
        </div>
        
        <div class="back-to-list">
            <a href="index.html">← Retour à la liste des restaurants</a>
        </div>
    `;
    
    // Ajouter les écouteurs d'événements pour la galerie
    initGallery();
}

// Initialiser le formulaire de réservation
function initReservationForm(restaurant) {
    const form = document.getElementById('reservation-form');
    if (!form) return;
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Collecter les données du formulaire
        const formData = {
            name: document.getElementById('reservation-name').value,
            email: document.getElementById('reservation-email').value,
            phone: document.getElementById('reservation-phone').value,
            date: document.getElementById('reservation-date').value,
            time: document.getElementById('reservation-time').value,
            guests: document.getElementById('reservation-guests').value,
            notes: document.getElementById('reservation-notes').value,
            restaurant: restaurant.name,
            restaurantId: restaurant.id
        };
        
        // Simuler une soumission réussie
        showReservationConfirmation(formData);
    });
}

// Afficher la confirmation de réservation
function showReservationConfirmation(formData) {
    // Créer l'élément de confirmation
    const confirmation = document.createElement('div');
    confirmation.className = 'reservation-confirmation';
    
    // Formater la date
    const reservationDate = new Date(`${formData.date}T${formData.time}`);
    const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    const formattedDate = reservationDate.toLocaleDateString('fr-FR', dateOptions);
    
    // Construire le contenu
    confirmation.innerHTML = `
        <h3>Réservation confirmée !</h3>
        <p><strong>Restaurant :</strong> ${formData.restaurant}</p>
        <p><strong>Date et heure :</strong> ${formattedDate}</p>
        <p><strong>Nombre de personnes :</strong> ${formData.guests}</p>
        <p><strong>Au nom de :</strong> ${formData.name}</p>
        <p>Un email de confirmation a été envoyé à ${formData.email}</p>
        <button id="close-confirmation">Fermer</button>
    `;
    
    // Ajouter au document
    document.body.appendChild(confirmation);
    
    // Afficher avec une animation
    setTimeout(() => {
        confirmation.classList.add('show');
    }, 10);
    
    // Ajouter un écouteur pour fermer
    document.getElementById('close-confirmation').addEventListener('click', () => {
        confirmation.classList.remove('show');
        setTimeout(() => {
            confirmation.remove();
        }, 300);
    });
}

// Initialiser la galerie d'images
function initGallery() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    if (galleryItems.length === 0) return;
    
    galleryItems.forEach(item => {
        item.addEventListener('click', function() {
            const backgroundImage = this.style.backgroundImage;
            const imageUrl = backgroundImage.slice(backgroundImage.indexOf('(') + 1, backgroundImage.indexOf(')'));
            
            // Créer la vue agrandie
            const lightbox = document.createElement('div');
            lightbox.className = 'lightbox';
            lightbox.innerHTML = `
                <div class="lightbox-content">
                    <img src=${imageUrl.replace(/['"]/g, '')} alt="Vue agrandie">
                    <button class="lightbox-close">&times;</button>
                </div>
            `;
            
            // Ajouter au document
            document.body.appendChild(lightbox);
            
            // Bloquer le défilement du corps
            document.body.style.overflow = 'hidden';
            
            // Ajouter un écouteur pour fermer
            lightbox.addEventListener('click', function(e) {
                if (e.target === lightbox || e.target.classList.contains('lightbox-close')) {
                    document.body.style.overflow = '';
                    lightbox.remove();
                }
            });
        });
    });
}

// Afficher un message d'erreur
function showError(message) {
    const container = document.getElementById('restaurant-details') || document.getElementById('app');
    if (container) {
        container.innerHTML = `
            <div class="error-message">
                <h2>Erreur</h2>
                <p>${message}</p>
                <a href="index.html" class="back-link">Retour à la liste des restaurants</a>
            </div>
        `;
    }
}

export { displayRestaurants };