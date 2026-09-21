import { CategoryDef } from '../types.ts';

export const WORLD_COUNTRIES: string[] = [
  "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Argentina", "Armenia", "Australia", "Austria", "Azerbaijan",
  "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan", "Bolivia",
  "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi", "Cambodia", "Cameroon", "Canada", "Chile",
  "China", "Colombia", "Congo", "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czech Republic", "Denmark", "Ecuador",
  "Egypt", "El Salvador", "Eritrea", "Estonia", "Ethiopia", "Fiji", "Finland", "France", "Gabon", "Gambia",
  "Georgia", "Germany", "Ghana", "Greece", "Guatemala", "Guinea", "Guyana", "Haiti", "Honduras", "Hungary",
  "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy", "Ivory Coast", "Jamaica",
  "Japan", "Jordan", "Kazakhstan", "Kenya", "Kuwait", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia",
  "Libya", "Lithuania", "Luxembourg", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Mexico",
  "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar", "Namibia", "Nepal", "Netherlands",
  "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Korea", "Norway", "Oman", "Pakistan", "Panama", "Paraguay",
  "Peru", "Philippines", "Poland", "Portugal", "Qatar", "Romania", "Russia", "Rwanda", "Saudi Arabia", "Senegal",
  "Serbia", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Somalia", "South Africa", "South Korea", "Spain", "Sri Lanka",
  "Sudan", "Swaziland", "Sweden", "Switzerland", "Syria", "Taiwan", "Tanzania", "Thailand", "Togo", "Trinidad & Tobago",
  "Tunisia", "Turkey", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States", "Uruguay", "Uzbekistan", "Venezuela",
  "Vietnam", "Yemen", "Zambia", "Zimbabwe"
];

