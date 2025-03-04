// Gestion du mode sombre/clair

const themes = {
    light: {
        background: '#f8f9fa',
        text: '#333',
        cardBackground: '#ffffff',
        headerBackground: '#ffffff',
        filterBackground: '#f4f4f4',
        borderColor: '#ddd'
    },
    dark: {
        background: '#121212',
        text: '#e0e0e0',
        cardBackground: '#1e1e1e',
        headerBackground: '#1a1a1a',
        filterBackground: '#2c2c2c',
        borderColor: '#444'
    }
};

// Fonctions exportées
export function initThemeToggle() {
    // Créer le bouton de bascule si nécessaire
    createToggleButton();
    
    // Définir le thème initial
    const currentTheme = getInitialTheme();
    applyTheme(currentTheme);
}

function createToggleButton() {
    // Vérifier si le bouton existe déjà
    if (document.getElementById('theme-toggle')) {
        return;
    }
    
    // Créer le bouton
    const button = document.createElement('button');
    button.id = 'theme-toggle';
    button.innerHTML = '🌙'; // Icône par défaut
    button.title = 'Changer le thème';
    button.style.position = 'fixed';
    button.style.top = '20px';
    button.style.right = '20px';
    button.style.backgroundColor = 'transparent';
    button.style.border = 'none';
    button.style.fontSize = '24px';
    button.style.cursor = 'pointer';
    button.style.zIndex = '1000';
    
    // Ajouter l'écouteur d'événement
    button.addEventListener('click', toggleTheme);
    
    // Ajouter au document
    document.body.appendChild(button);
}

function getInitialTheme() {
    // Vérifier la préférence système
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Vérifier le localStorage
    const savedTheme = localStorage.getItem('site-theme');
    
    if (savedTheme) {
        return savedTheme;
    }
    
    return systemPrefersDark ? 'dark' : 'light';
}

function toggleTheme() {
    const currentTheme = localStorage.getItem('site-theme') || getInitialTheme();
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    applyTheme(newTheme);
    
    // Sauvegarder dans localStorage
    localStorage.setItem('site-theme', newTheme);
    
    // Mettre à jour l'icône du bouton
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.innerHTML = newTheme === 'light' ? '🌙' : '☀️';
    }
    
    // Mettre à jour la carte Leaflet si elle existe
    updateLeafletMap(newTheme);
}

function applyTheme(themeName) {
    const theme = themes[themeName];
    
    // Appliquer les variables CSS
    document.documentElement.style.setProperty('--bg-color', theme.background);
    document.documentElement.style.setProperty('--text-color', theme.text);
    document.documentElement.style.setProperty('--card-bg', theme.cardBackground);
    document.documentElement.style.setProperty('--header-bg', theme.headerBackground);
    document.documentElement.style.setProperty('--filter-bg', theme.filterBackground);
    document.documentElement.style.setProperty('--border-color', theme.borderColor);
    
    // Mettre à jour la classe pour identifier le thème actuel
    document.documentElement.classList.remove('light-mode', 'dark-mode');
    document.documentElement.classList.add(themeName + '-mode');
}

function updateLeafletMap(theme) {
    // Mettre à jour le style de la carte Leaflet si elle est présente
    const map = document.getElementById('map') || document.getElementById('restaurant-map');
    if (!map) return;
    
    // Attendre que Leaflet soit complètement chargé
    setTimeout(() => {
        // Forcer un redimensionnement pour mettre à jour les tuiles
        if (typeof L !== 'undefined' && map._leaflet_id) {
            const leafletMap = map._leaflet;
            if (leafletMap && typeof leafletMap.invalidateSize === 'function') {
                leafletMap.invalidateSize();
            }
        }
    }, 100);
}

// Initialiser le gestionnaire de thème au chargement
document.addEventListener('DOMContentLoaded', initThemeToggle);