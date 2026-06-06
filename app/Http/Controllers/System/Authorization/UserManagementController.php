<?php

namespace App\Http\Controllers\BackPanel\Authorization;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\User;
use App\Models\Role;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Gate;

class UserManagementController extends Controller
{
    public function __construct()
    {
        // Apply permission middleware to all methods
        $this->middleware('permission:user-list')->only(['index', 'show']);
        $this->middleware('permission:user-create')->only(['create', 'store']);
        $this->middleware('permission:user-edit')->only(['edit', 'update', 'toggleStatus']);
        $this->middleware('permission:user-delete')->only(['destroy']);
    }

    public function index(Request $request)
    {
        Gate::authorize('user-list');
        
        $users = User::withTrashed()
            ->with('roles', 'permissions')
            ->when($request->search, function ($query, $search) {
                $query->where('name', 'like', "%{$search}%")
                      ->orWhere('email', 'like', "%{$search}%");
            })
            ->when($request->role, function ($query, $role) {
                if ($role !== 'all') {
                    $query->whereHas('roles', function ($q) use ($role) {
                        $q->where('name', $role);
                    });
                }
            })
            ->when($request->status, function ($query, $status) {
                if ($status !== 'all') {
                    $query->where('is_active', $status === 'true');
                }
            })
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        $roles = Role::orderBy('name')->pluck('name');

        return Inertia::render('backpanel/authorization/users/index', [
            'users' => $users,
            'roles' => $roles,
            'filters' => $request->only(['search', 'role', 'status']),
        ]);
    }

    public function create()
    {
        Gate::authorize('user-create');
        
        $roles = Role::orderBy('name')->get();

        return Inertia::render('backpanel/authorization/users/create', [
            'roles' => $roles,
        ]);
    }

    public function store(Request $request)
    {
        Gate::authorize('user-create');
        
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email',
            'password' => 'required|string|min:8|confirmed',
            'roles' => 'array',
            'roles.*' => 'exists:roles,name',
            'is_active' => 'boolean',
            'avatar' => 'nullable|image|mimes:jpeg,jpg,png,gif|max:2048',
        ], [
            'avatar.image' => 'File harus berupa gambar',
            'avatar.mimes' => 'Format gambar yang diperbolehkan: jpeg, jpg, png, gif',
            'avatar.max' => 'Ukuran gambar maksimal 2MB',
        ]);

        if ($validator->fails()) {
            return back()->withErrors($validator)->withInput();
        }

        // Handle avatar upload
        $avatarPath = null;
        if ($request->hasFile('avatar')) {
            $avatarPath = $request->file('avatar')->store('avatars', 'public');
        }

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'is_active' => $request->is_active ?? true,
            'email_verified_at' => now(),
            'avatar' => $avatarPath,
        ]);

        if ($request->roles) {
            $user->assignRole($request->roles);
        }

        return redirect()->route('authorization.users.index')
            ->with('success', 'User berhasil dibuat.');
    }

    public function show($id)
    {
        Gate::authorize('user-list');
        
        $user = User::withTrashed()->with('roles.permissions')->findOrFail($id);

        return Inertia::render('backpanel/authorization/users/show', [
            'user' => $user,
        ]);
    }

    public function edit($id)
    {
        Gate::authorize('user-edit');
        
        $user = User::withTrashed()->findOrFail($id);
        $user->load('roles');
        $roles = Role::orderBy('name')->get();

        return Inertia::render('backpanel/authorization/users/edit', [
            'user' => $user,
            'roles' => $roles,
        ]);
    }

    public function update(Request $request, $id)
    {
        Gate::authorize('user-edit');
        
        $user = User::withTrashed()->findOrFail($id);
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => [
                'required',
                'string',
                'email',
                'max:255',
                Rule::unique('users')->ignore($user->id),
            ],
            'password' => 'nullable|string|min:8|confirmed',
            'roles' => 'array',
            'roles.*' => 'exists:roles,name',
            'is_active' => 'boolean',
            'avatar' => 'nullable|image|mimes:jpeg,jpg,png,gif|max:2048',
            'remove_avatar' => 'boolean',
        ], [
            'avatar.image' => 'File harus berupa gambar',
            'avatar.mimes' => 'Format gambar yang diperbolehkan: jpeg, jpg, png, gif',
            'avatar.max' => 'Ukuran gambar maksimal 2MB',
        ]);

        if ($validator->fails()) {
            return back()->withErrors($validator)->withInput();
        }

        // Handle avatar upload or removal
        $avatarPath = $user->avatar; // Keep existing avatar by default
        
        if ($request->boolean('remove_avatar')) {
            // Remove existing avatar
            if ($user->avatar && Storage::disk('public')->exists($user->avatar)) {
                Storage::disk('public')->delete($user->avatar);
            }
            $avatarPath = null;
        } elseif ($request->hasFile('avatar')) {
            // Upload new avatar
            // Remove old avatar if exists
            if ($user->avatar && Storage::disk('public')->exists($user->avatar)) {
                Storage::disk('public')->delete($user->avatar);
            }
            $avatarPath = $request->file('avatar')->store('avatars', 'public');
        }

        $user->update([
            'name' => $request->name,
            'email' => $request->email,
            'is_active' => $request->is_active ?? true,
            'avatar' => $avatarPath,
            'deleted_at' => null,
        ]);

        if ($request->password) {
            $user->update([
                'password' => Hash::make($request->password),
            ]);
        }

        if ($request->roles) {
            $user->syncRoles($request->roles);
        } else {
            $user->syncRoles([]);
        }

        return redirect()->route('authorization.users.index')
            ->with('success', 'User berhasil diperbarui.');
    }

    public function destroy($id)
    {
        Gate::authorize('user-delete');
        
        $user = User::findOrFail($id);
        if ($user->id === auth()->id()) {
            return back()->with('error', 'Anda tidak dapat menghapus akun sendiri.');
        }

        if ($user->hasRole('Super Admin') && !auth()->user()->hasRole('Super Admin')) {
            return back()->with('error', 'Anda tidak dapat menghapus user Super Admin.');
        }

        $user->delete();

        return redirect()->route('authorization.users.index')
            ->with('success', 'User berhasil dihapus.');
    }

    public function toggleStatus($id)
    {
        Gate::authorize('user-edit');
        
        $user = User::findOrFail($id);
        if ($user->id === auth()->id()) {
            return back()->with('error', 'Anda tidak dapat mengubah status akun sendiri.');
        }

        if ($user->hasRole('Super Admin') && !auth()->user()->hasRole('Super Admin')) {
            return back()->with('error', 'Anda tidak dapat mengubah status user Super Admin.');
        }

        $user->update([
            'is_active' => !$user->is_active,
            'deleted_at' => null,
        ]);

        return back()->with('success', 'Status user berhasil diperbarui.');
    }
}