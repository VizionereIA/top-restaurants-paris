/**
 * Intégration de Google Maps pour visualiser les emplacements des restaurants
 * 
 * Ce script permet de :
 * - Afficher une carte avec les emplacements des 5 restaurants
 * - Créer des marqueurs personnalisés pour chaque restaurant
 * - Afficher des infobulles au survol/clic sur un marqueur
 * - Proposer des liens vers Google Maps pour obtenir des itinéraires
 */

// Coordonnées des restaurants (format: [latitude, longitude])
const restaurantLocations = {
  'kafkaf': [48.853686, 2.379717], // 7 Rue Keller, 75011 Paris
  'epicerie-du-nord': [48.880778, 2.355531], // Quartier Gare du Nord, 75010 Paris
  'saveurs-orient': [48.867973, 2.341824], // Passage des Panoramas, 75002 Paris
  'maison-mere': [48.877296, 2.345905], // 7 rue Mayran, 75009 Paris
  'dessance': [48.859495, 2.362176]  // Le Marais, 75003 Paris
};

// Informations des restaurants
const restaurantInfo = {
  'kafkaf': {
    name: 'Kafkaf',
    address: '7 Rue Keller, 75011 Paris',
    rating: 4.9,
    cuisine: 'Middle Eastern',
    priceRange: '€€',
    phone: '01 43 55 77 52',
    url: 'restaurants/kafkaf.html'
  },
  'epicerie-du-nord': {
    name: 'L\'Épicerie du Nord',
    address: 'Quartier Gare du Nord, 75010 Paris',
    rating: 4.8,
    cuisine: 'Indien',
    priceRange: '€€',
    phone: '01 XX XX XX XX',
    url: '#'
  },
  'saveurs-orient': {
    name: 'Saveurs d\'Orient',
    address: 'Passage des Panoramas, 75002 Paris',
    rating: 4.8,
    cuisine: 'Marocain/Libanais',
    priceRange: '€€',
    phone: '01 42 21 55 25',
    url: '#'
  },
  'maison-mere': {
    name: 'La Maison Mère',
    address: '7 rue Mayran, 75009 Paris',
    rating: 4.7,
    cuisine: 'Franco-Américain',
    priceRange: '€€-€€€',
    phone: '01 42 80 03 02',
    url: '#'
  },
  'dessance': {
    name: 'Dessance',
    address: 'Le Marais, 75003 Paris',
    rating: 4.7,
    cuisine: 'Gastronomique',
    priceRange: '€€€',
    phone: '01 42 77 23 62',
    url: '#'
  }
};

// Instance de la carte Google Maps
let map;

// Collection des marqueurs
let markers = [];

// État de l'infobulle active
let activeInfoWindow = null;

/**
 * Initialise la carte Google Maps
 */
function initMap() {
  // Coordonnées du centre de Paris
  const parisCenter = { lat: 48.865, lng: 2.35 };
  
  // Options de la carte
  const mapOptions = {
    center: parisCenter,
    zoom: 13,
    mapId: 'restaurant-map',
    mapTypeControl: false,
    fullscreenControl: true,
    streetViewControl: false,
    zoomControl: true,
    styles: [
      {
        "featureType": "poi.business",
        "stylers": [
          { "visibility": "off" }
        ]
      },
      {
        "featureType": "transit",
        "elementType": "labels.icon",
        "stylers": [
          { "visibility": "off" }
        ]
      }
    ]
  };
  
  // Créer la carte
  map = new google.maps.Map(document.getElementById("map"), mapOptions);
  
  // Ajouter les marqueurs des restaurants
  addRestaurantMarkers();
  
  // Centrer la carte pour afficher tous les marqueurs
  fitMapToMarkers();
}

/**
 * Ajoute les marqueurs des restaurants sur la carte
 */
function addRestaurantMarkers() {
  Object.keys(restaurantLocations).forEach(id => {
    const [lat, lng] = restaurantLocations[id];
    const restaurantData = restaurantInfo[id];
    
    // Créer le marqueur
    const marker = new google.maps.Marker({
      position: { lat, lng },
      map: map,
      title: restaurantData.name,
      icon: {
        url: `data:image/svg+xml;utf-8,${encodeURIComponent(createMarkerSvg(restaurantData.rating))}`,
        scaledSize: new google.maps.Size(40, 40),
        anchor: new google.maps.Point(20, 40),
      },
      animation: google.maps.Animation.DROP,
      optimized: false
    });
    
    // Créer l'infobulle
    const infoWindow = createInfoWindow(id, restaurantData);
    
    // Ajouter l'événement de clic sur le marqueur
    marker.addListener('click', () => {
      // Fermer l'infobulle active
      if (activeInfoWindow) {
        activeInfoWindow.close();
      }
      
      // Ouvrir la nouvelle infobulle
      infoWindow.open(map, marker);
      activeInfoWindow = infoWindow;
    });
    
    // Stocker le marqueur dans le tableau
    markers.push(marker);
  });
}

/**
 * Crée un SVG personnalisé pour le marqueur
 */
function createMarkerSvg(rating) {
  const color = getRatingColor(rating);
  
  return `
    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40">
      <defs>
        <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="0" dy="1" stdDeviation="2" flood-color="#000" flood-opacity="0.3" />
        </filter>
      </defs>
      <circle cx="20" cy="20" r="15" fill="${color}" filter="url(#shadow)" />
      <circle cx="20" cy="20" r="12" fill="white" />
      <text x="20" y="24" font-family="Arial" font-size="12" font-weight="bold" text-anchor="middle" fill="#333">${rating}</text>
    </svg>
  `;
}

/**
 * Retourne une couleur basée sur la note
 */
