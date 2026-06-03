import { Head, Link } from '@inertiajs/react';
import FrontendLayout from '@/layouts/frontend-layout';
import { getConfig } from '@/hooks/use-configuration';
import TestimonialCard from '@/components/TestimonialCard';
import SeoHead from '@/components/seo-head';
import GoogleReviewsWidget from '@/components/google-reviews-widget';

export default function TestimonialIndex({ 
    testimonials = [], 
    featuredTestimonial = null, 
    stats = {} 
}: { 
    testimonials?: any[];
    featuredTestimonial?: any;
    stats?: any;
}) {
   
    return (
        <FrontendLayout>
            <SeoHead title={'Ulasan'} />

            {/* All Testimonials Grid */}
            <div className="py-16 dark:bg-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                            Semua Testimoni
                        </h2>
                        <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
                            Lihat apa yang dikatakan klien kami tentang layanan kami
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 mb-4">
                        {testimonials.map((testimonial) => (
                            <TestimonialCard key={testimonial.id} testimonial={testimonial} />
                        ))}
                    </div>

                    <GoogleReviewsWidget />

                    {testimonials.length === 0 && (
                        <div className="text-center py-12">
                            <div className="text-gray-500 dark:text-gray-400">
                                Belum ada testimoni yang tersedia.
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </FrontendLayout>
    );
}