// components/CountryPopup.tsx
'use client'
import { useEffect, useState } from 'react'
import { getCookie, setCookie, hasCookie } from 'cookies-next'
import { getCountryByIso } from '@/app/actions/getCountryByIso'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { X } from 'lucide-react'

export default function CountryPopup() {
  const pathname = usePathname();
  const [suggestion, setSuggestion] = useState<{name: string, slug: string, flag: string | null} | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    async function check() {
      // 1. Check if dismissed
      if (hasCookie('country_popup_dismissed')) return;

      // 2. Get the ISO code from cookie (set by proxy.ts)
      const geoCode = getCookie('detected_geo_origin');
      if (!geoCode) {
        console.log('⚠️ No geo code detected');
        return;
      }

      console.log('🌍 Detected geo code:', geoCode);

      // 3. Get current slug from URL (e.g. "us", "bd")
      const currentUrlSlug = pathname.split('/')[1];
      console.log('📍 Current URL slug:', currentUrlSlug);

      // 4. Ask DB: "Who corresponds to this ISO code?"
      const supportedCountry = await getCountryByIso(geoCode as string);

      if (supportedCountry) {
        console.log('✅ Found country for ISO:', supportedCountry);
        
        // 5. The Magic Check:
        // If DB says for 'BD' the slug is 'bd', 
        // and current URL is 'us', then SHOW POPUP.
        if (supportedCountry.slug !== currentUrlSlug) {
           console.log('🔔 Showing popup - mismatch detected');
           setSuggestion(supportedCountry);
           setIsVisible(true);
        } else {
          console.log('✓ Already on correct country site');
        }
      } else {
        console.log('❌ No country found for ISO:', geoCode);
      }
    }
    check();
  }, [pathname]);

  const handleDismiss = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsVisible(false);
      setSuggestion(null);
    }, 300);
    setCookie('country_popup_dismissed', 'true', { maxAge: 60 * 60 * 24 * 7 }); // 7 days
  };

  const handleAccept = () => {
    handleDismiss();
  };

  if (!isVisible || !suggestion) return null;

  // Build the new path properly by replacing the country segment
  const pathSegments = pathname.split('/').filter(Boolean); // Remove empty strings
  pathSegments[0] = suggestion.slug; // Replace country
  const newPath = '/' + pathSegments.join('/');

  return (
    <div 
      className={`fixed top-0 left-0 w-full bg-linear-to-r from-blue-600 to-purple-600 text-white z-50 shadow-lg transition-all duration-300 ${
        isClosing ? 'opacity-0 -translate-y-full' : 'opacity-100 translate-y-0'
      }`}
    >
      <div className="container mx-auto px-4 py-3 flex flex-col sm:flex-row justify-between items-center gap-3">
        <div className="flex items-center gap-3">
          {suggestion.flag && (
            <Image 
              src={suggestion.flag} 
              alt={suggestion.name} 
              width={32} 
              height={32} 
              className="rounded shadow"
            />
          )}
          <p className="text-sm sm:text-base">
            It looks like you're from <strong>{suggestion.name}</strong>. 
            Would you like to visit your local site?
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <button 
            onClick={handleDismiss}
            className="px-4 py-1.5 text-sm rounded border border-white/30 hover:bg-white/10 transition-colors"
          >
            Stay here
          </button>
          
          <Link 
            href={newPath}
            onClick={handleAccept}
            className="px-4 py-1.5 text-sm rounded bg-white text-blue-600 font-medium hover:bg-gray-100 transition-colors"
          >
            Go to {suggestion.name}
          </Link>
          
          <button 
            onClick={handleDismiss}
            className="ml-2 p-1 hover:bg-white/10 rounded transition-colors"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>
      </div>
    </div>
  )
}