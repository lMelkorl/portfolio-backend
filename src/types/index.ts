export interface Project {
  id?: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  thumbnailImage: string;
  images: string[];
  technologies: string[];
  demoUrl?: string;
  githubUrl?: string;
  order: number;
  createdAt?: string;
  updatedAt?: string;
} 