interface TestimonialCardProps {
  testimonial: {
    id: number;
    name: string;
    role: string;
    company?: string;
    content: string;
    avatar: string;
    rating: number;
    created_at?: string;
  };
  className?: string;
}

export default function TestimonialCard({ testimonial, className = "" }: TestimonialCardProps) {
  return (
    <div className={`rounded-xl bg-slate-50/10 p-8 dark:bg-gray-800 ${className}`}>
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center">
          <img
            src={`/storage/${testimonial.avatar}`}
            alt={testimonial.name}
            className="mr-4 h-12 w-12 rounded-full object-cover"
            onError={(e) => {
              e.currentTarget.src = '/images/placeholder.png';
            }}
          />
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white">
              {testimonial.name}
            </h4>
            {/* <p className="text-sm text-gray-500">{testimonial.role}</p> */}
            {testimonial.company && (
              <p className="text-xs text-gray-400">{testimonial.company}</p>
            )}
          </div>
        </div>
        
        {/* Bagian Bintang */}
        <div className="flex text-yellow-400">
          {[...Array(5)].map((_, i) => (
            <svg
              key={i}
              className={`h-5 w-5 ${i < testimonial.rating ? 'fill-current' : 'fill-gray-300'}`}
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
        </div>
      </div>
      <p className="text-gray-600 italic dark:text-gray-300">"{testimonial.content}"</p>
      {testimonial.created_at && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {testimonial.created_at}
          </div>
        </div>
      )}
    </div>
  );
}
