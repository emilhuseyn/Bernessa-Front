import type { Product, Category } from '../types';

export const categories: Category[] = [
  { id: '1', name: 'Qadın Ətirlər', slug: 'qadin-etirleri', image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=400', productCount: 45 },
  { id: '2', name: 'Kişi Ətirlər', slug: 'kisi-etirleri', image: 'https://images.unsplash.com/photo-1587017539504-67cfbddac569?w=400', productCount: 38 },
  { id: '3', name: 'Unisex Ətirlər', slug: 'unisex-etirleri', image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=400', productCount: 28 },
  { id: '4', name: 'Lüks Kolleksiya', slug: 'luks-koleksiya', image: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=400', productCount: 22 },
];

export const products: Product[] = [
  {
    id: '1',
    name: 'Chanel No. 5',
    description: 'Klassik və əbədi ətir. Yasemin və qızılgül notları ilə zərif və lüks qoxu.',
    price: 189.99,
    originalPrice: 229.99,
    images: [
      'https://images.unsplash.com/photo-1541643600914-78b084683601?w=800',
      'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=800',
    ],
    category: 'Qadın Ətirlər',

    volume: '100ml',
    brand: 'Chanel',
    type: 'Eau de Parfum',
    tags: ['klassik', 'lüks', 'qadın'],
  },
  {
    id: '2',
    name: 'Dior Sauvage',
    description: 'Kişilər üçün güclü və cazibədar ətir. Berqamot və müşk notları ilə.',
    price: 149.99,
    images: [
      'https://images.unsplash.com/photo-1587017539504-67cfbddac569?w=800',
      'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800',
    ],
    category: 'Kişi Ətirlər',

    volume: '100ml',
    brand: 'Dior',
    type: 'Eau de Toilette',
    tags: ['kişi', 'güclü', 'sport'],
  },
  {
    id: '3',
    name: 'Tom Ford Oud Wood',
    description: 'Ekzotik və dərin ətir. Qədim ağac və ədviyyat notları ilə unisex qoxu.',
    price: 299.99,
    images: [
      'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800',
    ],
    category: 'Unisex Ətirlər',

    volume: '50ml',
    brand: 'Tom Ford',
    type: 'Eau de Parfum',
    tags: ['unisex', 'lüks', 'ekzotik'],
  },
  {
    id: '4',
    name: 'Versace Eros',
    description: 'Ehtiraslı və güclü ətir. Nanə və vanilin birləşməsi ilə kişilər üçün.',
    price: 129.99,
    originalPrice: 159.99,
    images: [
      'https://images.unsplash.com/photo-1587017539504-67cfbddac569?w=800',
    ],
    category: 'Kişi Ətirlər',

    volume: '100ml',
    brand: 'Versace',
    type: 'Eau de Toilette',
    tags: ['kişi', 'gənc', 'cazibədar'],
  },
  {
    id: '5',
    name: 'Lancôme La Vie Est Belle',
    description: 'Şirin və meyvəli qoxu. İris və praline notları ilə qadınlar üçün.',
    price: 169.99,
    images: [
      'https://images.unsplash.com/photo-1541643600914-78b084683601?w=800',
    ],
    category: 'Qadın Ətirlər',

    volume: '100ml',
    brand: 'Lancôme',
    type: 'Eau de Parfum',
    tags: ['qadın', 'şirin', 'meyvəli'],
  },
  {
    id: '6',
    name: 'Creed Aventus',
    description: 'Lüks və eksklüziv ətir. Ananas və qara qarağat ilə güclü kişi ətri.',
    price: 399.99,
    images: [
      'https://images.unsplash.com/photo-1587017539504-67cfbddac569?w=800',
    ],
    category: 'Lüks Kolleksiya',

    volume: '100ml',
    brand: 'Creed',
    type: 'Eau de Parfum',
    tags: ['lüks', 'eksklüziv', 'kişi'],
  },
  {
    id: '7',
    name: 'Yves Saint Laurent Black Opium',
    description: 'Qaranlıq və cazibədar ətir. Qəhvə və vanilin qarışığı ilə qadınlar üçün.',
    price: 159.99,
    originalPrice: 189.99,
    images: [
      'https://images.unsplash.com/photo-1541643600914-78b084683601?w=800',
    ],
    category: 'Qadın Ətirlər',

    volume: '90ml',
    brand: 'YSL',
    type: 'Eau de Parfum',
    tags: ['qadın', 'gecə', 'cazibədar'],
  },
  {
    id: '8',
    name: 'Paco Rabanne 1 Million',
    description: 'Qızılı qablaşdırmada zərif ətir. Tarçın və dəri notları ilə kişilər üçün.',
    price: 119.99,
    images: [
      'https://images.unsplash.com/photo-1587017539504-67cfbddac569?w=800',
    ],
    category: 'Kişi Ətirlər',

    volume: '100ml',
    brand: 'Paco Rabanne',
    type: 'Eau de Toilette',
    tags: ['kişi', 'cazibədar', 'ədviyyatlı'],
  },
  {
    id: '9',
    name: 'Gucci Bloom',
    description: 'Çiçək bağı kimi təravətli ətir. Yasemin və nərgiz notları ilə.',
    price: 139.99,
    images: [
      'https://images.unsplash.com/photo-1541643600914-78b084683601?w=800',
    ],
    category: 'Qadın Ətirlər',

    volume: '100ml',
    brand: 'Gucci',
    type: 'Eau de Parfum',
    tags: ['qadın', 'çiçək', 'təravətli'],
  },
  {
    id: '10',
    name: 'Armani Code',
    description: 'Elegant və müasir ətir. Sitrus və tonka paxlası notları ilə kişilər üçün.',
    price: 109.99,
    originalPrice: 139.99,
    images: [
      'https://images.unsplash.com/photo-1587017539504-67cfbddac569?w=800',
    ],
    category: 'Kişi Ətirlər',

    volume: '75ml',
    brand: 'Giorgio Armani',
    type: 'Eau de Toilette',
    tags: ['kişi', 'elegant', 'müasir'],
  },
  {
    id: '11',
    name: 'Jo Malone Wood Sage & Sea Salt',
    description: 'Təbii və dəniz qoxusu. Şalviya və dəniz duzu notları ilə unisex.',
    price: 179.99,
    images: [
      'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800',
    ],
    category: 'Unisex Ətirlər',

    volume: '100ml',
    brand: 'Jo Malone',
    type: 'Cologne',
    tags: ['unisex', 'təbii', 'təravətli'],
  },
  {
    id: '12',
    name: 'Baccarat Rouge 540',
    description: 'Eksklüziv və lüks ətir. Zəfəran və amber notları ilə unisex qoxu.',
    price: 449.99,
    images: [
      'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=800',
    ],
    category: 'Lüks Kolleksiya',

    volume: '70ml',
    brand: 'Maison Francis Kurkdjian',
    type: 'Extrait de Parfum',
    tags: ['lüks', 'eksklüziv', 'unisex'],
  },
];
