import React, { useEffect } from 'react';
import { ViewPage } from '../types';

interface SeoHeadProps {
  currentPage: ViewPage;
}

export const SeoHead: React.FC<SeoHeadProps> = ({ currentPage }) => {
  useEffect(() => {
    let title = 'BxStrength — #1 UK & USA Digital Coaching, Boxing, Strength & Fitness Platform';
    let description = 'BxStrength (BX) is the premier UK & USA digital coaching platform for boxing, strength training, physiotherapy rehab, and 1-on-1 expert fitness coaching.';
    let keywords = 'BxStrength, Bx Strength, BX, Strength, fitness, training, boxing, coaches, coach, personal trainer, UK fitness, USA fitness';
    let canonical = 'https://bxstrength.com/';

    switch (currentPage) {
      case 'about':
        title = 'About BxStrength — Premier UK Certified Boxing & Performance Masters';
        description = 'Learn about BxStrength, our UK certified master trainers, clinical physiotherapy standards, and 1,000+ global athlete transformations.';
        keywords = 'About BxStrength, Shaban Faridi, UK fitness coaches, boxing master, physiotherapy professional';
        canonical = 'https://bxstrength.com/#about';
        break;
      case 'trainers':
        title = 'Meet BxStrength Head Coaches — Boxing, Strength & Physiotherapy Masters';
        description = 'Meet Head Coach Shaban Faridi (Diploma in Physiotherapy, IG Stadium Boxing) and senior specialists Sadeem & Moheeb Khan. View verified UK credentials.';
        keywords = 'BxStrength coaches, Shaban Faridi, Sadeem, Moheeb Khan, boxing coach, strength specialist';
        canonical = 'https://bxstrength.com/#trainers';
        break;
      case 'services':
        title = 'Coaching Services & Programs — Boxing, Hypertrophy & Sports Rehab | BxStrength';
        description = 'Discover BxStrength specialized coaching programs: Boxing Technique & Fight Camp, Hypertrophy & Body Recomposition, Tactical Metabolic Blast, and Physical Rehab.';
        keywords = 'boxing services, strength programs, virtual fitness coaching, physiotherapy rehab, BxStrength services';
        canonical = 'https://bxstrength.com/#services';
        break;
      case 'pricing':
        title = 'Coaching Membership & Packages — Bespoke Performance Plans | BxStrength';
        description = 'Flexible UK & USA coaching membership plans. Tier 1 Foundation, Tier 2 Elite Athletic Transformation, and Tier 3 VIP 1-on-1 Fight Camp.';
        keywords = 'BxStrength pricing, fitness membership, coaching package, 15-min session, fitness plans';
        canonical = 'https://bxstrength.com/#pricing';
        break;
      case 'contact':
        title = 'Contact BxStrength — Book 15-Min Strategy Session & Expert Consultation';
        description = 'Get in touch with BxStrength lead coaches and advisory team. Schedule your 15-minute strategy call and receive your custom athletic roadmap.';
        keywords = 'contact BxStrength, book 15-min session, consultation call, UK fitness enquiry';
        canonical = 'https://bxstrength.com/#contact';
        break;
      default:
        break;
    }

    // Update Document Title
    document.title = title;

    // Update Meta Description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', description);
    }

    // Update Meta Keywords
    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (metaKeywords) {
      metaKeywords.setAttribute('content', keywords);
    }

    // Update Canonical
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (canonicalLink) {
      canonicalLink.setAttribute('href', canonical);
    }

    // Update OpenGraph Title & Description
    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', title);
    let ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute('content', description);
    let ogUrl = document.querySelector('meta[property="og:url"]');
    if (ogUrl) ogUrl.setAttribute('content', canonical);

  }, [currentPage]);

  return null;
};
