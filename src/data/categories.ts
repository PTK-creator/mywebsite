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
    icon: '💻',
    desc: 'Consumer electronics, smartphones, gadgets, laptops, and commercial machinery.',
    crops: [
      { id: 'smartphones', name: 'Smartphones & Tablets', icon: '📱' },
      { id: 'laptops', name: 'Laptops & Computers', icon: '💻' },
      { id: 'tv_audio', name: 'TVs & Audio Systems', icon: '📺' },
      { id: 'cameras', name: 'Cameras & Photography', icon: '📷' },
      { id: 'home_appliances', name: 'Home Appliances', icon: '🔌' }
    ]
  },
  automobiles: {
    label: 'Cars & Auto',
    icon: '🚗',
    desc: 'Commercial vehicles, sedans, trucks, spare parts, and vehicle accessories.',
    crops: [
      { id: 'sedans_hatchbacks', name: 'Sedans & Hatchbacks', icon: '🚗' },
      { id: 'suvs_trucks', name: 'SUVs, Trucks & Pickups', icon: '🛻' },
      { id: 'motorcycles', name: 'Motorcycles & Scooters', icon: '🏍️' },
      { id: 'auto_parts', name: 'Auto Spare Parts', icon: '⚙️' },
      { id: 'tires_wheels', name: 'Tires & Wheels', icon: '🛞' }
    ]
  },
  stationery: {
    label: 'Stationery',
    icon: '📚',
    desc: 'School supplies, commercial office stationery, textbooks, and printing equipment.',
    crops: [
      { id: 'notebooks_paper', name: 'Notebooks & Paper', icon: '📄' },
      { id: 'pens_writing', name: 'Pens & Writing Tools', icon: '✏️' },
      { id: 'office_supplies', name: 'Office Supplies', icon: '✂️' },
      { id: 'textbooks', name: 'Textbooks & Books', icon: '📖' },
      { id: 'printers_ink', name: 'Printers & Ink', icon: '🖨️' }
    ]
  },
  clothes: {
    label: 'Clothes & Fashion',
    icon: '👕',
    desc: 'Garments, tailored suits, footwear, textiles, and certified work uniforms.',
    crops: [
      { id: 'mens_wear', name: "Men's Clothing", icon: '👔' },
      { id: 'womens_wear', name: "Women's Clothing", icon: '👗' },
      { id: 'footwear', name: 'Shoes & Footwear', icon: '👟' },
      { id: 'bags_accessories', name: 'Bags & Accessories', icon: '👜' },
      { id: 'workwear_uniforms', name: 'Workwear & Uniforms', icon: '🥼' }
    ]
  },
  food_items: {
    label: 'Food Items',
    icon: '🍎',
    desc: 'Grains, processed grocery items, bulk flour, meat, and dairy produce.',
    crops: [
      { id: 'grains_cereals', name: 'Grains, Rice & Flour', icon: '🌾' },
      { id: 'meat_poultry', name: 'Meat & Poultry', icon: '🥩' },
      { id: 'dairy_eggs', name: 'Dairy & Eggs', icon: '🧀' },
      { id: 'cooking_oil_spices', name: 'Oils & Spices', icon: '🍾' },
      { id: 'beverages_snacks', name: 'Beverages & Snacks', icon: '🧃' }
    ]
  },
  horticulture: {
    label: 'Horticulture & Fruits',
    icon: '🥭',
    desc: 'Fresh orchard fruits, avocados, mangoes, citrus, and international produce.',
    crops: [
      { id: 'mango', name: 'Mangoes', icon: '🥭' },
      { id: 'avocado', name: 'Avocados', icon: '🥑' },
      { id: 'citrus', name: 'Citrus Fruits', icon: '🍊' },
      { id: 'banana', name: 'Bananas', icon: '🍌' },
      { id: 'macadamia', name: 'Macadamia Nuts', icon: '🌰' }
    ]
  },
  vegetables: {
    label: 'Vegetables & Crops',
    icon: '🥬',
    desc: 'Fresh farm harvests, greenhouse produce, and commercial cash crops.',
    crops: [
      { id: 'tomato', name: 'Tomatoes', icon: '🍅' },
      { id: 'onion', name: 'Onions', icon: '🧅' },
      { id: 'potato', name: 'Potatoes', icon: '🥔' },
      { id: 'cabbage', name: 'Cabbages', icon: '🥬' },
      { id: 'tobacco', name: 'Tobacco & Cash Crops', icon: '🍂' }
    ]
  }
};

export function getSvgPlaceholder(title: string, icon: string, color = '#ff6b35'): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="260" viewBox="0 0 400 260">
    <rect width="400" height="260" fill="#17191f"/>
    <circle cx="200" cy="110" r="48" fill="${color}" fill-opacity="0.18" stroke="${color}" stroke-width="2"/>
    <text x="200" y="125" font-family="system-ui, -apple-system, sans-serif" font-size="36" text-anchor="middle">${icon}</text>
    <text x="200" y="195" font-family="system-ui, -apple-system, sans-serif" font-size="16" font-weight="bold" fill="#f8f6f2" text-anchor="middle">${title}</text>
    <text x="200" y="218" font-family="system-ui, -apple-system, sans-serif" font-size="12" fill="#a6a9b0" text-anchor="middle">PTK-Link Direct Trade Network</text>
  </svg>`;
  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
}
