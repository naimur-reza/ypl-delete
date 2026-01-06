"use client" ;


import { useState } from 'react';
import Image from 'next/image';
import { Search, MapPin, ArrowRight, Filter } from 'lucide-react'; 

 
const universities = [
  { id: 1, name: 'Abertay University', location: 'Dundee, Scotland', logo: '/logos/abertay.png' },
  { id: 2, name: 'Aberystwyth University', location: 'Aberystwyth, Wales', logo: '/logos/aberystwyth.png' },
  { id: 3, name: 'Anglia Ruskin University', location: 'Cambridge, England', logo: '/logos/aru.png' },
  { id: 4, name: 'Arts University Bournemouth', location: 'Poole, England', logo: '/logos/aub.png' },
  { id: 5, name: 'Bangor University', location: 'Bangor, Wales', logo: '/logos/bangor.png' },
  { id: 6, name: 'Bath Spa University', location: 'Bath, England', logo: '/logos/bath-spa.png' },
];

export default function TopUniversityList() {
 

 

  return (
    <section className="max-w-7xl mx-auto py-12 px-4 sm:px-6">
      {/* Header Section */}
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">
          January Intake Universities for <span className="text-red-600">Bangladeshi Students</span>
        </h1>
        <p className="text-slate-600 max-w-2xl mx-auto">
          Explore top-tier UK universities welcoming students this January. Apply directly through our partner portal.
        </p>
      </div>

 
 
      {/* List Card Grid */}
      <div className="space-y-4">
        {universities.length > 0 ? (
          universities.map((uni) => (
            <div 
              key={uni.id} 
              className="group bg-white rounded-xl border border-slate-100 p-4 sm:p-5 flex flex-col sm:flex-row items-center gap-6 shadow-sm hover:shadow-md hover:border-blue-100 transition-all duration-300"
            >
              {/* Logo Area */}
              <div className="w-24 h-16 relative flex-shrink-0 grayscale group-hover:grayscale-0 transition-all duration-300">
                {/* Note: Replace src with actual image paths or generic placeholder */}
                <div className="w-full h-full bg-slate-50 rounded-md flex items-center justify-center text-xs text-slate-400 font-mono">
                  LOGO
                </div>
                {/* <Image src={uni.logo} alt={uni.name} fill className="object-contain" /> */}
              </div>

              {/* Content Area */}
              <div className="grow text-center sm:text-left">
                <h3 className="text-lg font-bold text-slate-800 group-hover:text-blue-700 transition-colors">
                  {uni.name}
                </h3>
                <div className="flex items-center justify-center sm:justify-start gap-2 mt-1 text-slate-500 text-sm">
                  <MapPin className="w-4 h-4 text-slate-400" />
                  <span>{uni.location}</span>
                </div>
              </div>

              {/* Action Area */}
              <div className="flex-shrink-0 w-full sm:w-auto">
                <button className="w-full sm:w-auto flex items-center justify-center gap-2 bg-slate-900 hover:bg-blue-600 text-white px-6 py-2.5 rounded-lg font-semibold transition-all duration-300 transform group-hover:translate-x-1">
                  Apply Now
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-200">
            <p className="text-slate-500">No universities found</p>
          </div>
        )}
      </div>

      {/* Pagination (Modernized) */}
      <div className="flex justify-center mt-10 gap-2">
        <button className="px-4 py-2 text-sm font-medium text-slate-500 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50">Prev</button>
        <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg shadow-sm shadow-blue-200">1</button>
        <button className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:text-blue-600">2</button>
        <button className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:text-blue-600">3</button>
        <span className="px-2 py-2 text-slate-400">...</span>
        <button className="px-4 py-2 text-sm font-medium text-slate-500 bg-white border border-slate-200 rounded-lg hover:bg-slate-50">Next</button>
      </div>
    </section>
  );
}