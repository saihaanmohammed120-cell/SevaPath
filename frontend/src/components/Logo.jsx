import React from 'react';

export default function Logo({ className = "w-8 h-8" }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="sp-left" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#EA580C" />
          <stop offset="100%" stopColor="#FDBA74" />
        </linearGradient>
        <linearGradient id="sp-right" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#9A3412" />
          <stop offset="100%" stopColor="#EA580C" />
        </linearGradient>
        <linearGradient id="sp-path" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#F97316" />
          <stop offset="100%" stopColor="#FDBA74" />
        </linearGradient>
      </defs>

      {/* 
        FINAL BRAND MARK
        Concept: PERSON + GATEWAY + PATH
        Constructed from 4 precise geometric forms.
      */}

      {/* Left Wall & Roof (Overlapped by Right Wall) */}
      <path 
        d="M 15 75 
           L 15 45 
           C 15 20, 30 10, 55 10 
           L 55 25 
           C 40 25, 35 35, 35 50 
           L 35 65 Z" 
        fill="url(#sp-left)" 
      />

      {/* Right Wall & Roof (Overlaps Left Wall at the peak) */}
      <path 
        d="M 85 75 
           L 85 45 
           C 85 20, 70 10, 50 10 
           L 50 25 
           C 60 25, 65 35, 65 50 
           L 65 65 Z" 
        fill="url(#sp-right)" 
      />

      {/* Flowing Lower Path (The Way Forward) */}
      <path 
        d="M 25 90 
           C 35 90, 45 80, 45 70 
           C 45 60, 50 55, 50 50 
           C 50 48, 54 48, 54 50 
           C 54 60, 50 75, 75 90
           C 60 95, 40 95, 25 90 Z" 
        fill="url(#sp-path)" 
      />

      {/* Human/Head Element (The Person) */}
      <circle cx="52" cy="38" r="6.5" fill="#FDBA74" />
    </svg>
  );
}
