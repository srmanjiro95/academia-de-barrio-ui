export interface Membership {
  id: string;
  name: string;
  price: number;
  duration: string;
  includes: string[];
  imageUrl?: string;
}
