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
        const mapElement = document.getElementById(elementId);
        if (!mapElement) return;
        
        // Vérifier si l'API Google Maps est disponible
        if (typeof google === 'undefined' || typeof google.maps === 'undefined') {
            this.loadGoogleMapsScript(elementId);
            return;
        }
        
        try {
            // Créer la carte centrée sur Paris
            const map = new google.maps.Map(mapElement, {
                center: { lat: 48.8566, lng: 2.3522 }, // Paris
                zoom: 12,
                styles: this.getMapStyles(),
                mapTypeControl: false,
                streetViewControl: false,
                fullscreenControl: true,
                zoomControl: true
            });
            
            // Ajouter les marqueurs pour chaque restaurant
            this.addMarkers(map);
            
            // Ajouter les événements pour centrer la carte
            this.addMapEvents(map);
            
        } catch (error) {
            console.error('Erreur lors de l\'initialisation de la carte :', error);
            this.showErrorMessage(mapElement);
        }
    }
    
    initSingle(elementId, restaurant) {
        const mapElement = document.getElementById(elementId);
        if (!mapElement) return;
        
        // Vérifier si l'API Google Maps est disponible
        if (typeof google === 'undefined' || typeof google.maps === 'undefined') {
            this.loadGoogleMapsScript(elementId, restaurant);
            return;
        }
        
        try {
            // Trouver le restaurant dans notre liste
            const restaurantData = this.restaurants.find(r => r.name === restaurant.name) || restaurant;
            
            // Créer la carte centrée sur le restaurant
            const map = new google.maps.Map(mapElement, {
                center: { lat: restaurantData.lat, lng: restaurantData.lng },
                zoom: 15,
                styles: this.getMapStyles(),
                mapTypeControl: false,
                streetViewControl: true,
                fullscreenControl: true,
                zoomControl: true
            });
            
            // Ajouter un marqueur pour le restaurant
            const marker = new google.maps.Marker({
                position: { lat: restaurantData.lat, lng: restaurantData.lng },
                map: map,
                title: restaurantData.name,
                animation: google.maps.Animation.DROP,
                icon: this.getMarkerIcon(restaurantData.rating)
            });
            
            // Ajouter une info-bulle
            const infowindow = new google.maps.InfoWindow({
                content: this.createInfoWindowContent(restaurantData)
            });
            
            marker.addListener('click', function() {
                infowindow.open(map, marker);
            });
            
            // Ouvrir l'info-bulle par défaut
            infowindow.open(map, marker);
            
        } catch (error) {
            console.error('Erreur lors de l\'initialisation de la carte :', error);
            this.showErrorMessage(mapElement, restaurant);
        }
    }
    
    addMarkers(map) {
        const bounds = new google.maps.LatLngBounds();
        
        this.restaurants.forEach(restaurant => {
            const marker = new google.maps.Marker({
                position: { lat: restaurant.lat, lng: restaurant.lng },
                map: map,
                title: restaurant.name,
                animation: google.maps.Animation.DROP,
                icon: this.getMarkerIcon(restaurant.rating)
            });
            
            // Ajouter une info-bulle
            const infowindow = new google.maps.InfoWindow({
                content: this.createInfoWindowContent(restaurant)
            });
            
            marker.addListener('click', function() {
                infowindow.open(map, marker);
            });
            
            // Étendre les limites de la carte pour inclure tous les marqueurs
            bounds.extend(marker.getPosition());
        });
        
        // Ajuster la vue pour inclure tous les marqueurs
        map.fitBounds(bounds);
        
        // S'assurer que le zoom n'est pas trop élevé
        const listener = google.maps.event.addListener(map, "idle", function() { 
            if (map.getZoom() > 16) map.setZoom(16); 
            google.maps.event.removeListener(listener); 
        });
    }
    
    createInfoWindowContent(restaurant) {
        return `
            <div class="map-info-window">
                <h3>${restaurant.name}</h3>
                <p><strong>Cuisine:</strong> ${restaurant.cuisine}</p>
                <p><strong>Note:</strong> ${restaurant.rating}/5</p>
                <p><strong>Adresse:</strong> ${restaurant.address}</p>
                <a href="restaurant.html?id=${restaurant.id || this.slugify(restaurant.name)}" class="info-link">
                    Voir les détails
                </a>
            </div>
        `;
    }
    
    getMarkerIcon(rating) {
        // Déterminer la couleur en fonction de la note
        let color;
        if (rating >= 4.8) {
            color = '#4CAF50'; // Vert pour excellent
        } else if (rating >= 4.5) {
            color = '#8BC34A'; // Vert clair pour très bien
        } else if (rating >= 4.0) {
            color = '#FFC107'; // Jaune pour bien
        } else {
            color = '#FF5722'; // Orange pour moyen
        }
        
        return {
            path: google.maps.SymbolPath.CIRCLE,
            fillColor: color,
            fillOpacity: 0.9,
            scale: 10,
            strokeColor: '#FFFFFF',
            strokeWeight: 2
        };
    }
    
    getMapStyles() {
        return [
            {
                "featureType": "administrative",
                "elementType": "labels.text.fill",
                "stylers": [
                    {
                        "color": "#444444"
                    }
                ]
            },
            {
                "featureType": "landscape",
                "elementType": "all",
                "stylers": [
                    {
                        "color": "#f2f2f2"
                    }
                ]
            },
            {
                "featureType": "poi",
                "elementType": "all",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "poi.business",
                "elementType": "geometry.fill",
                "stylers": [
                    {
                        "visibility": "on"
                    }
                ]
            },
            {
                "featureType": "poi.park",
                "elementType": "all",
                "stylers": [
                    {
                        "visibility": "on"
                    }
                ]
            },
            {
                "featureType": "road",
                "elementType": "all",
                "stylers": [
                    {
                        "saturation": -100
                    },
                    {
                        "lightness": 45
                    }
                ]
            },
            {
                "featureType": "road.highway",
                "elementType": "all",
                "stylers": [
                    {
                        "visibility": "simplified"
                    }
                ]
            },
            {
                "featureType": "road.arterial",
                "elementType": "labels.icon",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "transit",
                "elementType": "all",
                "stylers": [
                    {
                        "visibility": "on"
                    }
                ]
            },
            {
                "featureType": "water",
                "elementType": "all",
                "stylers": [
                    {
                        "color": "#b4d4e1"
                    },
                    {
                        "visibility": "on"
                    }
                ]
            }
        ];
    }
    
    addMapEvents(map) {
        // Centrer la carte sur un restaurant quand on clique sur sa carte
        document.addEventListener('click', (event) => {
            if (event.target.classList.contains('view-details')) {
                const restaurantCard = event.target.closest('.restaurant-card');
                if (!restaurantCard) return;
                
                const restaurantName = restaurantCard.querySelector('h3').textContent;
                const restaurant = this.restaurants.find(r => r.name === restaurantName);
                
                if (restaurant && map) {
                    map.setCenter({ lat: restaurant.lat, lng: restaurant.lng });
                    map.setZoom(16);
                }
            }
        });
    }
    
    loadGoogleMapsScript(elementId, restaurant = null) {
        // Vérifier si le script est déjà en cours de chargement
        if (document.querySelector('script[src*="maps.googleapis.com/maps/api/js"]')) {
            return;
        }
        
        // Montrer un message de chargement
        const mapElement = document.getElementById(elementId);
        if (mapElement) {
            mapElement.innerHTML = `
                <div style="display: flex; justify-content: center; align-items: center; height: 100%; flex-direction: column; text-align: center;">
                    <div style="width: 40px; height: 40px; border: 4px solid #f3f3f3; border-top: 4px solid #3498db; border-radius: 50%; animation: spin 1s linear infinite;"></div>
                    <p style="margin-top: 15px;">Chargement de la carte...</p>
                </div>
            `;
        }
        
        // Ajouter le style d'animation
        if (!document.querySelector('style#map-loading-style')) {
            const style = document.createElement('style');
            style.id = 'map-loading-style';
            style.textContent = `
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `;
            document.head.appendChild(style);
        }
        
        // Créer une fonction globale pour initialiser la carte
        window.initMap = () => {
            if (restaurant) {
                this.initSingle(elementId, restaurant);
            } else {
                this.initMap(elementId);
            }
        };
        
        // Créer le script Google Maps
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyAJZO7zRNKYWhH8nXg2JGCk3Ow6f1Hj0AE&callback=initMap`;
        script.async = true;
        script.defer = true;
        document.head.appendChild(script);
    }
    
    showErrorMessage(mapElement, restaurant = null) {
        // Afficher un message d'erreur
        if (mapElement) {
            mapElement.innerHTML = `
                <div style="display: flex; justify-content: center; align-items: center; height: 100%; flex-direction: column; text-align: center;">
                    <p>Impossible de charger la carte pour le moment.</p>
                    ${restaurant ? `<p>Adresse: ${restaurant.address}</p>` : ''}
                    <p>Veuillez réessayer plus tard.</p>
                </div>
            `;
            mapElement.style.backgroundColor = "#f4f4f4";
            mapElement.style.border = "1px solid #ddd";
            mapElement.style.borderRadius = "8px";
        }
    }
    
    // Utilitaire pour transformer un nom en slug
    slugify(text) {
        return text
            .toString()
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/\s+/g, '-')
            .replace(/[^\w-]+/g, '')
            .replace(/--+/g, '-')
            .replace(/^-+/, '')
            .replace(/-+$/, '');
    }

    // Méthode statique pour initialiser facilement
    static init(elementId) {
        const mapManager = new RestaurantMaps();
        mapManager.initMap(elementId);
    }
    
    // Méthode statique pour initialiser une carte avec un seul restaurant
    static initSingle(elementId, restaurant) {
        const mapManager = new RestaurantMaps();
        mapManager.initSingle(elementId, restaurant);
    }
}

export default RestaurantMaps;