export const CATEGORIES: Record<string, CategoryDef> = {
  electronics: {
    label: 'Electronics',
    icon: 'ri-macbook-line',
    desc: 'Consumer electronics, smartphones, gadgets, laptops, and commercial machinery.',
    crops: [
      { id: 'smartphones', name: 'Smartphones & Tablets', icon: 'ri-smartphone-line' },
      { id: 'laptops', name: 'Laptops & Computers', icon: 'ri-macbook-line' },
      { id: 'tv_audio', name: 'TVs & Audio Systems', icon: 'ri-tv-2-line' },
      { id: 'cameras', name: 'Cameras & Photography', icon: 'ri-camera-3-line' },
      { id: 'home_appliances', name: 'Home Appliances', icon: 'ri-plug-2-line' }
    ]
  },
  automobiles: {
    label: 'Cars & Auto',
    icon: 'ri-car-line',
    desc: 'Commercial vehicles, sedans, trucks, spare parts, and vehicle accessories.',
    crops: [
      { id: 'sedans_hatchbacks', name: 'Sedans & Hatchbacks', icon: 'ri-car-fill' },
      { id: 'suvs_trucks', name: 'SUVs, Trucks & Pickups', icon: 'ri-truck-line' },
      { id: 'motorcycles', name: 'Motorcycles & Scooters', icon: 'ri-motorbike-line' },
      { id: 'auto_parts', name: 'Auto Spare Parts', icon: 'ri-settings-4-line' },
      { id: 'tires_wheels', name: 'Tires & Wheels', icon: 'ri-steering-2-line' }
    ]
  },
  stationery: {
    label: 'Stationery',
    icon: 'ri-book-open-line',
    desc: 'School supplies, commercial office stationery, textbooks, and printing equipment.',
    crops: [
      { id: 'notebooks_paper', name: 'Notebooks & Paper', icon: 'ri-file-text-line' },
      { id: 'pens_writing', name: 'Pens & Writing Tools', icon: 'ri-pencil-line' },
      { id: 'office_supplies', name: 'Office Supplies', icon: 'ri-briefcase-4-line' },
      { id: 'textbooks', name: 'Textbooks & Books', icon: 'ri-book-read-line' },
      { id: 'printers_ink', name: 'Printers & Ink', icon: 'ri-printer-line' }
    ]
  },
  clothes: {
    label: 'Clothes & Fashion',
    icon: 'ri-shirt-line',
    desc: 'Garments, tailored suits, footwear, textiles, and certified work uniforms.',
    crops: [
      { id: 'mens_wear', name: "Men's Clothing", icon: 'ri-t-shirt-line' },
      { id: 'womens_wear', name: "Women's Clothing", icon: 'ri-women-line' },
      { id: 'footwear', name: 'Shoes & Footwear', icon: 'ri-footprint-line' },
      { id: 'bags_accessories', name: 'Bags & Accessories', icon: 'ri-handbag-line' },
      { id: 'workwear_uniforms', name: 'Workwear & Uniforms', icon: 'ri-shield-user-line' }
    ]
  },
  food_items: {
    label: 'Food Items',
    icon: 'ri-restaurant-2-line',
    desc: 'Grains, processed grocery items, bulk flour, meat, and dairy produce.',
    crops: [
      { id: 'grains_cereals', name: 'Grains, Rice & Flour', icon: 'ri-seedling-line' },
      { id: 'meat_poultry', name: 'Meat & Poultry', icon: 'ri-restaurant-line' },
      { id: 'dairy_eggs', name: 'Dairy & Eggs', icon: 'ri-cup-line' },
      { id: 'cooking_oil_spices', name: 'Oils & Spices', icon: 'ri-flask-line' },
      { id: 'beverages_snacks', name: 'Beverages & Snacks', icon: 'ri-drinks-line' }
    ]
  },
  horticulture: {
    label: 'Horticulture & Fruits',
    icon: 'ri-plant-line',
    desc: 'Fresh orchard fruits, avocados, mangoes, citrus, and international produce.',
    crops: [
      { id: 'mango', name: 'Mangoes', icon: 'ri-leaf-line' },
      { id: 'avocado', name: 'Avocados', icon: 'ri-seedling-fill' },
      { id: 'citrus', name: 'Citrus Fruits', icon: 'ri-sun-cloudy-line' },
      { id: 'banana', name: 'Bananas', icon: 'ri-tree-line' },
      { id: 'macadamia', name: 'Macadamia Nuts', icon: 'ri-shape-2-line' }
    ]
  },
  vegetables: {
    label: 'Vegetables & Crops',
    icon: 'ri-leaf-line',
    desc: 'Fresh farm harvests, greenhouse produce, and commercial cash crops.',
    crops: [
      { id: 'tomato', name: 'Tomatoes', icon: 'ri-bubble-chart-line' },
      { id: 'onion', name: 'Onions', icon: 'ri-contrast-drop-2-line' },
      { id: 'potato', name: 'Potatoes', icon: 'ri-database-2-line' },
      { id: 'cabbage', name: 'Cabbages', icon: 'ri-plant-fill' },
      { id: 'tobacco', name: 'Tobacco & Cash Crops', icon: 'ri-fire-line' }
    ]
  }
};

export function getSvgPlaceholder(title: string, _iconClass?: string, color = '#ff6b35'): string {
  const safeTitle = (title || 'Trade Product')
    .replace(/[&<>"']/g, (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m] || m));
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="260" viewBox="0 0 400 260">
    <defs>
      <linearGradient id="ptkGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#18181b"/>
        <stop offset="100%" stop-color="#09090b"/>
      </linearGradient>
    </defs>
    <rect width="400" height="260" fill="url(#ptkGrad)"/>
    <rect x="1" y="1" width="398" height="258" rx="8" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="1.5"/>
    <circle cx="200" cy="105" r="44" fill="${color}" fill-opacity="0.12" stroke="${color}" stroke-opacity="0.4" stroke-width="2"/>
    <path d="M188 95 L212 95 L200 115 Z" fill="${color}" fill-opacity="0.8"/>
    <circle cx="200" cy="115" r="4" fill="#ffffff"/>
    <text x="200" y="180" font-family="'Inter', system-ui, sans-serif" font-size="16" font-weight="700" fill="#f4f4f5" text-anchor="middle">${safeTitle}</text>
    <text x="200" y="204" font-family="'Inter', system-ui, sans-serif" font-size="12" font-weight="500" fill="#a1a1aa" text-anchor="middle">PTK-LINK VERIFIED TRADE</text>
  </svg>`;
  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
}
