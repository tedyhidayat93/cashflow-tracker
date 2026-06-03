<?php

namespace App\Http\Controllers\BackPanel\CMS;

use App\Http\Controllers\Controller;
use App\Models\Client;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Gate;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class ClientController extends Controller
{
    public function __construct()
    {
        // Apply permission middleware to all methods
        $this->middleware('permission:client-list')->only(['index', 'show']);
        $this->middleware('permission:client-create')->only(['create', 'store']);
        $this->middleware('permission:client-edit')->only(['edit', 'update', 'toggleStatus']);
        $this->middleware('permission:client-delete')->only(['destroy']);
    }
    public function index(Request $request)
    {
        Gate::authorize('client-list');
        
        $clients = Client::when($request->search, function ($query, $search) {
                return $query->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('pic', 'like', "%{$search}%");
            })
            ->when($request->has('active'), function ($query) use ($request) {
                $isActive = $request->boolean('active');
                return $query->where('is_active', $isActive);
            })
            ->ordered()
            ->paginate(10);

        return Inertia::render('backpanel/client/index', [
            'clients' => $clients,
            'filters' => $request->only(['search', 'active'])
        ]);
    }

    public function create()
    {
        Gate::authorize('client-create');
        
        return Inertia::render('backpanel/client/create');
    }

    public function store(Request $request)
    {
        Gate::authorize('client-create');
        
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'website' => 'nullable|url|max:255',
            'phone' => 'nullable|string|max:20',
            'email' => 'nullable|email|max:255',
            'address' => 'nullable|string|max:1000',
            'pic' => 'nullable|string|max:255',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'is_active' => 'sometimes|boolean',
        ]);

        if ($request->hasFile('image')) {
            $image = $request->file('image');
            $path = $image->store('clients', 'public');
            $validated['image'] = $path;
        }

        $validated['is_active'] = isset($validated['is_active']) 
            ? (bool) $validated['is_active'] 
            : true;

        Client::create($validated);

        return redirect()->route('cms.client.index')
            ->with('success', 'Klien berhasil dibuat');
    }

    public function show($id)
    {
        Gate::authorize('client-list');
        
        $client = Client::findOrFail($id);

        return Inertia::render('backpanel/client/show', [
            'client' => $client
        ]);
    }

    public function edit($id)
    {
        Gate::authorize('client-edit');
        
        $client = Client::findOrFail($id);

        return Inertia::render('backpanel/client/edit', [
            'client' => $client
        ]);
    }

    public function update(Request $request, $id)
    {
        Gate::authorize('client-edit');
        
        $client = Client::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'website' => 'nullable|url|max:255',
            'phone' => 'nullable|string|max:20',
            'email' => 'nullable|email|max:255',
            'address' => 'nullable|string|max:1000',
            'pic' => 'nullable|string|max:255',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'is_active' => 'sometimes|boolean',
        ]);

        // Handle image upload
        if ($request->hasFile('image')) {
            // Delete old image if exists
            if ($client->image) {
                Storage::disk('public')->delete($client->image);
            }
            $image = $request->file('image');
            $path = $image->store('clients', 'public');
            $validated['image'] = $path;
        }

        // Handle image removal
        if ($request->input('remove_image') && $client->image) {
            Storage::disk('public')->delete($client->image);
            $validated['image'] = null;
        }

        // Handle boolean field
        $validated['is_active'] = isset($validated['is_active']) 
            ? (bool) $validated['is_active'] 
            : $client->is_active;

        // Update client
        $client->update($validated);

        return redirect()->route('cms.client.index')
            ->with('success', 'Klien berhasil diperbarui');
    }

    public function destroy($id)
    {
        Gate::authorize('client-delete');
        
        $client = Client::findOrFail($id);

        if ($client->image) {
            Storage::disk('public')->delete($client->image);
        }

        $client->delete();

        return redirect()->route('cms.client.index')
            ->with('success', 'Klien berhasil dihapus');
    }

    public function toggleStatus($id)
    {
        Gate::authorize('client-edit');
        
        $client = Client::findOrFail($id);
        $client->is_active = !$client->is_active;
        $client->save();

        return redirect()->route('cms.client.index')
            ->with('success', 'Status klien berhasil diperbarui');
    }
}