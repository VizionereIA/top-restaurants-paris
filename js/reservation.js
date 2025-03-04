// Système de réservation interactif

class ReservationSystem {
    constructor(restaurantName) {
        this.restaurantName = restaurantName;
        this.initializeElements();
        this.setupEventListeners();
    }

    initializeElements() {
        this.reservationForm = document.getElementById('reservation-form');
        this.nameInput = document.getElementById('reservation-name');
        this.emailInput = document.getElementById('reservation-email');
        this.dateInput = document.getElementById('reservation-date');
        this.timeInput = document.getElementById('reservation-time');
        this.guestsInput = document.getElementById('reservation-guests');
        this.specialRequestsInput = document.getElementById('reservation-special-requests');
        this.confirmationModal = document.getElementById('reservation-confirmation');
        this.confirmationDetails = document.getElementById('confirmation-details');
    }

    setupEventListeners() {
        if (this.reservationForm) {
            this.reservationForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.submitReservation();
            });

            // Validation en temps réel
            this.setupValidation();
        }
    }

    setupValidation() {
        const requiredFields = [
            this.nameInput, 
            this.emailInput, 
            this.dateInput, 
            this.timeInput, 
            this.guestsInput
        ];

        requiredFields.forEach(field => {
            field.addEventListener('input', () => {
                this.validateField(field);
            });
        });
    }

    validateField(field) {
        if (!field.value.trim()) {
            field.classList.add('invalid');
            return false;
        } else {
            field.classList.remove('invalid');
            return true;
        }
    }

    submitReservation() {
        // Validation de tous les champs
        const requiredFields = [
            this.nameInput, 
            this.emailInput, 
            this.dateInput, 
            this.timeInput, 
            this.guestsInput
        ];

        const isValid = requiredFields.every(field => this.validateField(field));

        if (!isValid) {
            alert('Veuillez remplir tous les champs obligatoires.');
            return;
        }

        // Créer l'objet de réservation
        const reservation = {
            restaurantName: this.restaurantName,
            name: this.nameInput.value,
            email: this.emailInput.value,
            date: this.dateInput.value,
            time: this.timeInput.value,
            guests: this.guestsInput.value,
            specialRequests: this.specialRequestsInput.value || 'Aucune',
            id: this.generateReservationId()
        };

        // Sauvegarder dans localStorage
        this.saveReservation(reservation);

        // Afficher la confirmation
        this.showConfirmation(reservation);

        // Réinitialiser le formulaire
        this.resetForm();
    }

    generateReservationId() {
        return `RSV-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }

    saveReservation(reservation) {
        const reservations = JSON.parse(localStorage.getItem('restaurant-reservations') || '[]');
        reservations.push(reservation);
        localStorage.setItem('restaurant-reservations', JSON.stringify(reservations));
    }

    showConfirmation(reservation) {
        if (this.confirmationModal && this.confirmationDetails) {
            this.confirmationDetails.innerHTML = `
                <h3>Réservation confirmée !</h3>
                <p><strong>Restaurant :</strong> ${reservation.restaurantName}</p>
                <p><strong>Nom :</strong> ${reservation.name}</p>
                <p><strong>Date :</strong> ${reservation.date}</p>
                <p><strong>Heure :</strong> ${reservation.time}</p>
                <p><strong>Nombre de personnes :</strong> ${reservation.guests}</p>
                <p><strong>Numéro de réservation :</strong> ${reservation.id}</p>
            `;
            this.confirmationModal.classList.add('show');
        }
    }

    resetForm() {
        this.reservationForm.reset();
    }

    static initForRestaurant(restaurantName) {
        return new ReservationSystem(restaurantName);
    }
}

// Initialisation pour tous les restaurants
document.addEventListener('DOMContentLoaded', () => {
    const restaurantName = document.querySelector('h1').textContent;
    ReservationSystem.initForRestaurant(restaurantName);
});

export default ReservationSystem;