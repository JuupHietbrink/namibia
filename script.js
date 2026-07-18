// Highlight active section in nav
const sections = document.querySelectorAll('.section');
const navLinks = document.querySelectorAll('.topnav a');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.id;
      navLinks.forEach(l => {
        l.style.color = l.getAttribute('href') === `#${id}` ? 'var(--terracotta)' : '';
      });
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' });

sections.forEach(s => observer.observe(s));

// --- Trip map (Leaflet) --------------------------------------------------
// Load Leaflet from CDN then draw the route.
function initTripMap() {
  const el = document.getElementById('trip-map');
  if (!el || typeof L === 'undefined') return;

  const stops = [
    {
      n: 1, lat: -22.5609, lng: 17.0658, name: 'Windhoek — Kuiseb House',
      dates: 'do 17 sep',
      note: 'Aankomst, auto ophalen bij Bushbundu, boodschappen en eerste nacht.'
    },
    {
      n: 2, lat: -24.4855, lng: 15.8018, name: 'Sesriem — Sossus Oasis & Little Sossus',
      dates: 'vr 18 – za 19 sep',
      note: 'Sossusvlei, Dune 45, Deadvlei, Sesriem Canyon.'
    },
    {
      n: 3, lat: -22.6837, lng: 14.5289, name: 'Swakopmund — Alte Brücke',
      dates: 'zo 20 – ma 21 sep',
      note: 'Atlantische kust, Sandwich Harbour 4×4-tour, Walvis Bay.'
    },
    {
      n: 4, lat: -21.8264, lng: 15.1901, name: 'Spitzkoppe Rest Camp',
      dates: 'di 22 sep',
      note: 'Graniet-inselbergen, Arch Rock sunset, spectaculaire sterrenhemel.'
    },
    {
      n: 5, lat: -21.5486, lng: 15.6425, name: 'Erongo — Omandumba Split Apple',
      dates: 'wo 23 – do 24 sep',
      note: 'San Living Museum, Ai-Aiba rock paintings, Erongo Mountain Winery.'
    },
    {
      n: 6, lat: -19.1802, lng: 15.9174, name: 'Etosha West — Trading Post & Etosha Village',
      dates: 'vr 25 – zo 27 sep',
      note: 'Andersson Gate, Okaukuejo waterhole, game drives door west-Etosha.'
    },
    {
      n: 7, lat: -18.8138, lng: 17.0521, name: 'Etosha Oost — Mokuti Etosha Lodge',
      dates: 'ma 28 – di 29 sep',
      note: 'Doorrit door Etosha, half board, spa & chill-dag.'
    },
    {
      n: 8, lat: -20.3625, lng: 17.0158, name: 'Otjiwarongo — Aloegrove Safari Lodge',
      dates: 'wo 30 sep',
      note: 'Half board, game drive 16:00, laatste nacht van de trip.'
    }
  ];

  // Windhoek airport (start + eind van de rondrit)
  const airport = { lat: -22.4799, lng: 17.4709, name: 'Hosea Kutako Intl. Airport' };

  const map = L.map('trip-map', {
    scrollWheelZoom: false,
    zoomControl: true,
  });

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap</a>',
    maxZoom: 18,
  }).addTo(map);

  // Polyline in reisvolgorde: airport → stops → airport
  const route = [ [airport.lat, airport.lng], ...stops.map(s => [s.lat, s.lng]), [airport.lat, airport.lng] ];
  L.polyline(route, {
    color: '#a0522d',
    weight: 3,
    opacity: 0.85,
    dashArray: '6 6',
  }).addTo(map);

  // Airport markers (start & end)
  const airStart = L.divIcon({
    className: '',
    html: '<div class="trip-marker start" title="Aankomst 17 sep">✈</div>',
    iconSize: [34, 34],
    iconAnchor: [17, 17],
  });
  const airEnd = L.divIcon({
    className: '',
    html: '<div class="trip-marker end" title="Vertrek 1 okt">✈</div>',
    iconSize: [34, 34],
    iconAnchor: [17, 17],
  });
  L.marker([airport.lat, airport.lng], { icon: airStart })
    .addTo(map)
    .bindPopup(`<strong>${airport.name}</strong><div class="popup-dates">Aankomst 17 sep · vertrek 1 okt</div>Start &amp; einde van de roadtrip.`);

  // Stop markers
  stops.forEach(stop => {
    const icon = L.divIcon({
      className: '',
      html: `<div class="trip-marker">${stop.n}</div>`,
      iconSize: [34, 34],
      iconAnchor: [17, 17],
    });
    L.marker([stop.lat, stop.lng], { icon })
      .addTo(map)
      .bindPopup(`<strong>${stop.name}</strong><div class="popup-dates">${stop.dates}</div>${stop.note}`);
  });

  // Fit to all points
  const bounds = L.latLngBounds(route);
  map.fitBounds(bounds, { padding: [40, 40] });

  // Re-enable scroll-zoom when the user actually clicks the map
  map.on('focus', () => map.scrollWheelZoom.enable());
  map.on('blur', () => map.scrollWheelZoom.disable());
}

function loadLeafletThenInit() {
  if (typeof L !== 'undefined') { initTripMap(); return; }
  const s = document.createElement('script');
  s.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
  s.onload = initTripMap;
  document.head.appendChild(s);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', loadLeafletThenInit);
} else {
  loadLeafletThenInit();
}
