/**
 * Système d'avis interactif pour les restaurants
 * 
 * Ce script permet aux utilisateurs de :
 * - Afficher les avis existants
 * - Soumettre de nouveaux avis
 * - Noter les restaurants (1 à 5 étoiles)
 * - Filtrer et trier les avis
 * 
 * Les avis sont stockés dans le localStorage pour la démonstration.
 * Dans une application réelle, ils seraient sauvegardés dans une base de données.
 */

// Structure pour stocker les avis
let reviews = {};

// Initialisation du système d'avis
function initReviewsSystem() {
  // Charger les avis depuis le localStorage
  loadReviews();

  // Ajouter des écouteurs d'événements pour les formulaires d'avis
  setupReviewForms();

  // Afficher les avis pour les restaurants de la page d'accueil
  displayReviewsOnHomepage();

  // Configurer le système de notation avec étoiles
  setupRatingSystem();

  // Configurer les options de tri et de filtrage si présentes
  setupReviewSorting();
}

/**
 * Charge les avis depuis le localStorage
 */
function loadReviews() {
  const savedReviews = localStorage.getItem('restaurantReviews');
  
  if (savedReviews) {
    reviews = JSON.parse(savedReviews);
  } else {
    // Initialiser avec des avis par défaut pour la démonstration
    reviews = {
      'kafkaf': [
        {
          name: 'Sophie L.',
          email: 'sophie@example.com',
          rating: 5,
          comment: "C'est undoubtement l'un des meilleurs brunchs que j'ai eu l'occasion de goûter à Paris ! La décoration est très cosy et les plats sont délicieux.",
          date: '2025-02-12'
        },
        {
          name: 'Thomas D.',
          email: 'thomas@example.com',
          rating: 5,
          comment: "Une pépite dans le 11ème ! J'y suis allé sur recommandation et je n'ai pas été déçu. La shakshuka est juste incroyable, parfaitement épicée et généreuse.",
          date: '2025-01-28'
        },
        {
          name: 'Léa M.',
          email: 'lea@example.com',
          rating: 5,
          comment: "Lieu chaleureux avec un personnel aux petits soins et une carte très gourmande. J'ai adoré le Kafkaf Royal !",
          date: '2025-01-15'
        }
      ],
      'epicerie-du-nord': [
        {
          name: 'Martin B.',
          email: 'martin@example.com',
          rating: 5,
          comment: "Très bon restaurant indien près de la gare du Nord. Dépaysement total quand on y entre! L'accueil est impeccable.",
          date: '2025-02-05'
        }
      ],
      'saveurs-orient': [
        {
          name: 'Julie P.',
          email: 'julie@example.com',
          rating: 4,
          comment: "Délicieuses spécialités orientales dans un cadre agréable. Très bon couscous servi avec générosité.",
          date: '2025-01-20'
        }
      ],
      'maison-mere': [
        {
          name: 'Pierre D.',
          email: 'pierre@example.com',
          rating: 4,
          comment: "Belle ambiance et carte variée. Un bon moment passé en famille.",
          date: '2025-02-10'
        }
      ],
      'dessance': [
        {
          name: 'Claire M.',
          email: 'claire@example.com',
          rating: 5,
          comment: "Une expérience gastronomique inoubliable. Le menu dégustation est un festival de saveurs.",
          date: '2025-01-18'
        }
      ]
    };
    
    // Sauvegarder dans le localStorage
    saveReviews();
  }
}

/**
 * Sauvegarde les avis dans le localStorage
 */
function saveReviews() {
  localStorage.setItem('restaurantReviews', JSON.stringify(reviews));
}

/**
 * Configure les formulaires d'avis
 */
