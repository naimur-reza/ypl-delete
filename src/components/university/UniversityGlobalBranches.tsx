import { Globe, MapPin } from "lucide-react";
import Image from "next/image";

export function UniversityGlobalBranches() {
  const branches = [
    {
      country: "United Kingdom",
      city: "London",
      image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=800&auto=format&fit=crop",
      address: "123 Oxford Street, London, UK",
    },
    {
        country: "United Arab Emirates",
        city: "Dubai",
        image: "https://images.unsplash.com/photo-1512453979798-5ea90b791d1e?q=80&w=800&auto=format&fit=crop",
        address: "Dubai International Academic City",
    },
    {
        country: "Bangladesh",
        city: "Dhaka",
        image: "https://images.unsplash.com/photo-1628172905096-749e7724213d?q=80&w=800&auto=format&fit=crop", // Using a relevant image if possible or generic city
        address: "Gulshan 2, Dhaka, Bangladesh",
    }
  ];

  return (
    <section className="py-16 bg-white border-t border-slate-100" id="global-offices">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center text-center mb-12">
             <span className="text-primary font-semibold tracking-wider text-sm uppercase mb-2">Connect With Us</span>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">Our Global Offices</h2>
            <p className="text-slate-600 mt-4 max-w-2xl">Visit our offices for personalized counseling and support.</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
            {branches.map((branch, idx) => (
                <div key={idx} className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-100">
                    <div className="relative h-56 overflow-hidden">
                        <Image 
                            src={branch.image} 
                            alt={`${branch.city} Office`} 
                            fill 
                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-black/70 to-transparent" />
                        <div className="absolute bottom-4 left-4 text-white">
                            <h3 className="text-2xl font-bold mb-1">{branch.city}</h3>
                            <p className="text-sm text-slate-200 font-medium">{branch.country}</p>
                        </div>
                    </div>
                    <div className="p-6">
                        <div className="flex items-start gap-3 text-slate-600">
                            <MapPin className="w-5 h-5 shrink-0 mt-0.5 text-primary" />
                            <span className="font-medium">{branch.address}</span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
      </div>
    </section>
  );
}
