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

class ThemeManager {
    constructor() {
        this.currentTheme = this.getInitialTheme();
        this.initThemeToggle();
        this.applyTheme();
    }

    getInitialTheme() {
        // Vérifier la préférence système
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        // Vérifier le localStorage
        const savedTheme = localStorage.getItem('site-theme');
        
        if (savedTheme) {
            return savedTheme;
        }
        
        return systemPrefersDark ? 'dark' : 'light';
    }

    initThemeToggle() {
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => this.toggleTheme());
        }

        // Écouter les changements de préférence système
        window.matchMedia('(prefers-color-scheme: dark)').addListener((e) => {
            if (e.matches) {
                this.setTheme('dark');
            } else {
                this.setTheme('light');
            }
        });
    }

    toggleTheme() {
        const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme);
    }

    setTheme(theme) {
        this.currentTheme = theme;
        this.applyTheme();
        
        // Sauvegarder dans localStorage
        localStorage.setItem('site-theme', theme);
        
        // Mettre à jour l'icône du bouton
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.textContent = theme === 'light' ? '🌙' : '☀️';
        }
    }

    applyTheme() {
        const theme = themes[this.currentTheme];
        
        document.documentElement.style.setProperty('--bg-color', theme.background);
        document.documentElement.style.setProperty('--text-color', theme.text);
        document.documentElement.style.setProperty('--card-bg', theme.cardBackground);
        document.documentElement.style.setProperty('--header-bg', theme.headerBackground);
        document.documentElement.style.setProperty('--filter-bg', theme.filterBackground);
        document.documentElement.style.setProperty('--border-color', theme.borderColor);
    }
}

// Initialiser le gestionnaire de thème
document.addEventListener('DOMContentLoaded', () => {
    new ThemeManager();
});

export default ThemeManager;