export type Category = {
  id: string;
  name: string;
  image: string;
  description: string;
  subcategories?: string[];
};

export type Product = {
  id: string;
  name: string;
  price: number;
  category: string;
  subcategory?: string;
  images: string[];
  description: string;
  sizes: string[];
  colors?: string[];
  newArrival?: boolean;
  bestSeller?: boolean;
  condition?: 'New' | 'Used - Excellent' | 'Used - Good';
};

export type Review = {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  productId?: string;
  productImage: string;
};

export type Store = {
  id: string;
  name: string;
  location: string;
  coordinates: { lat: number; lng: number };
  image: string;
  whatsapp: string;
  status?: 'active' | 'coming_soon';
  specialties: string[];
  mapUrl?: string;
};

export type CartItem = {
  id: string;
  productId: string;
  name: string;
  price: number;
  size: string;
  color: string;
  quantity: number;
  image: string;
};
