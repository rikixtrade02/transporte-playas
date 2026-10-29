// ÚNICA fuente de datos del sitio. Edita aquí número, nombre, tarifas e imágenes.
const img = (f) => `${import.meta.env.BASE_URL}images/${f}`;

export const SITE_CONFIG = {
  businessName: "Tu Próxima Aventura",
  // REEMPLAZAR por el número real: 593 + móvil sin el cero inicial (12 dígitos en total).
  whatsappNumber: "593963294242",
  origin: "Guayaquil",
  defaultDepartureTime: "7:00 AM",
  defaultReturnTime: "5:00 PM",
  maxPassengers: 10,
  carousel: [
    { image: img("furgoneta_completa.jpeg"), label: "Exterior de la furgoneta" },
    { image: img("asientos_recogidos.jpeg"), label: "Asientos del interior" },
    { image: img("asientos_traseros.jpeg"), label: "Asientos del interior" },
    { image: img("asientos_plegados.jpeg"), label: "Asientos del interior" },
    { image: img("furgoneta_parte_trasera.jpeg"), label: "Parrilla superior y equipaje" },
  ],
  destinations: [
    { id: "villamil", name: "Villamil Playas", price: 100, originalPrice: 120, image: img("villamil.jpg"), description: "La playa más cercana a Guayaquil para un día completo en grupo." },
    { id: "salinas", name: "Salinas", price: 140, originalPrice: 165, image: img("salinas.jpg"), description: "Malecón y playa urbana para pasear sin complicaciones." },
    { id: "san-pablo", name: "San Pablo", price: 130, originalPrice: 150, image: img("san pablo.jpg"), description: "Una costa más tranquila para descansar con tu grupo." },
    { id: "ayangue", name: "Ayangue", price: 160, originalPrice: 170, image: img("ayangue.jpg"), description: "Bahía de aguas calmas para desconectarte junto al mar." },
    { id: "montanita", name: "Montañita", price: 170, originalPrice: 190, image: img("montañita.jpg"), description: "La escapada con más ambiente de la ruta." },
  ],
};