function getRatingColor(rating) {
  if (rating >= 4.8) return '#4CAF50'; // Vert
  if (rating >= 4.5) return '#8BC34A'; // Vert clair
  if (rating >= 4.0) return '#FFC107'; // Jaune
  if (rating >= 3.5) return '#FF9800'; // Orange
  return '#F44336'; // Rouge
}

/**
 * Crée une infobulle pour un restaurant
 */
function createInfoWindow(id, restaurant) {
  const starsHtml = getStarsHtml(restaurant.rating);
  
  const content = `
    <div class="map-info-window">
      <h3>${restaurant.name}</h3>
      <div class="map-rating">
        ${starsHtml} <span>${restaurant.rating}</span>
      </div>
      <div class="map-cuisine">${restaurant.cuisine} • ${restaurant.priceRange}</div>
      <div class="map-address">${restaurant.address}</div>
      <div class="map-phone">${restaurant.phone}</div>
      <div class="map-actions">
        <a href="${restaurant.url}" class="map-action-btn map-view-btn">Voir la page</a>
        <a href="https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(restaurant.address)}" target="_blank" class="map-action-btn map-directions-btn">Itinéraire</a>
      </div>
    </div>
  `;
  
  return new google.maps.InfoWindow({
    content: content,
    maxWidth: 300
  });
}

/**
 * Génère le HTML pour afficher les étoiles
 */
function getStarsHtml(rating) {
  let html = '';
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5;
  
  // Étoiles pleines
  for (let i = 0; i < fullStars; i++) {
    html += '<span class="map-star">★</span>';
  }
  
  // Demi-étoile
  if (halfStar) {
    html += '<span class="map-star-half">★</span>';
  }
  
  // Étoiles vides
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
  for (let i = 0; i < emptyStars; i++) {
    html += '<span class="map-star-empty">☆</span>';
  }
  
  return html;
}

/**
 * Ajuste le zoom de la carte pour afficher tous les marqueurs
 */
function fitMapToMarkers() {
  const bounds = new google.maps.LatLngBounds();
  
  markers.forEach(marker => {
    bounds.extend(marker.getPosition());
  });
  
  map.fitBounds(bounds);
  
  // Limiter le zoom maximum
  const listener = google.maps.event.addListener(map, 'idle', () => {
    if (map.getZoom() > 16) {
      map.setZoom(16);
    }
    google.maps.event.removeListener(listener);
  });
}

/**
 * Initialise la carte individuelle d'un restaurant
 */
function initSingleRestaurantMap(restaurantId) {
  if (!restaurantLocations[restaurantId]) return;
  
  const [lat, lng] = restaurantLocations[restaurantId];
  const restaurantData = restaurantInfo[restaurantId];
  
  // Options de la carte
  const mapOptions = {
    center: { lat, lng },
    zoom: 15,
    mapId: 'single-restaurant-map',
    mapTypeControl: false,
    fullscreenControl: true,
    streetViewControl: true,
    zoomControl: true
  };
  
  // Créer la carte
  const map = new google.maps.Map(document.getElementById("restaurant-map"), mapOptions);
  
  // Créer le marqueur
  const marker = new google.maps.Marker({
    position: { lat, lng },
    map: map,
    title: restaurantData.name,
    icon: {
      url: `data:image/svg+xml;utf-8,${encodeURIComponent(createMarkerSvg(restaurantData.rating))}`,
      scaledSize: new google.maps.Size(40, 40),
      anchor: new google.maps.Point(20, 40),
    },
    animation: google.maps.Animation.DROP
  });
  
  // Créer l'infobulle
  const infoWindow = createInfoWindow(restaurantId, restaurantData);
  
  // Ouvrir l'infobulle par défaut
  infoWindow.open(map, marker);
}

/**
 * Charge l'API Google Maps de manière asynchrone
 */
function loadGoogleMapsAPI() {
  const script = document.createElement('script');
  script.src = 'https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&callback=initMap';
  script.async = true;
  script.defer = true;
  document.head.appendChild(script);
}

// Pour l'usage dans la console de développement (remplacer par votre clé API réelle en production)
// Ceci est une version simulée pour la démo
function initMapWithoutAPI() {
  // Simuler l'API Google Maps pour la démo
  window.google = {
    maps: {
      Map: function() { return {}; },
      Marker: function() { return { addListener: function() {} }; },
      InfoWindow: function() { return { open: function() {} }; },
      LatLngBounds: function() { return { extend: function() {} }; },
      event: { addListener: function() {}, removeListener: function() {} },
      Animation: { DROP: 'drop' }
    }
  };
  
  // Afficher un message dans la console
  console.log('Carte initialisée en mode démo (sans API Google Maps)');
  
  // Initialiser la carte
  initMap();
}

// Initialisation lors du chargement de la page
document.addEventListener('DOMContentLoaded', function() {
  // Vérifier si l'élément de carte existe
  const mapElement = document.getElementById('map') || document.getElementById('restaurant-map');
  
  if (mapElement) {
    // Vérifier si nous sommes sur une page de restaurant individuel
    const pagePathname = window.location.pathname;
    const isRestaurantPage = pagePathname.includes('/restaurants/');
    
    if (isRestaurantPage) {
      // Extraire l'ID du restaurant de l'URL
      const restaurantId = pagePathname.split('/').pop().replace('.html', '');
      // Initialiser la carte pour un restaurant individuel
      initSingleRestaurantMap(restaurantId);
    } else {
      // Initialiser la carte pour tous les restaurants
      initMap();
    }
  }
});

// Exposer les fonctions pour le développement
window.mapsAPI = {
  initMap,
  initSingleRestaurantMap,
  fitMapToMarkers
};
