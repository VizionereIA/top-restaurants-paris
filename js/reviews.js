// Système d'avis interactif pour les restaurants

class ReviewSystem {
    constructor(restaurantId) {
        this.restaurantId = restaurantId;
        this.reviewsKey = `reviews-${restaurantId}`;
        this.initializeElements();
        this.loadReviews();
        this.setupEventListeners();
    }

    initializeElements() {
        this.reviewForm = document.getElementById('review-form');
        this.reviewList = document.getElementById('reviews-list');
        this.averageRating = document.getElementById('average-rating');
        this.nameInput = document.getElementById('review-name');
        this.emailInput = document.getElementById('review-email');
        this.ratingInputs = document.querySelectorAll('input[name="rating"]');
        this.commentInput = document.getElementById('review-comment');
    }

    setupEventListeners() {
        if (this.reviewForm) {
            this.reviewForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.submitReview();
            });
        }
    }

    submitReview() {
        // Validation des champs
        if (!this.validateForm()) return;

        // Récupérer la note
        const rating = Array.from(this.ratingInputs)
            .find(input => input.checked)?.value;

        // Créer l'objet de review
        const review = {
            id: Date.now(),
            name: this.nameInput.value,
            email: this.emailInput.value || 'Anonyme',
            rating: parseInt(rating),
            comment: this.commentInput.value,
            date: new Date().toISOString()
        };

        // Récupérer les reviews existantes
        const reviews = this.getReviews();
        reviews.push(review);

        // Sauvegarder dans localStorage
        this.saveReviews(reviews);

        // Mettre à jour l'affichage
        this.renderReviews(reviews);

        // Réinitialiser le formulaire
        this.resetForm();
    }

    validateForm() {
        // Validation basique
        if (!this.nameInput.value.trim()) {
            alert('Veuillez entrer votre nom');
            return false;
        }

        if (!document.querySelector('input[name="rating"]:checked')) {
            alert('Veuillez sélectionner une note');
            return false;
        }

        if (!this.commentInput.value.trim()) {
            alert('Veuillez écrire un commentaire');
            return false;
        }

        return true;
    }

    getReviews() {
        const reviews = localStorage.getItem(this.reviewsKey);
        return reviews ? JSON.parse(reviews) : [];
    }

    saveReviews(reviews) {
        localStorage.setItem(this.reviewsKey, JSON.stringify(reviews));
    }

    renderReviews(reviews) {
        // Trier les reviews par date (les plus récentes en premier)
        reviews.sort((a, b) => new Date(b.date) - new Date(a.date));

        // Vider la liste actuelle
        if (this.reviewList) {
            this.reviewList.innerHTML = '';

            // Afficher chaque review
            reviews.forEach(review => {
                const reviewElement = this.createReviewElement(review);
                this.reviewList.appendChild(reviewElement);
            });
        }

        // Mettre à jour la note moyenne
        this.updateAverageRating(reviews);
    }

    createReviewElement(review) {
        const div = document.createElement('div');
        div.classList.add('review');
        
        // Convertir la date
        const reviewDate = new Date(review.date);
        const formattedDate = reviewDate.toLocaleDateString('fr-FR', {
            day: 'numeric', 
            month: 'long', 
            year: 'numeric'
        });

        // Créer le HTML pour l'élément de review
        div.innerHTML = `
            <div class="review-header">
                <span class="review-name">${review.name}</span>
                <span class="review-date">${formattedDate}</span>
            </div>
            <div class="review-rating">
                ${'★'.repeat(review.rating)}${'☆'.repeat(5 - review.rating)}
            </div>
            <p class="review-comment">${review.comment}</p>
        `;

        return div;
    }

    updateAverageRating(reviews) {
        if (reviews.length === 0) {
            if (this.averageRating) {
                this.averageRating.textContent = 'Aucun avis';
            }
            return;
        }

        const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
        const averageRating = (totalRating / reviews.length).toFixed(1);

        if (this.averageRating) {
            this.averageRating.textContent = `Note moyenne : ${averageRating}/5`;
        }
    }

    resetForm() {
        this.reviewForm.reset();
        // Décocher toutes les étoiles
        this.ratingInputs.forEach(input => input.checked = false);
    }

    // Initialisation du système de reviews pour un restaurant spécifique
    static initForRestaurant(restaurantId) {
        return new ReviewSystem(restaurantId);
    }
}

// Initialiser le système de reviews quand le DOM est chargé
document.addEventListener('DOMContentLoaded', () => {
    // Vérifie s'il y a un identifiant de restaurant dans l'URL
    const urlParams = new URLSearchParams(window.location.search);
    const restaurantId = urlParams.get('id') || 'default';
    
    ReviewSystem.initForRestaurant(restaurantId);
});

export default ReviewSystem;