function setupReviewForms() {
  const reviewForms = document.querySelectorAll('.review-form');
  
  reviewForms.forEach(form => {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Récupérer les données du formulaire
      const restaurantId = this.getAttribute('data-restaurant');
      const name = this.querySelector('[name="name"]').value;
      const email = this.querySelector('[name="email"]').value;
      const rating = parseInt(this.querySelector('[name="rating"]').value);
      const comment = this.querySelector('[name="comment"]').value;
      
      // Créer un nouvel avis
      const newReview = {
        name,
        email,
        rating,
        comment,
        date: new Date().toISOString().split('T')[0] // Format YYYY-MM-DD
      };
      
      // Ajouter l'avis à la liste
      if (!reviews[restaurantId]) {
        reviews[restaurantId] = [];
      }
      
      reviews[restaurantId].unshift(newReview); // Ajouter au début pour avoir les plus récents en premier
      
      // Sauvegarder les avis
      saveReviews();
      
      // Mettre à jour l'affichage
      if (window.location.pathname.includes('restaurants/')) {
        // Page détaillée
        displayRestaurantReviews(restaurantId);
      } else {
        // Page d'accueil
        displayReviewsOnHomepage();
      }
      
      // Réinitialiser le formulaire
      this.reset();
      
      // Afficher un message de confirmation
      showReviewConfirmation(restaurantId);
    });
  });
}

/**
 * Affiche un message de confirmation après soumission d'un avis
 */
function showReviewConfirmation(restaurantId) {
  const confirmationElement = document.querySelector(`#review-confirmation-${restaurantId}`);
  
  if (confirmationElement) {
    confirmationElement.style.display = 'block';
    
    // Masquer le message après 3 secondes
    setTimeout(() => {
      confirmationElement.style.display = 'none';
    }, 3000);
  }
}

/**
 * Affiche les avis sur la page d'accueil
 */
function displayReviewsOnHomepage() {
  const restaurantCards = document.querySelectorAll('.restaurant-card');
  
  restaurantCards.forEach(card => {
    const titleElement = card.querySelector('.restaurant-title');
    if (!titleElement) return;
    
    // Extraire l'identifiant du restaurant à partir du titre
    const title = titleElement.textContent;
    const restaurantName = title.split('.')[1].trim().toLowerCase().replace(/[^a-z0-9]/g, '-');
    
    // Ajouter un bouton pour afficher tous les avis
    const reviewSection = card.querySelector('.review');
    if (reviewSection && reviews[restaurantName] && reviews[restaurantName].length > 0) {
      const reviewsCount = reviews[restaurantName].length;
      
      // Vérifier si le bouton n'existe pas déjà
      if (!reviewSection.querySelector('.show-all-reviews')) {
        const showAllButton = document.createElement('button');
        showAllButton.className = 'show-all-reviews';
        showAllButton.textContent = `Voir tous les avis (${reviewsCount})`;
        showAllButton.addEventListener('click', () => {
          // Rediriger vers la page détaillée si elle existe, sinon afficher une modal
          if (restaurantName === 'kafkaf') {
            window.location.href = `restaurants/${restaurantName}.html#reviews-section`;
          } else {
            showReviewsModal(restaurantName);
          }
        });
        
        reviewSection.appendChild(showAllButton);
      }
    }
    
    // Ajouter un lien pour laisser un avis
    if (!card.querySelector('.add-review-btn')) {
      const reviewBtn = document.createElement('a');
      reviewBtn.href = '#';
      reviewBtn.className = 'add-review-btn';
      reviewBtn.textContent = 'Laisser un avis';
      reviewBtn.addEventListener('click', (e) => {
        e.preventDefault();
        showAddReviewModal(restaurantName);
      });
      
      const actionsContainer = card.querySelector('.restaurant-content');
      if (actionsContainer) {
        actionsContainer.appendChild(reviewBtn);
      }
    }
  });
}

/**
 * Affiche une fenêtre modale avec tous les avis d'un restaurant
 */
