<?php

namespace App\Http\Controllers\BackPanel\CMS;

use App\Http\Controllers\Controller;
use App\Models\Faq;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Illuminate\Support\Facades\Gate;

class FaqController extends Controller
{
    public function __construct()
    {
        // Apply permission middleware to all methods
        $this->middleware('permission:faq-list')->only(['index', 'show']);
        $this->middleware('permission:faq-create')->only(['create', 'store']);
        $this->middleware('permission:faq-edit')->only(['edit', 'update', 'toggleStatus']);
        $this->middleware('permission:faq-delete')->only(['destroy']);
    }
    public function index(Request $request)
    {
        Gate::authorize('faq-list');
        
        $faqs = Faq::when($request->search, function ($query, $search) {
                return $query->where('question', 'like', "%{$search}%")
                    ->orWhere('answer', 'like', "%{$search}%");
            })
            ->when($request->has('category'), function ($query) use ($request) {
                return $query->where('category', $request->category);
            })
            ->when($request->has('active'), function ($query) use ($request) {
                $isActive = $request->boolean('active');
                return $query->where('is_active', $isActive);
            })
            ->orderBy('category')
            ->orderBy('position')
            ->orderBy('question')
            ->paginate(15);

        return Inertia::render('backpanel/faq/index', [
            'faqs' => $faqs,
            'filters' => $request->only(['search', 'category', 'active'])
        ]);
    }

    public function create()
    {
        Gate::authorize('faq-create');
        
        return Inertia::render('backpanel/faq/create');
    }

    public function store(Request $request)
    {
        Gate::authorize('faq-create');
        
        $validated = $request->validate([
            'question' => 'required|string|max:255',
            'answer' => 'required|string',
            'category' => 'required|string|max:100',
            'position' => 'nullable|integer|min:0',
            'is_active' => 'sometimes|boolean',
        ]);

        $validated['position'] = $validated['position'] ?? 0;
        $validated['is_active'] = isset($validated['is_active']) 
            ? (bool) $validated['is_active'] 
            : true;

        $faq = Faq::create($validated);

        return redirect()->route('cms.faq.index')
            ->with('success', 'FAQ berhasil dibuat');
    }

    public function show($id)
    {
        Gate::authorize('faq-list');
        
        $faq = Faq::findOrFail($id);

        return Inertia::render('backpanel/faq/show', [
            'faq' => $faq
        ]);
    }

    public function edit($id)
    {
        Gate::authorize('faq-edit');
        
        $faq = Faq::findOrFail($id);

        return Inertia::render('backpanel/faq/edit', [
            'faq' => $faq
        ]);
    }

    public function update(Request $request, $id)
    {
        Gate::authorize('faq-edit');
        
        $faq = Faq::findOrFail($id);

        $validated = $request->validate([
            'question' => 'required|string|max:255',
            'answer' => 'required|string',
            'category' => 'required|string|max:100',
            'position' => 'nullable|integer|min:0',
            'is_active' => 'sometimes|boolean',
        ]);

        $validated['position'] = $validated['position'] ?? $faq->position;
        $validated['is_active'] = isset($validated['is_active']) 
            ? (bool) $validated['is_active'] 
            : $faq->is_active;

        $faq->update($validated);

        return redirect()->route('cms.faq.index')
            ->with('success', 'FAQ berhasil diperbarui');
    }

    public function destroy($id)
    {
        Gate::authorize('faq-delete');
        
        $faq = Faq::findOrFail($id);

        $faq->delete();

        return redirect()->route('cms.faq.index')
            ->with('success', 'FAQ berhasil dihapus');
    }

    public function toggleStatus($id)
    {
        Gate::authorize('faq-edit');
        
        $faq = Faq::findOrFail($id);
        $faq->is_active = !$faq->is_active;
        $faq->save();

        return redirect()->route('cms.faq.index')
            ->with('success', 'Status FAQ berhasil diperbarui');
    }

    public function updatePosition(Request $request)
    {
        Gate::authorize('faq-edit');
        
        $validated = $request->validate([
            'faqs' => 'required|array',
            'faqs.*.id' => 'required|integer|exists:faqs,id',
            'faqs.*.position' => 'required|integer|min:0',
        ]);

        foreach ($validated['faqs'] as $faqData) {
            Faq::where('id', $faqData['id'])
                ->update(['position' => $faqData['position']]);
        }

        return redirect()->route('cms.faq.index')
            ->with('success', 'Posisi FAQ berhasil diperbarui');
    }
}