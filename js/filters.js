/**
 * Système de filtrage pour les restaurants
 */

// Définition des filtres disponibles
const filterCategories = {
  cuisine: ['Middle Eastern', 'Indien', 'Marocain/Libanais', 'Franco-Américain', 'Gastronomique'],
  ambiance: ['Cozy', 'Authentique', 'Élégant', 'Tendance', 'Design'],
  prix: ['€', '€€', '€€€']
};

// État des filtres actifs
let activeFilters = {
  cuisine: [],
  ambiance: [],
  prix: []
};

/**
 * Initialise les composants de filtrage
 */
function initializeFilters() {
  // Créer la section des filtres
  const filterSection = document.createElement('div');
  filterSection.className = 'filter-section';
  
  // Titre de la section
  const filterTitle = document.createElement('h2');
  filterTitle.textContent = 'Filtrer les restaurants';
  filterTitle.className = 'filter-title';
  filterSection.appendChild(filterTitle);
  
  // Créer les filtres pour chaque catégorie
  Object.entries(filterCategories).forEach(([category, values]) => {
    const categoryContainer = document.createElement('div');
    categoryContainer.className = 'filter-category';
    
    const categoryTitle = document.createElement('h3');
    categoryTitle.textContent = getCategoryDisplayName(category);
    categoryContainer.appendChild(categoryTitle);
    
    const filtersContainer = document.createElement('div');
    filtersContainer.className = 'filters-container';
    
    // Ajouter chaque valeur de filtre comme un bouton
    values.forEach(value => {
      const filterBtn = document.createElement('button');
      filterBtn.className = 'filter-btn';
      filterBtn.dataset.category = category;
      filterBtn.dataset.value = value;
      filterBtn.textContent = value;
      
      filterBtn.addEventListener('click', () => {
        toggleFilter(category, value, filterBtn);
      });
      
      filtersContainer.appendChild(filterBtn);
    });
    
    categoryContainer.appendChild(filtersContainer);
    filterSection.appendChild(categoryContainer);
  });
  
  // Ajouter le bouton pour effacer tous les filtres
  const resetBtn = document.createElement('button');
  resetBtn.className = 'reset-filters-btn';
  resetBtn.textContent = 'Réinitialiser les filtres';
  resetBtn.addEventListener('click', resetFilters);
  filterSection.appendChild(resetBtn);
  
  // Insérer la section de filtres avant la liste des restaurants
  const restaurantContainer = document.querySelector('.restaurant-container');
  restaurantContainer.parentNode.insertBefore(filterSection, restaurantContainer);
}

/**
 * Retourne le nom d'affichage d'une catégorie
 */
function getCategoryDisplayName(category) {
  const displayNames = {
    'cuisine': 'Type de cuisine',
    'ambiance': 'Ambiance',
    'prix': 'Gamme de prix'
  };
  return displayNames[category] || category;
}

/**
 * Active/désactive un filtre
 */
function toggleFilter(category, value, buttonElement) {
  // Vérifier si le filtre est déjà actif
  const filterIndex = activeFilters[category].indexOf(value);
  
  if (filterIndex === -1) {
    // Ajouter le filtre s'il n'est pas actif
    activeFilters[category].push(value);
    buttonElement.classList.add('active');
  } else {
    // Retirer le filtre s'il est déjà actif
    activeFilters[category].splice(filterIndex, 1);
    buttonElement.classList.remove('active');
  }
  
  // Appliquer les filtres aux restaurants
  applyFilters();
}

/**
 * Applique les filtres actifs aux restaurants
 */
function applyFilters() {
  const restaurants = document.querySelectorAll('.restaurant-card');
  
  restaurants.forEach(restaurant => {
    // Vérifier si le restaurant correspond à tous les filtres actifs
    let shouldShow = true;
    
    // Vérifier les filtres de cuisine
    if (activeFilters.cuisine.length > 0) {
      const cuisineBadge = restaurant.querySelector('.badge.cuisine');
      const cuisineType = cuisineBadge ? cuisineBadge.textContent : '';
      if (!activeFilters.cuisine.includes(cuisineType)) {
        shouldShow = false;
      }
    }
    
    // Vérifier les filtres d'ambiance
    if (shouldShow && activeFilters.ambiance.length > 0) {
      const ambianceBadge = restaurant.querySelector('.badge.ambiance');
      const ambianceType = ambianceBadge ? ambianceBadge.textContent : '';
      if (!activeFilters.ambiance.includes(ambianceType)) {
        shouldShow = false;
      }
    }
    
    // Vérifier les filtres de prix
    if (shouldShow && activeFilters.prix.length > 0) {
      const prixBadge = restaurant.querySelector('.badge.prix');
      const prixType = prixBadge ? prixBadge.textContent : '';
      // Prix peut avoir des variantes comme '€€-€€€', donc on vérifie s'il contient l'un des filtres actifs
      if (!activeFilters.prix.some(prix => prixType.includes(prix))) {
        shouldShow = false;
      }
    }
    
    // Afficher ou masquer le restaurant
    restaurant.style.display = shouldShow ? '' : 'none';
  });
  
  // Mettre à jour le compteur de résultats
  updateResultsCount();
}

/**
 * Met à jour le compteur de restaurants affichés
 */
function updateResultsCount() {
  const visibleCount = document.querySelectorAll('.restaurant-card[style="display: none;"]').length;
  const totalCount = document.querySelectorAll('.restaurant-card').length;
  const resultsElement = document.querySelector('.results-count') || createResultsCountElement();
  
  resultsElement.textContent = `Affichage de ${totalCount - visibleCount} sur ${totalCount} restaurants`;
}

/**
 * Crée l'élément de compteur de résultats s'il n'existe pas
 */
function createResultsCountElement() {
  const resultsElement = document.createElement('div');
  resultsElement.className = 'results-count';
  
  const restaurantContainer = document.querySelector('.restaurant-container');
  restaurantContainer.parentNode.insertBefore(resultsElement, restaurantContainer);
  
  return resultsElement;
}

/**
 * Réinitialise tous les filtres
 */
function resetFilters() {
  // Réinitialiser l'état des filtres
  Object.keys(activeFilters).forEach(category => {
    activeFilters[category] = [];
  });
  
  // Réinitialiser l'interface utilisateur
  document.querySelectorAll('.filter-btn.active').forEach(btn => {
    btn.classList.remove('active');
  });
  
  // Réafficher tous les restaurants
  document.querySelectorAll('.restaurant-card').forEach(restaurant => {
    restaurant.style.display = '';
  });
  
  // Mettre à jour le compteur
  updateResultsCount();
}

// Initialiser les filtres lorsque la page est chargée
document.addEventListener('DOMContentLoaded', function() {
  initializeFilters();
  updateResultsCount();
});
