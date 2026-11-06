export type DietaryType = 'veg' | 'non-veg' | 'egg';

export interface MenuItem {
  id: string;
  name: string;
  category: string;
  price: number;
  prepTime: string;
  description: string;
  dietary: DietaryType;
  isChefSpecial?: boolean;
  isPopular?: boolean;
  highlights: string[];
  image: string;
  rating: number;
  reviewsCount?: number;
}

export interface ReviewItem {
  id: string;
  author: string;
  rating: number;
  date: string;
  text: string;
  highlight: string;
  avatar: string;
  source: 'Google Maps';
  userPhotos?: string[];
}

export type BookingStatus = 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled';

export interface Booking {
  id: string;
  customerName: string;
  phone: string;
  email?: string;
  date: string;
  timeSlot: string;
  serviceOrTable: string;
  guests: number;
  specialRequests?: string;
  status: BookingStatus;
  createdAt: string;
  estimatedAmount: number;
}

export interface BusinessInfo {
  name: string;
  tagline: string;
  rating: number;
  totalReviews: number;
  address: string;
  landmark: string;
  city: string;
  state: string;
  pincode: string;
  mapsUrl: string;
  phone: string;
  displayPhone: string;
  whatsappUrl: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  operatingHours: {
    weekday: string;
    weekend: string;
    note: string;
  };
  features: string[];
}
