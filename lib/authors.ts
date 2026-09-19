/**
 * Author profiles for guides and service pages
 * Each author can write multiple guides/services and have a profile page
 */

export interface Author {
  id: string
  name: string
  title: string
  bio: string
  avatar_url?: string
  social?: {
    twitter?: string
    linkedin?: string
    website?: string
  }
}

export const AUTHORS: Record<string, Author> = {
  nam: {
    id: 'nam',
    name: 'Nam Tran',
    title: 'Relocation Specialist & Founder',
    bio: 'Nam has helped 200+ expats settle in Da Nang since 2023. As founder of Expats Da Nang, he specializes in housing, visas, and relocation logistics for English-speaking professionals.',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
    social: {
      linkedin: 'https://linkedin.com/in/namtran',
    },
  },
  linh: {
    id: 'linh',
    name: 'Linh Nguyen',
    title: 'Housing & Rental Expert',
    bio: 'Linh has 8+ years of experience in Da Nang real estate. She specializes in helping expats navigate the rental market, negotiate leases, and find the perfect neighborhood.',
    avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
    social: {
      linkedin: 'https://linkedin.com/in/linhnguyen',
    },
  },
  minh: {
    id: 'minh',
    name: 'Minh Pham',
    title: 'Motorbike & Transport Specialist',
    bio: 'Minh grew up in Da Nang and is an expert on local transportation. He helps expats navigate motorbike rental, driving regulations, and getting around the city safely.',
    avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop',
    social: {
      linkedin: 'https://linkedin.com/in/minhpham',
    },
  },
  trang: {
    id: 'trang',
    name: 'Trang Le',
    title: 'Visa & Documents Specialist',
    bio: 'Trang is a legal advisor with 5+ years helping foreigners navigate Vietnamese bureaucracy. She specializes in visa extensions, temporary residence registration, and document notarization.',
    avatar_url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop',
    social: {
      linkedin: 'https://linkedin.com/in/trangles',
    },
  },
}

export function getAuthor(authorId?: string): Author {
  if (!authorId || !AUTHORS[authorId]) {
    return AUTHORS.nam // Default to Nam
  }
  return AUTHORS[authorId]
}
