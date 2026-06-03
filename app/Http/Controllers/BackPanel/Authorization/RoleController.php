<?php

namespace App\Http\Controllers\BackPanel\Authorization;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Role;
use App\Models\Permission;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Gate;

class RoleController extends Controller
{
    public function __construct()
    {
        // Apply permission middleware to all methods
        $this->middleware('permission:role-list')->only(['index', 'show', 'permissions']);
        $this->middleware('permission:role-create')->only(['create', 'store']);
        $this->middleware('permission:role-edit')->only(['edit', 'update', 'toggleStatus', 'syncPermissions']);
        $this->middleware('permission:role-delete')->only(['destroy']);
    }

    public function index(Request $request)
    {
        Gate::authorize('role-list');
        
        $roles = Role::with('permissions')
            ->when($request->search, function ($query, $search) {
                $query->where('name', 'like', "%{$search}%");
            })
            ->when($request->status, function ($query, $status) {
                if ($status !== 'all') {
                    $query->where('is_active', $status === 'true');
                }
            })
            ->orderBy('id', 'asc')
            ->paginate(10);

        return Inertia::render('backpanel/authorization/roles/index', [
            'roles' => $roles,
            'filters' => $request->only(['search', 'status']),
        ]);
    }

    public function create()
    {
        Gate::authorize('role-create');
        
        return Inertia::render('backpanel/authorization/roles/create');
    }

    public function store(Request $request)
    {
        Gate::authorize('role-create');
        
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255|unique:roles,name',
            'guard_name' => 'required|string|max:255',
            'description' => 'nullable|string|max:500',
            'is_active' => 'boolean',
        ]);

        if ($validator->fails()) {
            return back()->withErrors($validator)->withInput();
        }

        $role = Role::create([
            'name' => $request->name,
            'guard_name' => $request->guard_name,
            'description' => $request->description,
            'is_active' => $request->is_active ?? true,
        ]);

        return redirect()->route('authorization.roles.index')
            ->with('success', 'Role berhasil dibuat.');
    }

    public function show($id)
    {
        Gate::authorize('role-list');
        
        $role = Role::findOrFail($id);
        $role->load('permissions', 'users');

        return Inertia::render('backpanel/authorization/roles/show', [
            'role' => $role,
        ]);
    }

    public function edit($id)
    {
        Gate::authorize('role-edit');
        
        $role = Role::findOrFail($id);
        return Inertia::render('backpanel/authorization/roles/edit', [
            'role' => $role,
        ]);
    }

    public function update(Request $request, $id)
    {
        Gate::authorize('role-edit');
        
        $role = Role::findOrFail($id);
        $validator = Validator::make($request->all(), [
            'name' => [
                'required',
                'string',
                'max:255',
                Rule::unique('roles')->ignore($role->id),
            ],
            'guard_name' => 'required|string|max:255',
            'description' => 'nullable|string|max:500',
            'is_active' => 'boolean',
        ]);

        if ($validator->fails()) {
            return back()->withErrors($validator)->withInput();
        }

        $role->update([
            'name' => $request->name,
            'guard_name' => $request->guard_name,
            'description' => $request->description,
            'is_active' => $request->is_active ?? true,
        ]);

        return redirect()->route('authorization.roles.index')
            ->with('success', 'Role berhasil diperbarui.');
    }

    public function destroy($id)
    {
        Gate::authorize('role-delete');
        
        $role = Role::findOrFail($id);
        if ($role->name === 'Super Admin') {
            return back()->with('error', 'Role Super Admin tidak dapat dihapus.');
        }

        if ($role->users()->count() > 0) {
            return back()->with('error', 'Role tidak dapat dihapus karena masih digunakan oleh user.');
        }

        $role->delete();

        return redirect()->route('authorization.roles.index')
            ->with('success', 'Role berhasil dihapus.');
    }

    public function toggleStatus($id)
    {
        Gate::authorize('role-edit');
        
        $role = Role::findOrFail($id);
        if ($role->name === 'Super Admin') {
            return back()->with('error', 'Status role Super Admin tidak dapat diubah.');
        }

        $role->update([
            'is_active' => !$role->is_active,
        ]);

        return back()->with('success', 'Status role berhasil diperbarui.');
    }

    public function permissions($id)
    {
        Gate::authorize('role-list');
        
        $role = Role::findOrFail($id);
        $role->load('permissions');
        $permissions = Permission::get()->groupBy(function ($permission) {
            $parts = explode('-', $permission->name);
            return ucfirst($parts[0] ?? 'General');
        });

        return Inertia::render('backpanel/authorization/roles/permissions', [
            'role' => $role,
            'permissions' => $permissions,
        ]);
    }

    public function syncPermissions(Request $request, $id)
    {
        Gate::authorize('role-edit');
        
        $role = Role::findOrFail($id);
        $request->validate([
            'permissions' => 'array',
            'permissions.*' => 'exists:permissions,id',
        ]);

        $role->syncPermissions($request->permissions);

        return redirect()->route('authorization.roles.index')
            ->with('success', 'Permission role berhasil diperbarui.');
    }
}