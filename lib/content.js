// Central copy for the site. Anything not yet confirmed by the client is
// flagged here so it is easy to find and replace before launch.

export const BRAND = {
  name: 'Moya One', // TO CONFIRM: final name is Moya One or Moya1
  unit: 'Moya1', // trademarked control unit name
  nameStatus: 'Brand name to confirm',
};

export const NAV = [
  { href: '/#how', label: 'How it works' },
  { href: '/#recharge', label: 'Recharge' },
  { href: '/#quality', label: 'Water quality' },
  { href: '/compare', label: 'Compare' },
  { href: '/builders', label: 'For builders' },
];

export const PAINS = [
  {
    icon: 'bottle',
    title: 'No more 20 L bottles',
    text: 'No ordering, waiting, lifting or storing heavy cans. Drinking water simply comes from your kitchen tap.',
  },
  {
    icon: 'filter',
    title: 'No filters to change',
    text: 'No cartridges, no service visits, no technician calls. There is nothing in your flat to maintain.',
  },
  {
    icon: 'drop',
    title: 'Less water wasted',
    text: 'Home RO units can reject roughly as much water as they produce. Moya One is designed to avoid that.',
    flag: 'Claim to confirm',
  },
];

export const STEPS = [
  {
    n: '01',
    title: 'Built into your tower',
    text: 'The Moya One system is installed while the building is being constructed, together with the builder.',
  },
  {
    n: '02',
    title: 'Its own pipeline to every flat',
    text: 'A dedicated drinking-water line rises through the building and reaches each home separately.',
  },
  {
    n: '03',
    title: 'A Moya1 unit in your kitchen',
    text: 'An extra tap gives you drinking water. The Moya1 unit controls and measures the water reaching your flat.',
  },
  {
    n: '04',
    title: 'Watched from the control room',
    text: 'A control room in the basement keeps an eye on the whole system, day and night.',
  },
];

// ILLUSTRATIVE: plan structure not confirmed. No prices in phase 1.
export const PLAN_RANGE = { min: 200, max: 2000, step: 50, initial: 600 };

// SAMPLE DATA: parameter list and values to be confirmed by the client.
export const QUALITY = [
  { key: 'tds', label: 'TDS', unit: 'ppm', value: 118, min: 50, max: 300, good: [50, 150], hint: 'Total dissolved solids' },
  { key: 'ph', label: 'pH', unit: '', value: 7.4, min: 6, max: 9, good: [6.5, 8.5], hint: 'Acidity / alkalinity balance', decimals: 1 },
  { key: 'alk', label: 'Alkalinity', unit: 'mg/L', value: 92, min: 0, max: 200, good: [20, 120], hint: 'Buffering minerals' },
  { key: 'turb', label: 'Turbidity', unit: 'NTU', value: 0.3, min: 0, max: 5, good: [0, 1], hint: 'How clear the water is', decimals: 1 },
];

export const COMPARE_ROWS = [
  { label: 'Carrying and storing 20 L bottles', moya: 'Never', bottle: 'Every few days', ro: 'No' },
  { label: 'Filters and service visits', moya: 'None for residents', bottle: 'No', ro: 'Regular' },
  { label: 'Water wasted while purifying', moya: 'Designed for zero waste *', bottle: 'Not visible to you', ro: 'Can be about as much as it makes' },
  { label: 'See the quality of your own water', moya: 'Per flat, in the app', bottle: 'No', ro: 'Only with a TDS meter' },
  { label: 'Kitchen space used', moya: 'One extra tap', bottle: 'Dispenser + spare cans', ro: 'Wall unit + tank' },
  { label: 'Running out', moya: 'Recharge from your phone', bottle: 'Wait for delivery', ro: 'Wait for repair' },
  { label: 'Plastic cans in your home', moya: 'None', bottle: 'Many', ro: 'None' },
];

export const BUILDER_BENEFITS = [
  { title: 'A real reason to choose your project', text: 'Give buyers something they notice on day one: drinking water on tap, with no bottles and no filters.' },
  { title: 'Planned at construction stage', text: 'Installed while the tower is built, so there is no retrofit, no breaking walls and no later disruption.' },
  { title: 'Saves space in every flat', text: 'No dispenser, no spare cans, no RO unit on the wall. Kitchens stay cleaner and larger.' },
  { title: 'Fully monitored', text: 'A central control room watches flow and quality for every flat, so residents can trust the water.' },
];

// PLACEHOLDER: contact routes not confirmed by the client.
export const CONTACT = {
  email: 'hello@example.com',
  phone: '+91 00000 00000',
  builderEmail: 'builders@example.com',
  placeholder: true,
};

// TO CONFIRM: only India deployments may be shown.
export const DEPLOYMENT = {
  city: 'Hyderabad, India',
  homes: 'About 300 apartments',
  status: 'Being installed',
  flag: 'To confirm',
};

export const MODEL_CREDITS = [
  { name: 'Water Cooler', author: 'J-Toastie', license: 'CC-BY 3.0', url: 'https://poly.pizza/m/zWi9p5FSxD' },
  { name: 'Kitchen Sink Faucet', author: 'Jarlan', license: 'CC-BY 3.0', url: 'https://poly.pizza/m/cW3fnGvJu2G' },
  { name: 'Kitchen Sink', author: 'Kenney', license: 'CC0', url: 'https://poly.pizza/m/nNGtcp9qK2' },
  { name: 'Skyscraper', author: 'Kenney', license: 'CC0', url: 'https://poly.pizza/m/obYD8hWLTZ' },
  { name: 'Large Building', author: 'Kenney', license: 'CC0', url: 'https://poly.pizza/m/ppwtREejXg' },
];
