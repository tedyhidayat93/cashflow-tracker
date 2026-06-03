
import { Head, Link, router, usePage } from '@inertiajs/react';
import { ArrowRight, ArrowRightIcon, Loader, PhoneCall, RefreshCcwDot, SearchIcon } from 'lucide-react';
import { useState, useEffect } from 'react';
import catalog from '@/routes/catalog';
import FrontendLayout from '@/layouts/frontend-layout';
import ProductCard from '@/components/ProductCard';
import TestimonialCard from '@/components/TestimonialCard';
import { handleImageError } from '@/utils/image';
import { useConfig } from '@/utils/config';
import SeoHead from '@/components/seo-head';
import HeroHomepageSection from '@/components/hero-hompage-section';
import GoogleReviewsWidget from '@/components/google-reviews-widget';


export default function Homepage({ 
  products = [], 
  services = [], 
  clients = [], 
  faqs = [], 
  articles = [],
  testimonials = []
}: { 
  products?: any[];
  services?: any[];
  clients?: any[];
  faqs?: any[];
  articles?: any[];
  testimonials?: any[];
}) {
  const { getConfig } = useConfig();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [loadedImages, setLoadedImages] = useState<Record<number, boolean>>({});

  // Typing animation for placeholder
  const [placeholder, setPlaceholder] = useState('');
  const placeholderTexts = [
    'Cari kontainer yang kamu butuhkan...',
    'kontainer 20 feet...',
    'Kontainer 40 feet...',
    'Kontainer office...',
    'Kontainer kustom...'
  ];
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentText = placeholderTexts[currentTextIndex];
    
    const timer = setTimeout(() => {
      if (!isDeleting) {
        if (currentCharIndex < currentText.length) {
          setPlaceholder(currentText.substring(0, currentCharIndex + 1));
          setCurrentCharIndex(currentCharIndex + 1);
        } else {
          setTimeout(() => setIsDeleting(true), 1500); // Pause before deleting
        }
      } else {
        if (currentCharIndex > 0) {
          setPlaceholder(currentText.substring(0, currentCharIndex - 1));
          setCurrentCharIndex(currentCharIndex - 1);
        } else {
          setIsDeleting(false);
          setCurrentTextIndex((currentTextIndex + 1) % placeholderTexts.length);
        }
      }
    }, isDeleting ? 50 : 100);

    return () => clearTimeout(timer);
  }, [currentCharIndex, isDeleting, currentTextIndex, placeholderTexts]);


  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    if (isSearching) return;

    const query = searchQuery.trim();

    // 🔥 HANDLE KOSONG DI LUAR setTimeout
    if (!query) {
      setIsSearching(true);

      setTimeout(() => {
        router.get('/catalog', {}, {
          preserveState: false, // penting!
          preserveScroll: true,
          onFinish: () => setIsSearching(false),
        });
      }, 600);

      return;
    }

    // 🔥 HANDLE ADA QUERY
    setIsSearching(true);

    setTimeout(() => {
      router.get(
        '/catalog',
        { search: query },
        {
          preserveState: true,
          preserveScroll: true,
          onFinish: () => setIsSearching(false),
        }
      );
    }, 600);
  };

  const toggleFaq = (index: number) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  
  // Update the image loading handler
  const handleImageLoad = (id: number) => {
    setLoadedImages(prev => ({ ...prev, [id]: true }));
  };

 

  return (
    <FrontendLayout>
      <SeoHead />

      <main>
        {/* Hero Section */}
        <HeroHomepageSection 
          products={products} // <-- Melempar data produk ke sini
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          handleSearch={handleSearch}
          isSearching={isSearching}
          placeholder="Cari kontainer office, reefer, dll..."
          getConfig={getConfig}
          handleImageError={handleImageError}
        />

        {/* services Section */}
        <section id="services" className="bg-white py-20 dark:bg-gray-900">
          <div className="container mx-auto px-4">
            <div className="mb-16 text-center">
              <h2 className="text-3xl font-bold mb-1 dark:text-orange-400">{getConfig('services_title', 'Layanan Kami')}</h2>
              <p className="mx-auto max-w-5xl text-gray-600 dark:text-gray-300 text-base md:text-xl">
                {getConfig('services_description', 'Berbagai layanan profesional yang kami tawarkan untuk memenuhi kebutuhan kontainer Anda')}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-2 md:gap-8 md:grid-cols-2 lg:grid-cols-3">
              {services.map((service) => (
                <div
                  key={service.id}
                  className="group relative overflow-hidden rounded-xl bg-white p-8 shadow-lg transition-all hover:shadow-xl hover:-translate-y-1 dark:bg-gray-800"
                >
                  <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-amber-200 opacity-20 transition-all group-hover:scale-110 group-hover:opacity-30 dark:bg-amber-900/20"></div>
                  <div className="relative z-10">
                    <div className="mb-6 h-2 w-12 rounded-full bg-amber-300"></div>
                    <h3 className="mb-3 text-xl font-semibold text-gray-900 dark:text-orange-400">
                      {service.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm md:text-base">{service.description}</p>
                  </div>
                </div>
              ))}
              {/* CTA Card */}
              <div className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 p-8 shadow-lg transition-all hover:shadow-xl hover:-translate-y-1">
                <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-white/10 transition-all group-hover:scale-110"></div>
                <div className="relative z-10 text-white">
                  <div className="mb-6 h-2 w-12 rounded-full bg-white/50"></div>
                  <h3 className="mb-4 text-2xl font-bold">
                    Butuh Solusi Khusus?
                  </h3>
                  <p className="mb-6 text-amber-100 text-sm md:text-base">
                    Tim ahli kami siap membantu memberikan solusi terbaik untuk kebutuhan kontainer Anda.
                  </p>
                  <a 
                    href="#contact" 
                    className="inline-flex items-center rounded-full bg-white px-6 py-3 font-medium text-amber-600 transition-colors hover:bg-gray-100"
                  >
                    Hubungi Kami
                    <svg xmlns="http://www.w3.org/2000/svg" className="ml-2 h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* products Section */}
        <section id="products" className="bg-slate-50/80 py-20 dark:bg-gray-800">
          <div className="container mx-auto px-4">
            <div className="mb-12 flex flex-col items-center md:justify-between md:flex-row">
              <div className="mb-4 md:mb-0 text-center md:text-left">
                <h2 className="text-3xl font-bold mb-1 dark:text-orange-400">{getConfig('products_title', 'Produk Kami')}</h2>
                <p className="text-gray-600 dark:text-gray-300">
                  {getConfig('products_description', 'Temukan produk-produk kontainer untuk kebutuhanmu')}
                </p>
              </div>
              <Link href={catalog.index()} className="btn btn-ghost rounded-full! flex items-center px-7!">
                Lihat Katalog <ArrowRight className="ml-1 h-4 w-4" /> 
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {products.map((product) => (
                <ProductCard key={product.slug} product={product} />
              ))}
            </div>

            <div className="mt-16 flex justify-center">
                <Link
                  href="/catalog"
                  className="inline-flex items-center gap-2 rounded-full border-2 border-slate-100 hover:bg-orange-500/30 hover:text-orange-600 font-medium hover:border-orange-400 border-gray-300 dark:border-gray-700 px-6 py-3 text-sm font-medium text-gray-700 dark:text-gray-200 transition-all hover:bg-gray-100 dark:hover:bg-gray-800 hover:gap-3"
                >
                  Tampilkan Lebih Banyak
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
          </div>
        </section>

        {/* Client Section */}
        <section className="relative bg-white py-12 dark:bg-gray-900">
          <div className="container relative mx-auto px-4">
            <div className="mb-12 text-center">
              <h2 className="text-3xl font-bold mb-1 dark:text-orange-400">
                {getConfig('clients_title', 'Klien Kami')}
              </h2>
              <p className="mx-auto max-w-5xl text-gray-600 dark:text-gray-300 text-base md:text-xl">
                {getConfig('clients_description', 'Kami telah melayani berbagai perusahaan dan organisasi di berbagai sektor')}
              </p>
            </div>
            
            <div className="relative rounded-xl ">
              <div className="grid grid-cols-2 gap-2 md:gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                {clients.map((client, index) => (
                  <div key={client.id || index} className={`flex h-32 items-center justify-center rounded-lg bg-white p-4 transition-all hover:border hover:border-orange-400 dark:bg-gray-700 ${client.logo && 'border border-gray-200 bg-slate-400 dark:border-gray-600'}`}>
                    {client.logo ? (
                      <img 
                        src={`${client.logo}`} 
                        alt={client.name} 
                        className="max-h-full max-w-full object-contain"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.nextElementSibling?.classList.remove('hidden');
                        }}
                      />
                    ) : null}
                    <span className={`text-center font-bold italic text-gray-700 dark:text-gray-200 ${client.logo ? 'hidden' : ''}`}>
                      {client.name}
                    </span>
                  </div>
                ))}
              </div>
            
            </div>
          </div>
        </section>

        {/* Testimoni Section */}
        <section className="bg-gradient-to-b from-orange-100 to-gray-50 dark:from-gray-900 dark:to-gray-950">
          <div className="container mx-auto px-4 py-20">

              {/* Header */}
              <div className="mb-16 text-center max-w-2xl mx-auto">
                <h2 className="text-3xl font-bold mb-1 dark:text-orange-400">
                  {getConfig('testimonials_title', 'Apa Kata Mereka')}
                </h2>
                <p className="mx-auto max-w-5xl text-gray-600 dark:text-gray-300 text-base md:text-xl">
                  {getConfig('testimonials_description', 'Testimoni dari klien yang telah menggunakan layanan kami')}
                </p>
              </div>

              {/* Testimonials Grid */}
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-4">
                {testimonials.map((testimonial) => (
                  <div 
                    key={testimonial.id}
                    className="group h-full"
                  >
                    <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                      <TestimonialCard testimonial={testimonial} />
                    </div>
                  </div>
                ))}
              </div>

              <GoogleReviewsWidget />

              {/* CTA */}
              <div className="mt-16 flex justify-center">
                <Link
                  href="/testimonial"
                  className="inline-flex items-center gap-2 rounded-full border border-gray-300 dark:border-gray-700 px-6 py-3 text-sm font-medium text-gray-700 dark:text-gray-200 transition-all hover:bg-gray-100 dark:hover:bg-gray-800 hover:gap-3"
                >
                  Tampilkan Lebih Banyak
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
        </section>

        {/* FAQ Section */}
        <section className="bg-slate-50/80 py-20 dark:bg-gray-800">
          {faqs.length > 0 && (
            <div className="container mx-auto px-4">
              
              {/* Header */}
              <div className="mb-14 text-center">
                <h2 className="text-3xl font-bold mb-1 dark:text-orange-400">
                  {getConfig('faq_title', 'Pertanyaan yang Sering Diajukan')}
                </h2>
                <p className="mx-auto max-w-3xl text-gray-600 dark:text-gray-300 text-lg">
                  {getConfig('faq_description', 'Temukan jawaban atas pertanyaan umum seputar layanan kami')}
                </p>
              </div>

              {/* FAQ List */}
              <div className="mx-auto max-w-full grid md:grid-cols-2 gap-4">
                {faqs.map((faq, index) => {
                  const isActive = activeFaq === index;

                  return (
                    <div
                      key={index}
                      className={`
                        group rounded-xl border transition-all duration-300 h-max
                        ${isActive 
                          ? 'bg-white dark:bg-gray-900 border-primary shadow-lg' 
                          : 'bg-white/70 dark:bg-gray-900/40 border-gray-200 dark:border-gray-700 hover:shadow-md hover:border-primary/50'
                        }
                      `}
                    >
                      
                      {/* Question */}
                      <button
                        onClick={() => toggleFaq(index)}
                        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                      >
                        <div className="flex items-start gap-3">
                          
                          {/* Icon */}
                          <div className={`
                            mt-1 flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold
                            ${isActive 
                              ? 'bg-primary text-white' 
                              : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 group-hover:bg-primary group-hover:text-white'
                            }
                          `}>
                            ?
                          </div>

                          {/* Text */}
                          <span className="font-medium text-gray-900 dark:text-white leading-snug">
                            {faq.question}
                          </span>
                        </div>

                        {/* Arrow */}
                        <svg
                          className={`h-5 w-5 shrink-0 transform transition-transform duration-300 ${
                            isActive ? 'rotate-180 text-primary' : 'text-gray-400'
                          }`}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </button>

                      {/* Answer */}
                      <div
                        className={`
                          grid transition-all duration-300 ease-in-out
                          ${isActive ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}
                        `}
                      >
                        <div className="overflow-hidden">
                          <div className="px-5 pb-5 text-gray-600 dark:text-gray-300 leading-relaxed">
                            {faq.answer}
                          </div>
                        </div>
                      </div>

                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </section>

        {/* Article section */}
        <section id="article" className="bg-white dark:bg-gray-900">
          {
            articles.length > 0 && (
              <div className="container mx-auto px-4 py-20">
                <div className="mb-12 text-center">
                  <h2 className="text-3xl font-bold mb-1 dark:text-orange-400">{getConfig('articles_title', 'Artikel Terbaru')}</h2>
                  <p className="mx-auto max-w-5xl text-gray-600 dark:text-gray-300 text-base md:text-xl">
                    {getConfig('articles_description', 'Temukan informasi terbaru seputar kontainer dan solusi logistik')}
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {articles.map((article) => (
                    <div 
                      key={article.id} 
                      onClick={() => window.location.href=`/articles/${article.slug}`}
                      className="group overflow-hidden rounded-xl bg-white shadow-sm cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 dark:bg-gray-800"
                    >
                      <div className="relative h-52 overflow-hidden bg-gray-100 dark:bg-gray-700">
                          <div className="absolute inset-0 bg-gradient-to-r from-amber-100 to-amber-200 dark:from-gray-700 dark:to-gray-600 transition-transform duration-500 group-hover:scale-110" />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <img 
                              src={'storage/' + article.image} 
                              alt={article.title} 
                              className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-110 ${
                                loadedImages[article.id] ? 'opacity-100' : 'opacity-0'
                              }`}
                              loading="lazy"
                              onLoad={() => handleImageLoad(article.id)}
                              onError={(e) => handleImageError(e, undefined, article.title)}
                            />
                            {!loadedImages[article.id] && (
                              <div className="absolute inset-0 flex items-center justify-center">
                                <div className="animate-pulse flex space-x-4 w-full h-full">
                                  <div className="flex-1 space-y-4 py-1">
                                    <div className="h-full w-full bg-gray-300 dark:bg-gray-600 rounded"></div>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      <div className="p-6">
                        <div className="mb-3 text-xs text-gray-500 dark:text-gray-400 flex items-center gap-2">
                          {article.category}
                          {article.category && <span>•</span>}
                          {article.date}
                        </div>
                        <h3 className="mb-3 text-xl font-semibold text-gray-900 dark:text-white group-hover:text-amber-600 transition-colors">
                          {article.title}
                        </h3>
                        <p className="mb-4 text-gray-600 dark:text-gray-300 line-clamp-3">
                          {article.excerpt}
                        </p>

                        <div className="flex items-center justify-between">
                          <Link 
                            href={`/articles/${article.slug}`} 
                            className="flex items-center text-sm font-medium text-slate-400 transition-colors hover:text-amber-700 dark:hover:text-amber-300"
                          >
                            Baca Selengkapnya
                            <ArrowRightIcon className="ml-1 h-4 w-4" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-12 text-center flex items-center justify-center">
                  <Link 
                    href="/articles"
                    className="btn btn-ghost flex items-center"
                  >
                    Tampilkan Lebih Banyak <ArrowRight className="ml-1 h-4 w-4" />  
                  </Link>
                </div>
              </div>
            )
          }
        </section>

        {/* CTA Section */}
        <section id="contact" className="bg-orange-200 dark:bg-orange-300 py-20 text-white">
          <div className="container mx-auto px-4 text-center flex flex-col justify-center items-center">
            <h2 className="mb-6 text-3xl md:text-5xl font-[800]! text-black">{getConfig('cta_title', 'Butuh Kontainer untuk Bisnis Anda?')}</h2>
            <p className="mx-auto mb-8 text-slate-800 max-w-2xl">
              {getConfig('cta_description', 'Dapatkan penawaran terbaik untuk sewa atau beli kontainer berkualitas. Cocok untuk berbagai kebutuhan usaha mulai dari gudang, kantor, hingga ruang komersial.')}
            </p>
            <a target='_blank' href={`https://wa.me/${getConfig('contact_whatsapp', '6281282336464').replace(/\D/g, '')}?text=${getConfig('whatsapp_message', 'Halo%20Alumoda%2C%20saya%20ingin%20bertanya')}`}  className="btn flex! w-max items-center gap-2 text-white bg-green-600 cursor-pointer animate-bounce! hover:bg-green-500 shadow-lg p-4! px-7! rounded-full! text-base"> 
              <PhoneCall className="h-5 w-5" /> {getConfig('cta_button_text', 'Hubungi Kami via WhatsApp')}</a>
          </div>
        </section>
      </main>
    </FrontendLayout>
  );
}
