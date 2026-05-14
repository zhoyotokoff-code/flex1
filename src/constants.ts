import { Category, Product, Review, Store } from './types';

export const CATEGORIES: Category[] = [
  {
    id: 'baggy',
    name: 'Baggys',
    image: 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&q=80&w=800',
    description: 'Relaxed silhouettes for effortless movement.',
    subcategories: ['Oversized', 'Skater', 'Street']
  },
  {
    id: 'pants',
    name: 'Pants',
    image: 'https://images.unsplash.com/photo-1619470148547-0adbfc64b595?auto=format&fit=crop&q=80&w=800',
    description: 'Technical trousers and precision-cut denim.',
    subcategories: ['Cargo', 'Chinos', 'Techwear']
  },
  {
    id: 'shirts',
    name: 'Shirts',
    image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&q=80&w=800',
    description: 'Structured shirts for the modern architect.',
    subcategories: ['Button-down', 'Flannels', 'Formal']
  },
  {
    id: 't-shirts',
    name: 'T-Shirts',
    image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&q=80&w=800',
    description: 'Heavyweight basics with a signature fit.',
    subcategories: ['Graphic', 'Minimal', 'Vintage']
  },
  {
    id: 'shorts',
    name: 'Shorts',
    image: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?auto=format&fit=crop&q=80&w=800',
    description: 'Summer essentials without compromise.',
    subcategories: ['Athletic', 'Casual', 'Swims']
  },
  {
    id: 'Hoodies',
    name: 'Hoodies',
    image: 'https://plus.unsplash.com/premium_photo-1673356301340-4522591be5f7?auto=format&fit=crop&q=80&w=800',
    description: 'Foundational layers for 24/7 comfort.',
    subcategories: ['sweater', 'your choice ', 'full-sleeve ']
  },
  {
    id: 'shoes',
    name: 'Shoes',
    image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&q=80&w=800',
    description: 'Sculpted footwear finishing every silhouette.',
    subcategories: ['Sneakers', 'Boots', 'Mules']
  }
];

// Helper to generate products with better variety and real images
const generateProducts = () => {
  const products: Product[] = [];
  const cats = ['baggy', 'pants', 'shirts', 't-shirts', 'shorts', 'innerwear', 'shoes'];
  
  // Real high-end fashion image sets from Unsplash
  const imageSets = [
    ['https://images.unsplash.com/photo-1515886657613-9f3515b0c78f', 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f'],
    ['https://images.unsplash.com/photo-1539109136881-3be0616acf4b', 'https://images.unsplash.com/photo-1483985988355-66d741488f5d'],
    ['https://images.unsplash.com/photo-1772985451338-6bbc32aeedf1', 'https://images.unsplash.com/photo-1475184478110-2382b193ac75'],
    ['https://images.unsplash.com/photo-1470309864661-68328b2cd0a5', 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d'],
    ['https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93', 'https://images.unsplash.com/photo-1445205170230-053b830c6050'],
    ['https://images.unsplash.com/photo-1469334031218-e382a71b716b', 'https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc'],
    ['https://images.unsplash.com/photo-1509631179647-0177331693ae', 'https://images.unsplash.com/photo-1525507119028-ed4c629a60a3'],
    ['https://images.unsplash.com/photo-1496747611176-843222e1e57c', 'https://images.unsplash.com/photo-1458538977777-0549b2370168'],
  ];

  cats.forEach((catId, catIdx) => {
    for (let i = 1; i <= 8; i++) {
      const isNew = i <= 2;
      const isBest = i > 2 && i <= 4;
      const imgSet = imageSets[(catIdx + i) % imageSets.length];
      
      const catObj = CATEGORIES.find(c => c.id === catId);
      const subcat = catObj ? catObj.subcategories[i % catObj.subcategories.length] : undefined;
      
      products.push({
        id: `${catId}-${i}`,
        name: `${catId.charAt(0).toUpperCase() + catId.slice(1).replace('-', ' ')} Series ${String(i).padStart(2, '0')}`,
        price: 3200 + (catIdx * 500) + (i * 150),
        category: catId,
        subcategory: subcat,
        images: [
          `${imgSet[0]}?auto=format&fit=crop&q=80&w=800&h=1000`,
          `${imgSet[1]}?auto=format&fit=crop&q=80&w=800&h=1000`
        ],
        description: `Precision-engineered ${catId} from the USED FLEX. Archive. Features reinforced seams, tactical pocket architecture, and our signature technical fabric blend for ultimate structural integrity.`,
        sizes: ['S', 'M', 'L', 'XL'],
        colors: ['Void', 'Cinder', 'Ghost'],
        newArrival: isNew,
        bestSeller: isBest
      });
    }
  });

  // Ensuring 50+ products total
  return products;
};

export const PRODUCTS: Product[] = generateProducts();

export const REVIEWS: Review[] = [
  {
    id: 'r1',
    userName: 'Aryan Sharma',
    rating: 5,
    comment: "The drop shoulder fit is exactly what I've been looking for. Quality is insane.",
    productId: 't-shirts-1',
    productImage: PRODUCTS[0].images[0]
  },
  {
    id: 'r2',
    userName: 'Vikram Singh',
    rating: 5,
    comment: "Pants fit perfectly. The cargo pockets actually look premium, not bulky.",
    productId: 'pants-1',
    productImage: PRODUCTS[8].images[0]
  }
];

export const STORES: Store[] = [
  {
    id: 's1',
    name: 'South Avenue Flagship',
    location: '12-B South Avenue, New Delhi',
    coordinates: { lat: 28.6139, lng: 77.2090 },
    image: 'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?auto=format&fit=crop&q=80&w=1200',
    whatsapp: '918001234567',
    status: 'active',
    specialties: ['Baggys', 'Premium Tees', 'Private Styling']
  },
  {
    id: 's2',
    name: 'Bandra Collective',
    location: 'Hill Road, Bandra West, Mumbai',
    coordinates: { lat: 19.0596, lng: 72.8295 },
    image: 'https://images.unsplash.com/photo-1595665593673-bf1ad72905c0?auto=format&fit=crop&q=80&w=1200',
    whatsapp: '918007654321',
    status: 'active',
    specialties: ['Techwear', 'Lookbook Collection', 'Mules']
  },
  {
    id: 's3',
    name: 'Indiranagar Series',
    location: '100ft Road, Indiranagar, Bengaluru',
    coordinates: { lat: 12.9716, lng: 77.5946 },
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=1200',
    whatsapp: '918005554444',
    status: 'coming_soon',
    specialties: ['Exclusive Drops', 'Custom Tailored', 'Artifacts']
  }
];

export const WHATSAPP_NUMBER = '918001234567';
