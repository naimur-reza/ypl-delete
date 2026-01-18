import { prisma } from "@/lib/prisma";
import Image from "next/image";
import { Star, PlayCircle, Quote } from "lucide-react";

export async function ReviewSection() {
  const studentReviews = await prisma.testimonial.findMany({
    where: { type: "STUDENT" },
    take: 5,
    orderBy: { order: "asc" }
  });

  const gmbReviews = await prisma.testimonial.findMany({
    where: { type: "GMB" },
    take: 5,
    orderBy: { rating: "desc" }
  });

  // Fallback data if no reviews found (using Testimonial field names)
  const displayStudentReviews = studentReviews.length > 0 ? studentReviews : [
    { id: "1", name: "Sarah Johnson", content: "My experience studying in the UK was life-changing. The support I received was incredible.", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop" },
    { id: "2", name: "Michael Chen", content: "Thanks to the guidance, I got into my dream university in Canada with a scholarship!", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop" },
    { id: "3", name: "Emily Davis", content: "The process was smooth and transparent. Highly recommend for anyone looking to study abroad.", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&auto=format&fit=crop" },
  ];

  const displayGmbReviews = gmbReviews.length > 0 ? gmbReviews : [
    { id: "1", name: "John Doe", content: "Excellent service! They helped me every step of the way.", rating: 5, createdAt: new Date() },
    { id: "2", name: "Jane Smith", content: "Very professional and knowledgeable team.", rating: 5, createdAt: new Date() },
    { id: "3", name: "Robert Wilson", content: "Great experience, highly recommended.", rating: 5, createdAt: new Date() },
  ];

  return (
    <section className="py-24 bg-slate-900 text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        
        {/* Student Reviews (Video Style) */}
        <div className="mb-20">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-2">Student Success Stories</h2>
              <p className="text-slate-400">Hear from our students about their journey.</p>
            </div>
          </div>

          <div className="flex gap-6 overflow-x-hidden pb-8 scrollbar-hide snap-x">
            {displayStudentReviews.map((review) => (
              <div key={review.id} className="min-w-[300px] md:min-w-[400px] snap-center relative group cursor-pointer rounded-2xl overflow-hidden aspect-video bg-slate-800">
                <Image
                  src={review.avatar || "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=500&auto=format&fit=crop"}
                  alt={review.name}
                  fill
                  className="object-cover opacity-60 group-hover:opacity-40 transition-opacity duration-300"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <PlayCircle className="w-16 h-16 text-white opacity-80 group-hover:scale-110 transition-transform duration-300" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-linear-to-t from-black/90 to-transparent">
                  <h3 className="text-xl font-bold">{review.name}</h3>
                  <p className="text-sm text-slate-300 line-clamp-1">{review.content || ""}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* GMB Reviews */}
        <div>
          <div className="flex items-center gap-4 mb-10">
            <div className="bg-white p-2 rounded-lg">
              <Image src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" width={24} height={24} alt="Google" />
            </div>
            <div>
              <h2 className="text-3xl md:text-4xl font-bold">Google Reviews</h2>
              <div className="flex items-center gap-2 text-yellow-400">
                <div className="flex"><Star fill="currentColor" className="w-4 h-4"/><Star fill="currentColor" className="w-4 h-4"/><Star fill="currentColor" className="w-4 h-4"/><Star fill="currentColor" className="w-4 h-4"/><Star fill="currentColor" className="w-4 h-4"/></div>
                <span className="text-slate-400 text-sm">4.9 Average Rating</span>
              </div>
            </div>
          </div>

          <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide snap-x">
            {displayGmbReviews.map((review) => (
              <div key={review.id} className="min-w-[300px] md:min-w-[350px] snap-center bg-slate-800/50 border border-slate-700 p-6 rounded-2xl backdrop-blur-sm hover:bg-slate-800 transition-colors">
                <div className="flex items-center gap-1 text-yellow-400 mb-4">
                  {[...Array(review.rating || 5)].map((_, i) => (
                    <Star key={i} fill="currentColor" className="w-4 h-4" />
                  ))}
                </div>
                <p className="text-slate-300 mb-6 leading-relaxed relative">
                  <Quote className="absolute -top-2 -left-2 w-6 h-6 text-slate-600 opacity-50 transform -scale-x-100" />
                  {review.content || ""}
                </p>
                <div className="flex items-center gap-3 mt-auto">
                  <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center font-bold text-white">
                    {review.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-semibold text-white">{review.name}</div>
                    <div className="text-xs text-slate-500">
                      {review.createdAt ? new Date(review.createdAt).toLocaleDateString() : "Recent"}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
