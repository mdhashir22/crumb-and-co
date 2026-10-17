
export const freshBakes = [
  {
    id: 'brown-butter-cookie',
    name: 'Brown Butter Cookie',
    category: 'cookies',
    label: 'COOKIES',
    badge: 'THE CLASSIC',
    description:
      'Golden edges, a soft centre and pools of rich chocolate.',
    details:
      'Made with nutty brown butter, dark chocolate chunks and a delicate touch of sea salt.',
    price: 320,
    image: '/images/fresh-bakes/brown-butter-cookie.png',
    emoji: '🍪',
    accent: '#b9794c',
    background: '#f3dec4',
  },
  {
    id: 'berry-cloud-cupcake',
    name: 'Berry Cloud Cupcake',
    category: 'cakes',
    label: 'CUPCAKES',
    badge: 'SWEET & SOFT',
    description:
      'A fluffy little treat crowned with berry-kissed frosting.',
    details:
      'Soft vanilla sponge topped with strawberry buttercream and a sprinkle of berry sweetness.',
    price: 390,
    image: '/images/fresh-bakes/berry-cloud-cupcake.png',
    emoji: '🧁',
    accent: '#c9778c',
    background: '#f8e2e7',
  },
  {
    id: 'midnight-brownie',
    name: 'Midnight Brownie',
    category: 'cakes',
    label: 'CHOCOLATE TREATS',
    badge: 'RICH & FUDGY',
    description:
      'Deep chocolate flavour with a wonderfully fudgy centre.',
    details:
      'A decadent chocolate brownie with a delicate crackly top and a rich cocoa finish.',
    price: 450,
    image: '/images/fresh-bakes/midnight-brownie.png',
    emoji: '🍫',
    accent: '#86553d',
    background: '#ead8cc',
  },
  {
    id: 'sunshine-lemon-tart',
    name: 'Sunshine Lemon Tart',
    category: 'pastries',
    label: 'FRESH PASTRIES',
    badge: 'A LITTLE ZEST',
    description:
      'Bright lemon cream in a delicate golden pastry shell.',
    details:
      'A buttery tart shell filled with silky citrus cream, balanced with just the right amount of sweetness.',
    price: 520,
    image: '/images/fresh-bakes/sunshine-lemon-tart.png',
    emoji: '🍋',
    accent: '#aa9349',
    background: '#f5edcc',
  },
  {
    id: 'pistachio-macaron',
    name: 'Pistachio Macaron',
    category: 'macarons',
    label: 'FRENCH MACARONS',
    badge: 'PETITE PERFECTION',
    description:
      'Delicate shells and creamy pistachio goodness.',
    details:
      'Light almond macaron shells with a smooth pistachio-inspired filling and a gentle nutty finish.',
    price: 280,
    image: '/images/fresh-bakes/pistachio-macaron.png',
    emoji: '🍬',
    accent: '#899b67',
    background: '#e9eed9',
  },
  {
    id: 'caramel-eclair',
    name: 'Caramel Éclair',
    category: 'pastries',
    label: 'FRESH PASTRIES',
    badge: 'GOLDEN DELIGHT',
    description:
      'Airy choux pastry with velvety caramel cream.',
    details:
      'A light pastry filled with rich vanilla cream and finished with a glossy caramel topping.',
    price: 560,
    image: '/images/fresh-bakes/caramel-eclair.png',
    emoji: '🥮',
    accent: '#bc8153',
    background: '#f3e2d2',
  },
  {
    id: 'three-milk-cake',
    name: 'Classic Three Milk Cake',
    category: 'desi-delights',
    label: 'DESI DELIGHTS',
    badge: 'MILKY PERFECTION',
    description:
      'Soft, milk-soaked sponge finished with a cloud of silky cream.',
    details:
      'A delicate tres leches sponge soaked in three kinds of milk, finished with lightly whipped cream and a comforting sweetness.',
    price: 690,
    servings: [
      {
        id: 'single-slice',
        label: 'Single Slice',
        detail: 'One generous slice',
        price: 690,
      },
      {
        id: 'two-slices',
        label: 'Sharing Box',
        detail: 'Two slices',
        price: 1290,
      },
      {
        id: 'family-tray',
        label: 'Family Tray',
        detail: 'Six slices',
        price: 3650,
      },
    ],
    image: '/images/fresh-bakes/three-milk-cake.png',
    emoji: '🍰',
    accent: '#b8916b',
    background: '#f5e7d5',
  },
  {
    id: 'royal-rasmalai',
    name: 'Royal Rasmalai',
    category: 'desi-delights',
    label: 'DESI DELIGHTS',
    badge: 'ROYAL FAVOURITE',
    description:
      'Soft, delicate milk dumplings resting in fragrant saffron milk.',
    details:
      'Traditional rasmalai served in delicately sweetened saffron milk, finished with chopped pistachios and almonds.',
    price: 520,
    servings: [
      {
        id: 'two-pieces',
        label: '2 Pieces',
        detail: 'Individual serving',
        price: 520,
      },
      {
        id: 'four-pieces',
        label: '4 Pieces',
        detail: 'Sharing serving',
        price: 980,
      },
      {
        id: 'six-pieces',
        label: '6 Pieces',
        detail: 'Family serving',
        price: 1420,
      },
    ],
    image: '/images/fresh-bakes/royal-rasmalai.png',
    emoji: '🥛',
    accent: '#c49b61',
    background: '#f7e9d2',
  },
  {
    id: 'shahi-rabri',
    name: 'Shahi Rabri',
    category: 'desi-delights',
    label: 'DESI DELIGHTS',
    badge: 'TRADITIONAL LUXURY',
    description:
      'Slow-cooked, velvety milk with a rich and beautifully nutty finish.',
    details:
      'Creamy traditional rabri slowly reduced for depth and texture, garnished with saffron, almonds and crushed pistachios.',
    price: 460,
    servings: [
      {
        id: 'small-bowl',
        label: 'Small Bowl',
        detail: '200 g',
        price: 460,
      },
      {
        id: 'regular-bowl',
        label: 'Regular Bowl',
        detail: '350 g',
        price: 750,
      },
      {
        id: 'family-tub',
        label: 'Family Tub',
        detail: '700 g',
        price: 1350,
      },
    ],
    image: '/images/fresh-bakes/shahi-rabri.png',
    emoji: '🍨',
    accent: '#b98d59',
    background: '#f3e6d0',
  },
  {
    id: 'shahi-tukray',
    name: 'Shahi Tukray',
    category: 'desi-delights',
    label: 'DESI DELIGHTS',
    badge: 'A ROYAL CLASSIC',
    description:
      'Golden bread layered with luscious rabri and delicate sweetness.',
    details:
      'A beloved traditional dessert made with golden bread, rich sweetened milk, saffron and a generous sprinkle of nuts.',
    price: 490,
    servings: [
      {
        id: 'single-portion',
        label: 'Single Portion',
        detail: 'One serving',
        price: 490,
      },
      {
        id: 'double-portion',
        label: 'Double Portion',
        detail: 'Two servings',
        price: 920,
      },
      {
        id: 'family-box',
        label: 'Family Box',
        detail: 'Four servings',
        price: 1720,
      },
    ],
    image: '/images/fresh-bakes/shahi-tukray.png',
    emoji: '🍮',
    accent: '#c18a53',
    background: '#f3e0c6',
  },
  {
    id: 'pistachio-kunafa',
    name: 'Pistachio Kunafa',
    category: 'desi-delights',
    label: 'DESI DELIGHTS',
    badge: 'CRISPY & CREAMY',
    description:
      'Golden, delicate pastry wrapped around a rich and creamy centre.',
    details:
      'Crispy kunafa pastry layered with a luscious cream filling, finished with sweet syrup and crushed pistachios.',
    price: 850,
    servings: [
      {
        id: 'single-portion',
        label: 'Single Portion',
        detail: 'One serving',
        price: 850,
      },
      {
        id: 'sharing-box',
        label: 'Sharing Box',
        detail: 'Two servings',
        price: 1600,
      },
      {
        id: 'family-tray',
        label: 'Family Tray',
        detail: 'Four servings',
        price: 3100,
      },
    ],
    image: '/images/fresh-bakes/pistachio-kunafa.png',
    emoji: '🥮',
    accent: '#a68f50',
    background: '#eee6cd',
  },
];

export const bakeFilters = [
  { id: 'all', label: 'All Treats' },
  { id: 'cookies', label: 'Cookies' },
  { id: 'cakes', label: 'Cakes' },
  { id: 'pastries', label: 'Pastries' },
  { id: 'macarons', label: 'Macarons' },
  { id: 'desi-delights', label: 'Desi Delights' },
];
