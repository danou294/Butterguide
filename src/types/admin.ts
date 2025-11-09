export interface Restaurant {
  id: string;
  name: string;
  address: string;
  description: string;
  phone: string;
  menuLink: string;
  reservationLink: string;
  websiteLink: string;
  instagramHandle: string;
  images: string[];
  tags: string[];
  logo?: string;
}

export interface Guide {
  id: string;
  title: string;
  description: string;
  restaurants: string[];
  isPublished?: boolean;
  coverImage?: string;
}

