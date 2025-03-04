// Gestion des données des restaurants
import { getRandomRestaurantImage, getGalleryImages } from './imageService.js';

// La liste des restaurants
const restaurantsData = [
    {
        id: 'kafkaf',
        name: 'Kafkaf',
        cuisine: 'Middle Eastern',
        priceRange: '€€',
        rating: 4.9,
        address: '7 Rue Keller, 75011 Paris',
        phone: '01 43 57 34 37',
        website: 'https://kafkaf.fr',
        openingHours: {
            monday: '12:00-22:30',
            tuesday: '12:00-22:30',
            wednesday: '12:00-22:30',
            thursday: '12:00-22:30',
            friday: '12:00-23:00',
            saturday: '12:00-23:00',
            sunday: '12:00-22:00'
        },
        description: 'Brunch créatif et ambiance cosy avec une cuisine d\'inspiration du Moyen-Orient',
        longDescription: 'Situé au cœur du 11ème arrondissement de Paris, Kafkaf est un havre de paix où se mêlent saveurs du Moyen-Orient et atmosphère décontractée. Leurs falafels croustillants à l\'extérieur et moelleux à l\'intérieur sont légendaires, tout comme leurs salades fraîches aux herbes aromatiques. Le cadre, avec ses murs bruts et ses touches de verdure, invite à la détente.',
        specialties: ['Falafels', 'Houmous maison', 'Shakshuka', 'Labneh aux herbes'],
        imageUrl: '', // Sera rempli par l'API
        galleryImages: [], // Sera rempli par l'API
        location: {
            lat: 48.8561,
            lng: 2.3822
        },
        reviews: [
            {
                author: 'Sophie L.',
                rating: 5,
                date: '2024-02-15',
                content: 'Les meilleurs falafels de Paris ! Service impeccable, ambiance chaleureuse.'
            },
            {
                author: 'Marc T.',
                rating: 4.5,
                date: '2024-01-28',
                content: 'Excellente cuisine, très bonne cave à vins. Un peu bruyant en soirée.'
            }
        ]
    },
    {
        id: 'lepicerie-du-nord',
        name: 'L\'Épicerie du Nord',
        cuisine: 'Indien',
        priceRange: '€€',
        rating: 4.8,
        address: '5 Rue des Petites Écuries, 75010 Paris',
        phone: '01 42 46 03 38',
        website: 'https://epiceriedunord.fr',
        openingHours: {
            monday: 'Fermé',
            tuesday: '18:30-22:30',
            wednesday: '18:30-22:30',
            thursday: '18:30-22:30',
            friday: '18:30-23:00',
            saturday: '12:00-15:00, 18:30-23:00',
            sunday: '12:00-15:00, 18:30-22:00'
        },
        description: 'Cuisine traditionnelle indienne authentique dans le quartier de la Gare du Nord',
        longDescription: 'L\'Épicerie du Nord est un authentique restaurant indien caché dans une rue tranquille du 10ème arrondissement. Les épices sont importées directement du sous-continent, et les plats sont préparés selon des recettes familiales transmises depuis des générations. Le tandoor (four traditionnel) produit des naans incomparables et des viandes tendres aux saveurs fumées.',
        specialties: ['Butter chicken', 'Biryani d\'agneau', 'Naan au fromage', 'Lassi à la rose'],
        imageUrl: '', // Sera rempli par l'API
        galleryImages: [], // Sera rempli par l'API
        location: {
            lat: 48.8766,
            lng: 2.3522
        },
        reviews: [
            {
                author: 'Jean-Pierre M.',
                rating: 5,
                date: '2024-03-01',
                content: 'Épices authentiques, saveurs incroyables. On se croirait à Delhi !'
            },
            {
                author: 'Camille D.',
                rating: 4.5,
                date: '2024-02-12',
                content: 'Le butter chicken est à tomber par terre. Petit bémol sur l\'attente en fin de semaine.'
            }
        ]
    },
    {
        id: 'saveurs-orient',
        name: 'Saveurs d\'Orient',
        cuisine: 'Marocain/Libanais',
        priceRange: '€€',
        rating: 4.8,
        address: '24 Passage des Panoramas, 75002 Paris',
        phone: '01 45 08 48 08',
        website: 'https://saveursdorient-paris.fr',
        openingHours: {
            monday: '12:00-15:00, 19:00-22:30',
            tuesday: '12:00-15:00, 19:00-22:30',
            wednesday: '12:00-15:00, 19:00-22:30',
            thursday: '12:00-15:00, 19:00-22:30',
            friday: '12:00-15:00, 19:00-23:00',
            saturday: '12:00-23:00',
            sunday: '12:00-22:00'
        },
        description: 'Cuisine orientale raffinée dans le cadre historique du Passage des Panoramas',
        longDescription: 'Nichée dans le pittoresque Passage des Panoramas, Saveurs d\'Orient propose un voyage culinaire entre Liban et Maroc. Dans un décor aux influences orientales délicates, vous dégusterez des mezzes préparés à la minute, des tajines mijotés longuement et des pâtisseries au miel et aux fruits secs. La sélection de thés parfumés complète parfaitement l\'expérience.',
        specialties: ['Mezze varié', 'Tajine d\'agneau aux pruneaux', 'Pastilla au poulet', 'Baklava maison'],
        imageUrl: '', // Sera rempli par l'API
        galleryImages: [], // Sera rempli par l'API
        location: {
            lat: 48.8721,
            lng: 2.3454
        },
        reviews: [
            {
                author: 'Pierre L.',
                rating: 5,
                date: '2024-02-18',
                content: 'Une explosion de saveurs ! Le cadre est magnifique et le service attentionné.'
            },
            {
                author: 'Nadia H.',
                rating: 4.5,
                date: '2024-01-25',
                content: 'Authentique cuisine orientale, comme chez ma grand-mère. Les pâtisseries sont divines.'
            }
        ]
    },
    {
        id: 'maison-mere',
        name: 'La Maison Mère',
        cuisine: 'Franco-Américain',
        priceRange: '€€€',
        rating: 4.7,
        address: '7 rue Mayran, 75009 Paris',
        phone: '01 42 85 44 58',
        website: 'https://lamaisonmere.fr',
        openingHours: {
            monday: '12:00-14:30, 19:00-22:30',
            tuesday: '12:00-14:30, 19:00-22:30',
            wednesday: '12:00-14:30, 19:00-22:30',
            thursday: '12:00-14:30, 19:00-22:30',
            friday: '12:00-14:30, 19:00-23:00',
            saturday: '11:00-15:00, 19:00-23:00',
            sunday: '11:00-16:00'
        },
        description: 'Bistrot mi-parisien mi-new-yorkais avec une ambiance décontractée',
        longDescription: 'La Maison Mère est le parfait hybride entre un bistrot parisien et un restaurant tendance de Brooklyn. Le menu marie habilement les techniques françaises aux influences américaines, offrant aussi bien un excellent steak-frites qu\'un burger gourmet. L\'intérieur industriel chic avec ses grandes verrières et ses banquettes en cuir crée une atmosphère à la fois élégante et décontractée.',
        specialties: ['Burger Maison Mère', 'César Salade au poulet fermier', 'Cheesecake New-Yorkais', 'Cocktails signature'],
        imageUrl: '', // Sera rempli par l'API
        galleryImages: [], // Sera rempli par l'API
        location: {
            lat: 48.8765,
            lng: 2.3451
        },
        reviews: [
            {
                author: 'Thomas D.',
                rating: 5,
                date: '2024-02-28',
                content: 'Le mix parfait entre France et USA. Les cocktails sont incroyables !'
            },
            {
                author: 'Emilie S.',
                rating: 4,
                date: '2024-01-31',
                content: 'Très bonne cuisine mais un peu bruyant le weekend. Le burger est mémorable.'
            }
        ]
    },
    {
        id: 'dessance',
        name: 'Dessance',
        cuisine: 'Gastronomique',
        priceRange: '€€€',
        rating: 4.7,
        address: '74 Rue des Archives, 75003 Paris',
        phone: '01 42 77 23 62',
        website: 'https://dessance.com',
        openingHours: {
            monday: 'Fermé',
            tuesday: '19:00-22:00',
            wednesday: '19:00-22:00',
            thursday: '12:00-14:00, 19:00-22:00',
            friday: '12:00-14:00, 19:00-22:30',
            saturday: '12:00-14:30, 19:00-22:30',
            sunday: '12:00-14:30'
        },
        description: 'Restaurant gastronomique primé dans le Marais, spécialisé dans la cuisine légère et créative',
        longDescription: 'Dessance est une adresse unique dans le Marais qui a révolutionné la gastronomie parisienne avec son approche innovante. Le chef propose une cuisine légère, où les légumes et fruits sont mis à l\'honneur dans des assiettes aussi belles que savoureuses. Le restaurant offre plusieurs menus dégustation qui changent au fil des saisons, mettant en avant les produits frais et locaux.',
        specialties: ['Menu dégustation saisonnier', 'Légumes oubliés', 'Poisson sauvage', 'Desserts végétaux'],
        imageUrl: '', // Sera rempli par l'API
        galleryImages: [], // Sera rempli par l'API
        location: {
            lat: 48.8589,
            lng: 2.3662
        },
        reviews: [
            {
                author: 'Marie F.',
                rating: 5,
                date: '2024-02-20',
                content: 'Une expérience culinaire exceptionnelle. Chaque bouchée est une surprise !'
            },
            {
                author: 'Laurent K.',
                rating: 4.5,
                date: '2024-01-15',
                content: 'Cuisine inventive et raffinée. La carte des vins est remarquable.'
            }
        ]
    }
];

