export type Category = 'electronics' | 'furniture' | 'jobs' | 'services' | 'realEstate';

export type ListingStatus = 'active' | 'deleted';

export interface Listing {
  id: string;
  title: string;
  description: string;
  category: Category;
  price: number;
  city: string;
  country: string;
  images: string[];
  ownerId: string;
  ownerName: string;
  ownerAvatar?: string;
  createdAt: Date;
  status: ListingStatus;
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  rating: number;
  createdAt: Date;
}

export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  content: string;
  createdAt: Date;
  read: boolean;
}

export interface Chat {
  id: string;
  listingId: string;
  participants: string[];
  lastMessage?: Message;
  createdAt: Date;
}