function showReviewsModal(restaurantId) {
  // Créer l'élément de la modal
  const modal = document.createElement('div');
  modal.className = 'reviews-modal';
  modal.innerHTML = `
    <div class="reviews-modal-content">
      <span class="close-modal">&times;</span>
      <h2>Avis pour ${getRestaurantNameById(restaurantId)}</h2>
      <div class="reviews-container"></div>
    </div>
  `;
  
  // Ajouter la modal au corps de la page
  document.body.appendChild(modal);
  
  // Ajouter les avis à la modal
  const reviewsContainer = modal.querySelector('.reviews-container');
  
  if (reviews[restaurantId] && reviews[restaurantId].length > 0) {
    reviews[restaurantId].forEach(review => {
      const reviewElement = document.createElement('div');
      reviewElement.className = 'review-item';
      reviewElement.innerHTML = `
        <div class="review-header">
          <div class="reviewer-info">
            <span class="reviewer-name">${review.name}</span>
            <div class="review-rating">
              ${getStarsHTML(review.rating)}
            </div>
          </div>
          <div class="review-date">${formatDate(review.date)}</div>
        </div>
        <div class="review-comment">${review.comment}</div>
      `;
      
      reviewsContainer.appendChild(reviewElement);
    });
  } else {
    reviewsContainer.innerHTML = '<p>Aucun avis pour le moment.</p>';
  }
  
  // Gérer la fermeture de la modal
  const closeBtn = modal.querySelector('.close-modal');
  closeBtn.addEventListener('click', () => {
    document.body.removeChild(modal);
  });
  
  // Fermer la modal si on clique en dehors
  window.addEventListener('click', (e) => {
    if (e.target === modal) {
      document.body.removeChild(modal);
    }
  });
}

/**
 * Affiche une fenêtre modale pour ajouter un avis
 */
function showAddReviewModal(restaurantId) {
  // Créer l'élément de la modal
  const modal = document.createElement('div');
  modal.className = 'reviews-modal';
  modal.innerHTML = `
    <div class="reviews-modal-content">
      <span class="close-modal">&times;</span>
      <h2>Laisser un avis pour ${getRestaurantNameById(restaurantId)}</h2>
      
      <form class="review-form" data-restaurant="${restaurantId}">
        <div class="form-group">
          <label for="name">Nom</label>
          <input type="text" id="name" name="name" required>
        </div>
        
        <div class="form-group">
          <label for="email">Email (ne sera pas publié)</label>
          <input type="email" id="email" name="email" required>
        </div>
        
        <div class="form-group">
          <label>Note</label>
          <div class="star-rating">
            <input type="radio" id="star5" name="rating" value="5" required>
            <label for="star5">★</label>
            <input type="radio" id="star4" name="rating" value="4">
            <label for="star4">★</label>
            <input type="radio" id="star3" name="rating" value="3">
            <label for="star3">★</label>
            <input type="radio" id="star2" name="rating" value="2">
            <label for="star2">★</label>
            <input type="radio" id="star1" name="rating" value="1">
            <label for="star1">★</label>
          </div>
        </div>
        
        <div class="form-group">
          <label for="comment">Votre avis</label>
          <textarea id="comment" name="comment" rows="5" required></textarea>
        </div>
        
        <button type="submit" class="submit-review-btn">Publier mon avis</button>
      </form>
      
      <div id="review-confirmation-${restaurantId}" class="review-confirmation" style="display: none;">
        Merci pour votre avis ! Il a été publié avec succès.
      </div>
    </div>
  `;
  
  // Ajouter la modal au corps de la page
  document.body.appendChild(modal);
  
  // Configurer le formulaire
  setupReviewForms();
  
  // Gérer la fermeture de la modal
  const closeBtn = modal.querySelector('.close-modal');
  closeBtn.addEventListener('click', () => {
    document.body.removeChild(modal);
  });
  
  // Fermer la modal si on clique en dehors
  window.addEventListener('click', (e) => {
    if (e.target === modal) {
      document.body.removeChild(modal);
    }
  });
}

/**
 * Affiche les avis sur la page détaillée d'un restaurant
 */
