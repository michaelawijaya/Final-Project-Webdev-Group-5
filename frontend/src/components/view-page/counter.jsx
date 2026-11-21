import React from 'react';
import reports from "../../../../mock-data/reports.json";

const Counter = () => {
  return (
    <div className="hover:-translate-y-2 group bg-neutral-50 duration-500 w-full h-48 flex text-neutral-600 flex-col justify-center items-center relative rounded-xl overflow-hidden shadow-md">

      <svg 
        viewBox="0 0 200 200" 
        fill="none"
        xmlns="http://www.w3.org/2000/svg" 
        className="absolute inset-0 w-full h-full p-4 blur-sm opacity-100 group-hover:opacity-50 group-hover:blur-none group-hover:scale-105 duration-500 z-10 text-[#6D4E3D]"
      >
     
        <path 
          d="M 76 72 L 76 30 L 144 30 L 176 62 L 176 170 L 76 170 L 76 146" 
          stroke="currentColor" 
          strokeWidth="4.5" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        />

        <path 
          d="M 144 30 L 144 62 L 176 62 Z" 
          fill="currentColor" 
          stroke="currentColor" 
          strokeWidth="3" 
          strokeLinejoin="round"
        />

        <line x1="99" y1="81" x2="160" y2="81" stroke="currentColor" strokeWidth="4.5" strokeLinecap="round" />
        <line x1="112" y1="98" x2="160" y2="98" stroke="currentColor" strokeWidth="4.5" strokeLinecap="round" />
        <line x1="119" y1="115" x2="160" y2="115" stroke="currentColor" strokeWidth="4.5" strokeLinecap="round" />
        <line x1="112" y1="132" x2="160" y2="132" stroke="currentColor" strokeWidth="4.5" strokeLinecap="round" />
        <line x1="99" y1="149" x2="160" y2="149" stroke="currentColor" strokeWidth="4.5" strokeLinecap="round" />


        <circle 
          cx="76" 
          cy="115" 
          r="31" 
          stroke="currentColor" 
          strokeWidth="4.5" 
        />


        <path 
          d="M 55 103 A 23 23 0 0 1 76 92" 
          stroke="currentColor" 
          strokeWidth="3.5" 
          strokeLinecap="round" 
        />

        <line 
          x1="54" 
          y1="137" 
          x2="47" 
          y2="144" 
          stroke="currentColor" 
          strokeWidth="4.5" 
          strokeLinecap="round" 
        />

        <line 
          x1="47" 
          y1="144" 
          x2="26" 
          y2="165" 
          stroke="currentColor" 
          strokeWidth="8.5" 
          strokeLinecap="round" 
        />
      </svg>

      {/* Angka & Label */}
      <div className="z-20 flex flex-col justify-center items-center">
        <span className="font-bold text-6xl">{reports.length}</span>
        <p className="font-bold">Reports</p>
      </div>
    </div>
  );
}

export default Counter;