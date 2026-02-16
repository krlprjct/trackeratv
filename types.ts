import React from 'react';
import { LucideIcon } from 'lucide-react';

export interface NavItem {
  label: string;
  href: string;
}

export interface BenefitCardProps {
  title: string;
  description: string;
  bullets: {
    title: string;
    text: string;
  }[];
  imageUrl: string;
  overlayData?: React.ReactNode;
  imagePosition?: 'left' | 'right'; // Though design implies left mostly
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface TestimonialProps {
  quote: string;
  author: string;
  handle: string;
  role?: string;
}