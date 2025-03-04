// Système de gestion des cartes Google Maps

class RestaurantMaps {
    constructor() {
        this.restaurants = [
            {
                name: 'Kafkaf',
                lat: 48.8561,
                lng: 2.3822,
                address: '7 Rue Keller, 75011 Paris',
                rating: 4.9,
                cuisine: 'Middle Eastern'
            },
            {
                name: 'L\'Épicerie du Nord',
                lat: 48.8766,
                lng: 2.3522,
                address: 'Quartier Gare du Nord, 75010 Paris',
                rating: 4.8,
                cuisine: 'Indien'
            },
            {
                name: 'Saveurs d\'Orient',
                lat: 48.8721,
                lng: 2.3454,
                address: 'Passage des Panoramas, 75002 Paris',
                rating: 4.8,
                cuisine: 'Marocain/Libanais'
            },
            {
                name: 'La Maison Mère',
                lat: 48.8765,
                lng: 2.3451,
                address: '7 rue Mayran, 75009 Paris',
                rating: 4.7,
                cuisine: 'Franco-Américain'
            },
            {
                name: 'Dessance',
                lat: 48.8589,
                lng: 2.3662,
                address: 'Le Marais, 75003 Paris',
                rating: 4.7,
                cuisine: 'Gastronomique'
            }
        ];
    }

    initMap(elementId) {
        // Vérifier si l'API Google Maps est chargée
        if (typeof google === 'undefined') {
            console.error('Google Maps API non chargé');
            this.loadGoogleMapsScript(elementId);
            return;
        }

        // Centrer la carte sur Paris
        const mapOptions = {
            center: { lat: 48.8566, lng: 2.3522 },
            zoom: 12,
            styles: this.getCustomMapStyles()
        };

        // Créer la carte
        const map = new google.maps.Map(document.getElementById(elementId), mapOptions);

        // Ajouter des marqueurs pour chaque restaurant
        this.restaurants.forEach(restaurant => {
            this.addMarker(map, restaurant);
        });
    }

    addMarker(map, restaurant) {
        // Créer un marqueur personnalisé
        const marker = new google.maps.Marker({
            position: { lat: restaurant.lat, lng: restaurant.lng },
            map: map,
            title: restaurant.name,
            icon: this.getMarkerIcon(restaurant.rating)
        });

        // Créer une infobulle
        const infowindow = new google.maps.InfoWindow({
            content: this.createInfoWindowContent(restaurant)
        });

        // Ajouter des écouteurs d'événements
        marker.addListener('click', () => {
            infowindow.open(map, marker);
        });
    }

    createInfoWindowContent(restaurant) {
        return `
            <div class="map-info-window">
                <h3>${restaurant.name}</h3>
                <p><strong>Cuisine:</strong> ${restaurant.cuisine}</p>
                <p><strong>Note:</strong> ${restaurant.rating}/5</p>
                <p><strong>Adresse:</strong> ${restaurant.address}</p>
                <a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(restaurant.address)}" 
                   target="_blank" 
                   rel="noopener noreferrer">
                    Obtenir un itinéraire
                </a>
            </div>
        `;
    }

    getMarkerIcon(rating) {
        // Créer des marqueurs avec des couleurs basées sur la note
        const getColor = (rating) => {
            if (rating >= 4.5) return '#2ecc71';  // Vert pour excellent
            if (rating >= 4.0) return '#3498db';  // Bleu pour très bien
            return '#e74c3c';  // Rouge pour moyen
        };

        return {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 10,
            fillColor: getColor(rating),
            fillOpacity: 0.8,
            strokeWeight: 2,
            strokeColor: '#ffffff'
        };
    }

    getCustomMapStyles() {
        // Styles personnalisés pour la carte
        return [
            {
                featureType: 'water',
                elementType: 'geometry',
                stylers: [{ color: '#e9e9e9' }]
            },
            {
                featureType: 'landscape',
                elementType: 'geometry',
                stylers: [{ color: '#f5f5f5' }]
            },
            {
                featureType: 'road',
                elementType: 'geometry',
                stylers: [{ color: '#ffffff' }]
            },
            {
                featureType: 'poi',
                elementType: 'geometry',
                stylers: [{ color: '#f0f0f0' }]
            }
        ];
    }

    loadGoogleMapsScript(elementId) {
        // Charger le script Google Maps de manière asynchrone
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&callback=initMap`;
        script.async = true;
        script.defer = true;
        
        // Ajouter une méthode globale pour initialiser la carte
        window.initMap = () => {
            this.initMap(elementId);
        };

        document.head.appendChild(script);
    }

    // Méthode statique pour initialiser facilement
    static init(elementId) {
        const mapManager = new RestaurantMaps();
        mapManager.initMap(elementId);
    }
}

// Initialiser les cartes quand le DOM est chargé
document.addEventListener('DOMContentLoaded', () => {
    // Initialiser la carte sur la page d'accueil
    const homeMapElement = document.getElementById('home-map');
    if (homeMapElement) {
        RestaurantMaps.init('home-map');
    }

    // Initialiser la carte sur les pages de restaurants individuels
    const restaurantMapElement = document.getElementById('restaurant-map');
    if (restaurantMapElement) {
        RestaurantMaps.init('restaurant-map');
    }
});

export default RestaurantMaps;