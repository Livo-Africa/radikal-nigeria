// src/types/index.ts
export interface Testimonial {
  name: string;
  category: string;
  text: string;
  imageUrl: string;
  rating: number;
  visible: boolean;
  primaryCategory?: string; // For the new backend logic
}

export interface Transformation {
  title?: string;
  beforeUrl: string;
  afterUrl: string;
  service?: string;
  metrics?: string;
  visible: boolean;
}