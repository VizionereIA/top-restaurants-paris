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
        // Pour le moment, afficher un message d'attente au lieu de la carte
        const mapElement = document.getElementById(elementId);
        if (mapElement) {
            mapElement.innerHTML = `
                <div style="display: flex; justify-content: center; align-items: center; height: 100%; flex-direction: column; text-align: center;">
                    <p>La carte des restaurants sera bientôt disponible</p>
                    <p>En cours de configuration...</p>
                </div>
            `;
            mapElement.style.backgroundColor = "#f4f4f4";
            mapElement.style.border = "1px solid #ddd";
            mapElement.style.borderRadius = "8px";
        }
    }
    
    // Méthode spécifique pour l'affichage d'un seul restaurant
    initSingle(elementId, restaurant) {
        // Pour le moment, afficher un message d'attente au lieu de la carte
        const mapElement = document.getElementById(elementId);
        if (mapElement) {
            mapElement.innerHTML = `
                <div style="display: flex; justify-content: center; align-items: center; height: 100%; flex-direction: column; text-align: center;">
                    <p>La carte de localisation de ${restaurant.name} sera bientôt disponible</p>
                    <p>Adresse: ${restaurant.address}</p>
                </div>
            `;
            mapElement.style.backgroundColor = "#f4f4f4";
            mapElement.style.border = "1px solid #ddd";
            mapElement.style.borderRadius = "8px";
        }
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