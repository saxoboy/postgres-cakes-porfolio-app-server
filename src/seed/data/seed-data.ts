export const SEED_USERS = [
  {
    name: 'Israel',
    lastname: 'Herrera',
    email: 'israel@correo.com',
    password: '123456789root',
    roles: ['root', 'admin', 'user'],
  },
  {
    name: 'Eliza',
    lastname: 'Loyola',
    email: 'eliza@correo.com',
    password: '123456789admin',
    roles: ['admin', 'user'],
  },
  {
    name: 'Marcos',
    lastname: 'Herrera',
    email: 'marcos@correo.com',
    password: '123456789user',
    roles: ['user'],
  },
];

export const SEED_CAKES = [
  {
    name: 'Torta de chocolate',
    slug: 'torta-de-chocolate',
    description: 'Torta de chocolate con relleno de chocolate',
    imageUrl: 'https://i.imgur.com/1ZQZQ0x.jpg',
    photos: [
      'https://i.imgur.com/1ZQZQ0x.jpg',
      'https://i.imgur.com/1ZQZQ0x.jpg',
    ],
    isActive: true,
  },
  {
    name: 'Torta de vainilla',
    slug: 'torta-de-vainilla',
    description: 'Torta de vainilla con relleno de vainilla',
    imageUrl: 'https://i.imgur.com/1ZQZQ0x.jpg',
    photos: [
      'https://i.imgur.com/1ZQZQ0x.jpg',
      'https://i.imgur.com/1ZQZQ0x.jpg',
    ],
    isActive: true,
  },
  {
    name: 'Torta de fresa',
    slug: 'torta-de-fresa',
    description: 'Torta de fresa con relleno de fresa',
    imageUrl: 'https://i.imgur.com/1ZQZQ0x.jpg',
    photos: [
      'https://i.imgur.com/1ZQZQ0x.jpg',
      'https://i.imgur.com/1ZQZQ0x.jpg',
    ],
    isActive: true,
  },
  {
    name: 'Torta de limón',
    slug: 'torta-de-limon',
    description: 'Torta de limón con relleno de limón',
    imageUrl: 'https://i.imgur.com/1ZQZQ0x.jpg',
    photos: ['https://i.imgur.com/1ZQZQ0x.jpg'],
    isActive: false,
  },
  {
    name: 'Torta de naranja',
    slug: 'torta-de-naranja',
    description: 'Torta de naranja con relleno de naranja',
    imageUrl: 'https://i.imgur.com/1ZQZQ0x.jpg',
    photos: [],
    isActive: true,
  },
];

export const SEED_CATEGORIES = [
  {
    name: 'Tortas',
    slug: 'tortas',
    description: 'Tortas de todo tipo',
    imageUrl: 'https://i.imgur.com/1ZQZQ0x.jpg',
    isActive: true,
  },
  {
    name: 'Cupcakes',
    slug: 'cupcakes',
    description: 'Cupcakes de todo tipo',
    imageUrl: 'https://i.imgur.com/1ZQZQ0x.jpg',
    isActive: true,
  },
  {
    name: 'Galletas',
    slug: 'galletas',
    description: 'Galletas de todo tipo',
    imageUrl: 'https://i.imgur.com/1ZQZQ0x.jpg',
    isActive: true,
  },
];
