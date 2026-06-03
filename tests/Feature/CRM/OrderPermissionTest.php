<?php

namespace Tests\Feature\CRM;

use App\Models\User;
use App\Models\Order;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class OrderPermissionTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        
        // Create permissions
        $permissions = [
            'order-list',
            'order-create', 
            'order-edit',
            'order-delete'
        ];
        
        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission, 'guard_name' => 'web']);
        }
        
        // Create roles and assign permissions
        $adminRole = Role::firstOrCreate(['name' => 'Admin', 'guard_name' => 'web']);
        $managerRole = Role::firstOrCreate(['name' => 'Manager', 'guard_name' => 'web']);
        $staffRole = Role::firstOrCreate(['name' => 'Staff', 'guard_name' => 'web']);
        
        $adminRole->givePermissionTo($permissions);
        $managerRole->givePermissionTo(['order-list', 'order-create', 'order-edit']);
        $staffRole->givePermissionTo(['order-list']);
    }

    public function test_user_with_order_list_permission_can_view_orders()
    {
        $user = User::factory()->create();
        $user->assignRole('Staff');
        
        $response = $this->actingAs($user)->get('/cpanel/crm/orders');
        
        $response->assertStatus(200);
    }

    public function test_user_without_order_list_permission_cannot_view_orders()
    {
        $user = User::factory()->create();
        // Don't assign any role/permissions
        
        $response = $this->actingAs($user)->get('/cpanel/crm/orders');
        
        $response->assertStatus(403);
    }

    public function test_user_with_order_create_permission_can_create_order()
    {
        $user = User::factory()->create();
        $user->assignRole('Manager');
        
        $response = $this->actingAs($user)->get('/cpanel/crm/orders/create');
        
        $response->assertStatus(200);
    }

    public function test_user_without_order_create_permission_cannot_create_order()
    {
        $user = User::factory()->create();
        $user->assignRole('Staff');
        
        $response = $this->actingAs($user)->get('/cpanel/crm/orders/create');
        
        $response->assertStatus(403);
    }

    public function test_user_with_order_edit_permission_can_edit_order()
    {
        $user = User::factory()->create();
        $user->assignRole('Manager');
        
        $order = Order::factory()->create();
        
        $response = $this->actingAs($user)->get("/cpanel/crm/orders/edit/{$order->id}");
        
        $response->assertStatus(200);
    }

    public function test_user_without_order_edit_permission_cannot_edit_order()
    {
        $user = User::factory()->create();
        $user->assignRole('Staff');
        
        $order = Order::factory()->create();
        
        $response = $this->actingAs($user)->get("/cpanel/crm/orders/edit/{$order->id}");
        
        $response->assertStatus(403);
    }

    public function test_user_with_order_delete_permission_can_delete_order()
    {
        $user = User::factory()->create();
        $user->assignRole('Admin');
        
        $order = Order::factory()->create();
        
        $response = $this->actingAs($user)->delete("/cpanel/crm/orders/{$order->id}");
        
        $response->assertRedirect();
    }

    public function test_user_without_order_delete_permission_cannot_delete_order()
    {
        $user = User::factory()->create();
        $user->assignRole('Manager');
        
        $order = Order::factory()->create();
        
        $response = $this->actingAs($user)->delete("/cpanel/crm/orders/{$order->id}");
        
        $response->assertStatus(403);
    }
}
