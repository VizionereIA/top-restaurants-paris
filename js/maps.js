// Système de gestion des cartes avec Leaflet (ne nécessite pas de clé API)

class RestaurantMaps {
    constructor() {
        this.restaurants = [
            {
                name: 'Kafkaf',
                lat: 48.8561,
                lng: 2.3822,
                address: '7 Rue Keller, 75011 Paris',
                rating: 4.9,
                cuisine: 'Middle Eastern',
                id: 'kafkaf'
            },
            {
                name: 'L\'Épicerie du Nord',
                lat: 48.8766,
                lng: 2.3522,
                address: 'Quartier Gare du Nord, 75010 Paris',
                rating: 4.8,
                cuisine: 'Indien',
                id: 'lepicerie-du-nord'
            },
            {
                name: 'Saveurs d\'Orient',
                lat: 48.8721,
                lng: 2.3454,
                address: 'Passage des Panoramas, 75002 Paris',
                rating: 4.8,
                cuisine: 'Marocain/Libanais',
                id: 'saveurs-orient'
            },
            {
                name: 'La Maison Mère',
                lat: 48.8765,
                lng: 2.3451,
                address: '7 rue Mayran, 75009 Paris',
                rating: 4.7,
                cuisine: 'Franco-Américain',
                id: 'maison-mere'
            },
            {
                name: 'Dessance',
                lat: 48.8589,
                lng: 2.3662,
                address: 'Le Marais, 75003 Paris',
                rating: 4.7,
                cuisine: 'Gastronomique',
                id: 'dessance'
            }
        ];
    }

    initMap(elementId) {
        const mapElement = document.getElementById(elementId);
        if (!mapElement) return;
        
        // Vérifier si Leaflet est disponible
        if (typeof L === 'undefined') {
            this.loadLeafletScript(elementId);
            return;
        }
        
        try {
            // Créer la carte centrée sur Paris
            const map = L.map(elementId).setView([48.8566, 2.3522], 12);
            
            // Ajouter le fond de carte OpenStreetMap
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(map);
            
            // Ajouter les marqueurs pour chaque restaurant
            this.addMarkers(map);
            
        } catch (error) {
            console.error('Erreur lors de l\'initialisation de la carte :', error);
            this.showErrorMessage(mapElement);
        }
    }
    
    initSingle(elementId, restaurant) {
        const mapElement = document.getElementById(elementId);
        if (!mapElement) return;
        
        // Vérifier si Leaflet est disponible
        if (typeof L === 'undefined') {
            this.loadLeafletScript(elementId, restaurant);
            return;
        }
        
        try {
            // Trouver le restaurant dans notre liste
            const restaurantData = this.restaurants.find(r => r.name === restaurant.name) || restaurant;
            
            // Créer la carte centrée sur le restaurant
            const map = L.map(elementId).setView([restaurantData.lat, restaurantData.lng], 15);
            
            // Ajouter le fond de carte OpenStreetMap
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(map);
            
            // Ajouter un marqueur pour le restaurant
            const marker = L.marker([restaurantData.lat, restaurantData.lng], {
                title: restaurantData.name
            }).addTo(map);
            
            // Ajouter une popup
            marker.bindPopup(this.createInfoWindowContent(restaurantData)).openPopup();
            
        } catch (error) {
            console.error('Erreur lors de l\'initialisation de la carte :', error);
            this.showErrorMessage(mapElement, restaurant);
        }
    }
    
    addMarkers(map) {
        const bounds = [];
        
        this.restaurants.forEach(restaurant => {
            // Créer un marqueur personnalisé en fonction de la note
            const markerIcon = this.getMarkerIcon(restaurant.rating);
            
            const marker = L.marker([restaurant.lat, restaurant.lng], {
                title: restaurant.name,
                icon: markerIcon
            }).addTo(map);
            
            // Ajouter une popup
            marker.bindPopup(this.createInfoWindowContent(restaurant));
            
            // Ajouter les coordonnées pour ajuster la vue
            bounds.push([restaurant.lat, restaurant.lng]);
        });
        
        // Ajuster la vue pour inclure tous les marqueurs
        if (bounds.length > 0) {
            map.fitBounds(bounds);
        }
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
        
        // Créer une icône personnalisée
        return L.divIcon({
            className: 'custom-marker',
            html: `<div style="background-color: ${color}; width: 100%; height: 100%; border-radius: 50%; border: 2px solid white;"></div>`,
            iconSize: [20, 20],
            iconAnchor: [10, 10]
        });
    }
    
    loadLeafletScript(elementId, restaurant = null) {
        // Vérifier si les scripts et styles sont déjà en cours de chargement
        if (document.querySelector('link[href*="leaflet.css"]') && 
            document.querySelector('script[src*="leaflet.js"]')) {
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
                .custom-marker {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }
            `;
            document.head.appendChild(style);
        }
        
        // Charger la feuille de style Leaflet
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.7.1/dist/leaflet.css';
        link.integrity = 'sha512-xodZBNTC5n17Xt2atTPuE1HxjVMSvLVW9ocqUKLsCC5CXdbqCmblAshOMAS6/keqq/sMZMZ19scR4PsZChSR7A==';
        link.crossOrigin = '';
        document.head.appendChild(link);
        
        // Charger le script Leaflet
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/leaflet@1.7.1/dist/leaflet.js';
        script.integrity = 'sha512-XQoYMqMTK8LvdxXYG3nZ448hOEQiglfqkJs1NOQV44cWnUrBc8PkAOcXy20w0vlaXaVUearIOBhiXZ5V3ynxwA==';
        script.crossOrigin = '';
        
        // Quand le script est chargé, initialiser la carte
        script.onload = () => {
            if (restaurant) {
                this.initSingle(elementId, restaurant);
            } else {
                this.initMap(elementId);
            }
        };
        
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