<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use App\Models\Testimonial;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use App\Traits\TracksVisitors;
use Illuminate\Support\Facades\Gate;

class TestimonialController extends Controller
{
    use TracksVisitors;
    
    public function __construct()
    {
        // Apply permission middleware to all methods
        $this->middleware('permission:testimonial-list')->only(['index', 'show']);
        $this->middleware('permission:testimonial-create')->only(['create', 'store']);
        $this->middleware('permission:testimonial-edit')->only(['edit', 'update', 'toggleStatus']);
        $this->middleware('permission:testimonial-delete')->only(['destroy']);
    }
    public function index(Request $request): Response
    {
        Gate::authorize('testimonial-list');
        
        // Track visitor
        $this->trackPageVisit($request, 'Testimonials');
        
        // Get all testimonials for listing page
        $testimonials = Testimonial::public()
            ->ordered()
            ->get()
            ->map(function ($testimonial) {
                return [
                    'id' => $testimonial->id,
                    'name' => $testimonial->nama,
                    'role' => $testimonial->keterangan,
                    'company' => $testimonial->perusahaan,
                    'content' => $testimonial->testimoni,
                    'avatar' => $testimonial->foto_avatar ?? '/images/avatar-placeholder.png',
                    'rating' => $testimonial->rate_star,
                    'created_at' => $testimonial->created_at->format('d M Y'),
                    'featured' => $testimonial->sequence === 1, // First testimonial is featured
                ];
            });

        // Get featured testimonial for hero section
        $featuredTestimonial = Testimonial::public()
            ->ordered()
            ->first();
            
        $featuredTestimonialData = null;
        if ($featuredTestimonial) {
            $featuredTestimonialData = [
                'id' => $featuredTestimonial->id,
                'name' => $featuredTestimonial->nama,
                'role' => $featuredTestimonial->keterangan,
                'company' => $featuredTestimonial->perusahaan,
                'content' => $featuredTestimonial->testimoni,
                'avatar' => $featuredTestimonial->foto_avatar ?? '/images/avatar-placeholder.png',
                'rating' => $featuredTestimonial->rate_star,
                'created_at' => $featuredTestimonial->created_at->format('d M Y'),
            ];
        }

        return Inertia::render('frontend/testimonial/index', [
            'testimonials' => $testimonials,
            'featuredTestimonial' => $featuredTestimonialData,
            'stats' => [
                'total_testimonials' => $testimonials->count(),
                'average_rating' => $testimonials->avg('rating'),
                'companies_served' => $testimonials->pluck('company')->filter()->unique()->count(),
            ],
            'seo' => [

                'title' =>
                    'Testimoni Pelanggan',

                'description' =>
                    'Lihat testimonial dan pengalaman pelanggan Alumoda Sinergi Kontainer Indonesia dalam layanan jual beli, modifikasi, dan sewa container berkualitas.',

                'keywords' =>
                    'testimoni container, review container, pelanggan container, jasa container',

                'image' => asset(
                    'images/logo-main.png'
                ),

                'type' => 'website',
            ],
        ]);
    }

    public function show(Request $request, $id): Response
    {
        Gate::authorize('testimonial-list');
        
        // Track visitor
        $this->trackPageVisit($request, 'Testimonial Detail - ' . $id);
        
        $testimonial = Testimonial::public()
            ->findOrFail($id);

        $testimonialData = [
            'id' => $testimonial->id,
            'name' => $testimonial->nama,
            'role' => $testimonial->keterangan,
            'company' => $testimonial->perusahaan,
            'content' => $testimonial->testimoni,
            'avatar' => $testimonial->foto_avatar ?? '/images/avatar-placeholder.png',
            'rating' => $testimonial->rate_star,
            'created_at' => $testimonial->created_at->format('d M Y'),
            'updated_at' => $testimonial->updated_at->format('d M Y'),
        ];

        // Get related testimonials (excluding current one)
        $relatedTestimonials = Testimonial::public()
            ->where('id', '!=', $id)
            ->ordered()
            ->take(3)
            ->get()
            ->map(function ($testimonial) {
                return [
                    'id' => $testimonial->id,
                    'name' => $testimonial->nama,
                    'role' => $testimonial->keterangan,
                    'company' => $testimonial->perusahaan,
                    'content' => $testimonial->testimoni,
                    'avatar' => $testimonial->foto_avatar ?? '/images/avatar-placeholder.png',
                    'rating' => $testimonial->rate_star,
                    'created_at' => $testimonial->created_at->format('d M Y'),
                ];
            });

        return Inertia::render('frontend/testimonial/show', [
            'testimonial' => $testimonialData,
            'relatedTestimonials' => $relatedTestimonials,
        ]);
    }

    /**
     * Handle testimonial submission form display and processing
     */
    public function submit(Request $request)
    {
        Gate::authorize('testimonial-create');
        
        // Track visitor
        $this->trackPageVisit($request, 'Testimonial Submission');

        // Handle POST request - form submission
        if ($request->isMethod('post')) {
            // Validate the request
            $validated = $request->validate([
                'nama' => 'required|string|max:255',
                'keterangan' => 'nullable|string|max:255',
                'perusahaan' => 'nullable|string|max:255',
                'testimoni' => 'required|string|min:10|max:2000',
                'rate_star' => 'required|integer|min:1|max:5',
                'foto_avatar' => 'nullable|image|mimes:jpeg,jpg,png,gif|max:2048',
            ], [
                'nama.required' => 'Nama wajib diisi',
                'testimoni.required' => 'Testimoni wajib diisi',
                'testimoni.min' => 'Testimoni minimal 10 karakter',
                'testimoni.max' => 'Testimoni maksimal 2000 karakter',
                'rate_star.required' => 'Rating wajib dipilih',
                'rate_star.min' => 'Rating minimal 1 bintang',
                'rate_star.max' => 'Rating maksimal 5 bintang',
                'foto_avatar.image' => 'File harus berupa gambar',
                'foto_avatar.mimes' => 'Format gambar yang diperbolehkan: jpeg, jpg, png, gif',
                'foto_avatar.max' => 'Ukuran gambar maksimal 2MB',
            ]);

            // Handle file upload
            $fotoPath = null;
            if ($request->hasFile('foto_avatar')) {
                $fotoPath = $request->file('foto_avatar')->store('testimonials', 'public');
            }

            // Create testimonial
            $testimonial = Testimonial::create([
                'nama' => $validated['nama'],
                'keterangan' => $validated['keterangan'],
                'perusahaan' => $validated['perusahaan'],
                'testimoni' => $validated['testimoni'],
                'rate_star' => $validated['rate_star'],
                'foto_avatar' => $fotoPath,
                'is_show_public' => false, // Default to false, admin can approve later
                'sequence' => 0,
            ]);

            // Redirect with success message
            return redirect()
                ->route('testimonial.submit')
                ->with('success', 'Terima kasih! Testimoni Anda telah berhasil dikirim dan akan ditinjau oleh tim kami.');
        }

        // Handle GET request - display form
        return Inertia::render('frontend/testimonial/submit', [
            'maxRating' => 5,
            'minTestimonialLength' => 10,
            'maxTestimonialLength' => 2000,
            'allowedImageTypes' => ['jpeg', 'jpg', 'png', 'gif'],
            'maxImageSize' => 2048, // 2MB in KB
            'siteName' => \App\Models\Configuration::getValue('site_name', 'Testimonial'),
            'siteLogo' => \App\Models\Configuration::getValue('site_logo'),
            'googleMapsEmbed' => \App\Models\Configuration::getValue('google_maps_embed'),
        ]);
    }
}