function displayRestaurantReviews(restaurantId) {
  const reviewsSection = document.querySelector('.reviews-section');
  if (!reviewsSection) return;
  
  // Nettoyer la section des avis (garder le titre)
  const title = reviewsSection.querySelector('h2');
  reviewsSection.innerHTML = '';
  reviewsSection.appendChild(title);
  
  // Ajouter les contrôles pour filtrer/trier
  const controlsContainer = document.createElement('div');
  controlsContainer.className = 'reviews-controls';
  controlsContainer.innerHTML = `
    <div class="reviews-count">
      <span id="reviews-total">${reviews[restaurantId] ? reviews[restaurantId].length : 0}</span> avis
    </div>
    <div class="reviews-sort">
      <label for="sort-reviews">Trier par :</label>
      <select id="sort-reviews">
        <option value="date-desc">Plus récent</option>
        <option value="date-asc">Plus ancien</option>
        <option value="rating-desc">Note (élevée à faible)</option>
        <option value="rating-asc">Note (faible à élevée)</option>
      </select>
    </div>
    <div class="reviews-filter">
      <label for="filter-reviews">Filtrer par note :</label>
      <select id="filter-reviews">
        <option value="all">Toutes les notes</option>
        <option value="5">5 étoiles</option>
        <option value="4">4 étoiles</option>
        <option value="3">3 étoiles</option>
        <option value="2">2 étoiles</option>
        <option value="1">1 étoile</option>
      </select>
    </div>
  `;
  reviewsSection.appendChild(controlsContainer);
  
  // Conteneur pour les avis
  const reviewsContainer = document.createElement('div');
  reviewsContainer.className = 'reviews-container';
  reviewsSection.appendChild(reviewsContainer);
  
  // Ajouter le formulaire d'avis
  const reviewFormContainer = document.createElement('div');
  reviewFormContainer.className = 'add-review-container';
  reviewFormContainer.innerHTML = `
    <h3>Laisser un avis</h3>
    <form class="review-form" data-restaurant="${restaurantId}">
      <div class="form-row">
        <div class="form-group">
          <label for="name">Nom</label>
          <input type="text" id="name" name="name" class="form-control" required>
        </div>
        <div class="form-group">
          <label for="email">Email (ne sera pas publié)</label>
          <input type="email" id="email" name="email" class="form-control" required>
        </div>
      </div>
      
      <div class="form-group">
        <label>Note</label>
        <div class="star-rating">
          <input type="radio" id="star5" name="rating" value="5" required>
          <label for="star5">★</label>
          <input type="radio" id="star4" name="rating" value="4">
          <label for="star4">★</label>
          <input type="radio" id="star3" name="rating" value="3">
          <label for="star3">★</label>
          <input type="radio" id="star2" name="rating" value="2">
          <label for="star2">★</label>
          <input type="radio" id="star1" name="rating" value="1">
          <label for="star1">★</label>
        </div>
      </div>
      
      <div class="form-group">
        <label for="comment">Votre avis</label>
        <textarea id="comment" name="comment" class="form-control" rows="4" required></textarea>
      </div>
      
      <button type="submit" class="btn submit-review-btn">Publier mon avis</button>
    </form>
    
    <div id="review-confirmation-${restaurantId}" class="review-confirmation" style="display: none;">
      Merci pour votre avis ! Il a été publié avec succès.
    </div>
  `;
  reviewsSection.appendChild(reviewFormContainer);
  
  // Afficher les avis
  displayFilteredReviews(restaurantId, 'all', 'date-desc');
  
  // Configurer les événements de tri et de filtrage
  const sortSelect = document.getElementById('sort-reviews');
  const filterSelect = document.getElementById('filter-reviews');
  
  if (sortSelect && filterSelect) {
    sortSelect.addEventListener('change', () => {
      const filterValue = filterSelect.value;
      const sortValue = sortSelect.value;
      displayFilteredReviews(restaurantId, filterValue, sortValue);
    });
    
    filterSelect.addEventListener('change', () => {
      const filterValue = filterSelect.value;
      const sortValue = sortSelect.value;
      displayFilteredReviews(restaurantId, filterValue, sortValue);
    });
  }
}

/**
 * Affiche les avis filtrés et triés
 */
