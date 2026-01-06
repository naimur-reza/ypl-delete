import { GraduationCap, Globe2, Building2 } from "lucide-react";

export default function WhyChooseUs() {
  return (
    <section className="relative w-full py-14 px-6 overflow-hidden bg-slate-50">
      {/* Static Background Decor: 
        Soft blurred blobs, no animation. 
        Raw Tailwind utility classes only.
      */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
      <div className="absolute -bottom-8 left-1/3 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-20">
          <span className="text-sm font-bold tracking-widest text-pink-500 uppercase bg-pink-50 px-4 py-2 rounded-full">
            Who We Are
          </span>
          <h2 className="mt-6 text-5xl   font-bold text-slate-900 mb-6 tracking-tight">
            Hi, we are{" "}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-pink-600 to-purple-600">
              NWC Education
            </span>
          </h2>
          <p className="text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed">
            Founded as IEC Abroad in 2006, and now digitally transformed as{" "}
            <span className="font-semibold text-slate-700">Edvoy</span>.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Stat 1: Years */}
          <div className="group bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-sm hover:shadow-2xl border border-white/50 transition-all duration-500 hover:-translate-y-2">
            <div className="w-14 h-14 bg-pink-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
              <GraduationCap className="w-7 h-7 text-pink-600" />
            </div>
            <div className="text-6xl font-bold text-transparent bg-clip-text bg-linear-to-br from-slate-800 to-slate-500 mb-4">
              18<span className="text-pink-500 text-4xl align-top">+</span>
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              Years of Excellence
            </h3>
            <p className="text-slate-500 leading-relaxed">
              Experience helping students find their perfect study-abroad
              destination.
            </p>
          </div>

          {/* Stat 2: Partners */}
          <div className="group bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-sm hover:shadow-2xl border border-white/50 transition-all duration-500 hover:-translate-y-2">
            <div className="w-14 h-14 bg-purple-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
              <Building2 className="w-7 h-7 text-purple-600" />
            </div>
            <div className="text-6xl font-bold text-transparent bg-clip-text bg-linear-to-br from-slate-800 to-slate-500 mb-4">
              750<span className="text-purple-500 text-4xl align-top">+</span>
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              Global Partners
            </h3>
            <p className="text-slate-500 leading-relaxed">
              Institution partners across the UK, Ireland, USA, Canada,
              Australia & more.
            </p>
          </div>

          {/* Stat 3: Students */}
          <div className="group bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-sm hover:shadow-2xl border border-white/50 transition-all duration-500 hover:-translate-y-2">
            <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
              <Globe2 className="w-7 h-7 text-blue-600" />
            </div>
            <div className="text-6xl font-bold text-transparent bg-clip-text bg-linear-to-br from-slate-800 to-slate-500 mb-4">
              100K<span className="text-blue-500 text-4xl align-top">+</span>
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              Students Counselled
            </h3>
            <p className="text-slate-500 leading-relaxed">
              Students counselled from over 65 different countries across the
              globe.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