// Fonction pour charger les données avec images depuis Pexels
export async function loadRestaurantsData() {
    // Créer une copie pour ne pas modifier l'original
    const enhancedData = JSON.parse(JSON.stringify(restaurantsData));
    
    try {
        // Pour chaque restaurant, récupérer des images si nécessaire
        for (const restaurant of enhancedData) {
            // Image principale
            if (!restaurant.imageUrl) {
                const searchQuery = `${restaurant.cuisine} restaurant food`;
                const imageData = await getRandomRestaurantImage(searchQuery);
                
                if (imageData) {
                    restaurant.imageUrl = imageData.url;
                    restaurant.imageCredit = {
                        photographer: imageData.photographer,
                        url: imageData.photographerUrl
                    };
                }
            }
            
            // Images de galerie
            if (!restaurant.galleryImages || restaurant.galleryImages.length === 0) {
                const galleryQuery = `${restaurant.name} ${restaurant.cuisine} food`;
                const galleryData = await getGalleryImages(galleryQuery, 3);
                
                if (galleryData && galleryData.length > 0) {
                    restaurant.galleryImages = galleryData.map(img => img.url);
                    restaurant.galleryCredits = galleryData;
                }
            }
        }
    } catch (error) {
        console.error("Erreur lors du chargement des images:", error);
    }
    
    return enhancedData;
}

// Fonction pour récupérer un restaurant par son ID
export async function getRestaurantById(id) {
    const restaurants = await loadRestaurantsData();
    return restaurants.find(restaurant => restaurant.id === id) || null;
}

export default { loadRestaurantsData, getRestaurantById };