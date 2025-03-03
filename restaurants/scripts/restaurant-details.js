/**
 * Script pour la page détaillée des restaurants
 */

// Fonction pour changer l'image principale de la galerie
function changeImage(src) {
  document.getElementById('main-image').src = src;
}

// Fonction pour initialiser la carte Google Maps
function initMap() {
  // Coordonnées du restaurant Kafkaf
  const restaurantLocation = { lat: 48.853798, lng: 2.371611 };
  
  // Créer une nouvelle carte centrée sur le restaurant
  const map = new google.maps.Map(document.getElementById("map"), {
    zoom: 15,
    center: restaurantLocation,
  });
  
  // Ajouter un marqueur à l'emplacement du restaurant
  const marker = new google.maps.Marker({
    position: restaurantLocation,
    map: map,
    title: "Kafkaf",
  });
  
  // Ajouter une info-bulle au marqueur
  const infoWindow = new google.maps.InfoWindow({
    content: `
      <div style="padding: 10px;">
        <h3 style="margin: 0; margin-bottom: 5px;">Kafkaf</h3>
        <p style="margin: 0; margin-bottom: 5px;">7 Rue Keller, 75011 Paris</p>
        <p style="margin: 0;"><a href="https://www.google.com/maps/dir/?api=1&destination=48.853798,2.371611" target="_blank">Itinéraire</a></p>
      </div>
    `,
  });
  
  // Ouvrir l'info-bulle lorsqu'on clique sur le marqueur
  marker.addListener("click", () => {
    infoWindow.open(map, marker);
  });
  
  // Ouvrir l'info-bulle par défaut pour montrer l'emplacement
  infoWindow.open(map, marker);
}

// Gestionnaire d'événements pour les catégories de menu
document.addEventListener('DOMContentLoaded', function() {
  // Récupérer tous les boutons de catégorie
  const categoryButtons = document.querySelectorAll('.menu-category');
  
  // Ajouter un gestionnaire d'événement pour chaque bouton
  categoryButtons.forEach(button => {
    button.addEventListener('click', function() {
      // Récupérer la catégorie ciblée
      const targetCategory = this.dataset.category;
      
      // Masquer toutes les sections de menu
      document.querySelectorAll('.menu-items').forEach(section => {
        section.style.display = 'none';
      });
      
      // Afficher la section de menu correspondante
      document.getElementById(targetCategory).style.display = 'grid';
      
      // Supprimer la classe active de tous les boutons
      categoryButtons.forEach(btn => {
        btn.classList.remove('active');
      });
      
      // Ajouter la classe active au bouton cliqué
      this.classList.add('active');
    });
  });
  
  // Gestionnaire pour le formulaire de réservation
  const reservationForm = document.querySelector('.reservation-form');
  if (reservationForm) {
    reservationForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Simuler une réservation réussie
      const name = document.getElementById('name').value;
      const date = document.getElementById('date').value;
      const time = document.getElementById('time').value;
      const guests = document.getElementById('guests').value;
      
      alert(`Merci ${name} ! Votre réservation pour ${guests} personne(s) le ${date} à ${time} a été enregistrée. Vous recevrez un email de confirmation prochainement.`);
      
      // Réinitialiser le formulaire
      this.reset();
    });
  }
});