function displayFilteredReviews(restaurantId, filterValue, sortValue) {
  const reviewsContainer = document.querySelector('.reviews-container');
  if (!reviewsContainer) return;
  
  // Nettoyer le conteneur
  reviewsContainer.innerHTML = '';
  
  // Filtrer les avis
  let filteredReviews = [];
  
  if (reviews[restaurantId]) {
    filteredReviews = reviews[restaurantId].filter(review => {
      if (filterValue === 'all') return true;
      return review.rating === parseInt(filterValue);
    });
    
    // Mettre à jour le compteur
    const reviewsTotal = document.getElementById('reviews-total');
    if (reviewsTotal) {
      reviewsTotal.textContent = filteredReviews.length;
    }
    
    // Trier les avis
    filteredReviews.sort((a, b) => {
      if (sortValue === 'date-desc') {
        return new Date(b.date) - new Date(a.date);
      } else if (sortValue === 'date-asc') {
        return new Date(a.date) - new Date(b.date);
      } else if (sortValue === 'rating-desc') {
        return b.rating - a.rating;
      } else if (sortValue === 'rating-asc') {
        return a.rating - b.rating;
      }
      return 0;
    });
    
    // Afficher les avis
    filteredReviews.forEach(review => {
      const reviewElement = document.createElement('div');
      reviewElement.className = 'review-card';
      reviewElement.innerHTML = `
        <div class="review-header">
          <div class="reviewer-info">
            <div class="reviewer-avatar">
              <img src="https://source.unsplash.com/100x100/?person&random=${Math.random()}" alt="${review.name}">
            </div>
            <div class="reviewer-name">${review.name}</div>
          </div>
          <div class="review-rating">
            ${getStarsHTML(review.rating)}
          </div>
        </div>
        <p class="review-content">${review.comment}</p>
        <div class="review-date">${formatDate(review.date)}</div>
      `;
      
      reviewsContainer.appendChild(reviewElement);
    });
  }
  
  // Message si aucun avis
  if (filteredReviews.length === 0) {
    reviewsContainer.innerHTML = '<p class="no-reviews">Aucun avis correspondant aux critères.</p>';
  }
}

/**
 * Génère le HTML pour afficher les étoiles selon la note
 */
function getStarsHTML(rating) {
  let starsHTML = '';
  
  for (let i = 1; i <= 5; i++) {
    if (i <= rating) {
      starsHTML += '<span class="star">★</span>';
    } else {
      starsHTML += '<span class="star empty">☆</span>';
    }
  }
  
  return starsHTML;
}

/**
 * Formate une date au format français
 */
function formatDate(dateStr) {
  const date = new Date(dateStr);
  const options = { day: 'numeric', month: 'long', year: 'numeric' };
  return date.toLocaleDateString('fr-FR', options);
}

/**
 * Récupère le nom lisible d'un restaurant à partir de son identifiant
 */
function getRestaurantNameById(restaurantId) {
  const restaurantNames = {
    'kafkaf': 'Kafkaf',
    'epicerie-du-nord': 'L\'Épicerie du Nord',
    'saveurs-orient': 'Saveurs d\'Orient',
    'maison-mere': 'La Maison Mère',
    'dessance': 'Dessance'
  };
  
  return restaurantNames[restaurantId] || restaurantId;
}

/**
 * Configure le système de notation avec étoiles
 */
function setupRatingSystem() {
  // Configurer les interactions pour les étoiles dans les formulaires
  document.querySelectorAll('.star-rating input').forEach(input => {
    input.addEventListener('change', function() {
      const rating = this.value;
      const starLabels = this.parentNode.querySelectorAll('label');
      
      starLabels.forEach((label, index) => {
        if (index < rating) {
          label.classList.add('selected');
        } else {
          label.classList.remove('selected');
        }
      });
    });
  });
}

/**
 * Configure les options de tri et de filtrage
 */
function setupReviewSorting() {
  // Géré dans displayRestaurantReviews
}

// Initialiser le système d'avis quand le document est chargé
document.addEventListener('DOMContentLoaded', initReviewsSystem);
