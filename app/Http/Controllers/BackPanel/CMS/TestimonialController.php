<?php

namespace App\Http\Controllers\BackPanel\CMS;

use App\Http\Controllers\Controller;
use App\Models\Testimonial;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class TestimonialController extends Controller
{
    public function index(Request $request)
    {
        $testimonials = Testimonial::query()
            ->when($request->search, function ($query, $search) {
                return $query->where('nama', 'like', "%{$search}%")
                    ->orWhere('perusahaan', 'like', "%{$search}%")
                    ->orWhere('testimoni', 'like', "%{$search}%");
            })
            ->when($request->has('public'), function ($query) use ($request) {
                $isShowPublic = $request->boolean('public');
                return $query->where('is_show_public', $isShowPublic);
            })
            ->when($request->rating, function ($query, $rating) {
                return $query->where('rate_star', $rating);
            })
            ->when($request->date_from, function ($query, $dateFrom) {
                return $query->whereDate('created_at', '>=', $dateFrom);
            })
            ->when($request->date_to, function ($query, $dateTo) {
                return $query->whereDate('created_at', '<=', $dateTo);
            })
            ->when($request->sort, function ($query, $sort) {
                switch ($sort) {
                    case 'newest':
                        return $query->orderBy('created_at', 'desc');
                    case 'oldest':
                        return $query->orderBy('created_at', 'asc');
                    default:
                        return $query->orderBy('created_at', 'desc');
                }
            }, function ($query) {
                // Default sorting if no sort is specified
                return $query->orderBy('sequence', 'asc')->orderBy('created_at', 'desc');
            })
            ->paginate(10);

        // Get metrics
        $totalTestimonials = Testimonial::count();
        $starRatings = Testimonial::selectRaw('rate_star, COUNT(*) as count')
            ->groupBy('rate_star')
            ->orderBy('rate_star', 'desc')
            ->pluck('count', 'rate_star')
            ->toArray();

        return Inertia::render('backpanel/testimonial/index', [
            'testimonials' => $testimonials,
            'metrics' => [
                'total' => $totalTestimonials,
                'star_5' => $starRatings[5] ?? 0,
                'star_4' => $starRatings[4] ?? 0,
                'star_3' => $starRatings[3] ?? 0,
                'star_2' => $starRatings[2] ?? 0,
                'star_1' => $starRatings[1] ?? 0,
            ],
            'filters' => [
                'search' => $request->search ?? '',
                'public' => $request->public ?? 'all',
                'rating' => $request->rating ?? 'all',
                'date_from' => $request->date_from ?? '',
                'date_to' => $request->date_to ?? '',
                'sort' => $request->sort ?? 'sequence'
            ]
        ]);
    }

    public function create()
    {
        return Inertia::render('backpanel/testimonial/create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama' => 'required|string|max:255',
            'keterangan' => 'nullable|string|max:255',
            'perusahaan' => 'nullable|string|max:255',
            'foto_avatar' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'rate_star' => 'required|integer|min:1|max:5',
            'testimoni' => 'required|string|max:1000',
            'is_show_public' => 'boolean',
        ]);

        if ($request->hasFile('foto_avatar')) {
            $image = $request->file('foto_avatar');
            $path = $image->store('testimonials', 'public');
            $validated['foto_avatar'] = $path;
        }

        $validated['sequence'] = Testimonial::max('sequence') + 1;
        $validated['is_show_public'] = $validated['is_show_public'] ?? true;

        Testimonial::create($validated);

        return redirect()->route('cms.testimonial.index')
            ->with('success', 'Testimonial berhasil ditambahkan');
    }

    public function show($id)
    {
        $testimonial = Testimonial::findOrFail($id);

        return Inertia::render('backpanel/testimonial/show', [
            'testimonial' => $testimonial
        ]);
    }

    public function edit($id)
    {
        $testimonial = Testimonial::findOrFail($id);

        return Inertia::render('backpanel/testimonial/edit', [
            'testimonial' => $testimonial
        ]);
    }

    public function update(Request $request, $id)
    {
        $testimonial = Testimonial::findOrFail($id);

        $validated = $request->validate([
            'nama' => 'required|string|max:255',
            'keterangan' => 'nullable|string|max:255',
            'perusahaan' => 'nullable|string|max:255',
            'foto_avatar' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'rate_star' => 'required|integer|min:1|max:5',
            'testimoni' => 'required|string|max:1000',
            'is_show_public' => 'boolean',
        ]);

        // Handle image upload
        if ($request->hasFile('foto_avatar')) {
            // Delete old image if exists
            if ($testimonial->foto_avatar) {
                Storage::disk('public')->delete($testimonial->foto_avatar);
            }
            $image = $request->file('foto_avatar');
            $path = $image->store('testimonials', 'public');
            $validated['foto_avatar'] = $path;
        }

        // Handle image removal
        if ($request->input('remove_foto_avatar') && $testimonial->foto_avatar) {
            Storage::disk('public')->delete($testimonial->foto_avatar);
            $validated['foto_avatar'] = null;
        }

        $validated['is_show_public'] = isset($validated['is_show_public']) 
            ? (bool) $validated['is_show_public'] 
            : $testimonial->is_show_public;

        $testimonial->update($validated);

        return redirect()->route('cms.testimonial.index')
            ->with('success', 'Testimonial berhasil diperbarui');
    }

    public function destroy($id)
    {
        $testimonial = Testimonial::findOrFail($id);

        if ($testimonial->foto_avatar) {
            Storage::disk('public')->delete($testimonial->foto_avatar);
        }

        $testimonial->delete();

        return redirect()->route('cms.testimonial.index')
            ->with('success', 'Testimonial berhasil dihapus');
    }

    public function toggleStatus($id)
    {
        $testimonial = Testimonial::findOrFail($id);
        $testimonial->is_show_public = !$testimonial->is_show_public;
        $testimonial->save();

        return redirect()->route('cms.testimonial.index')
            ->with('success', 'Status testimonial berhasil diperbarui');
    }
}