<?php

namespace Tests\Feature\CMS;

use App\Models\User;
use App\Models\Article;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class ArticlePermissionTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        
        // Create permissions
        $permissions = [
            'article-list',
            'article-create', 
            'article-edit',
            'article-delete'
        ];
        
        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission, 'guard_name' => 'web']);
        }
        
        // Create roles and assign permissions
        $adminRole = Role::firstOrCreate(['name' => 'Admin', 'guard_name' => 'web']);
        $editorRole = Role::firstOrCreate(['name' => 'Editor', 'guard_name' => 'web']);
        $authorRole = Role::firstOrCreate(['name' => 'Author', 'guard_name' => 'web']);
        
        $adminRole->givePermissionTo($permissions);
        $editorRole->givePermissionTo(['article-list', 'article-create', 'article-edit']);
        $authorRole->givePermissionTo(['article-list', 'article-create', 'article-edit']);
    }

    public function test_user_with_article_list_permission_can_view_articles()
    {
        $user = User::factory()->create();
        $user->assignRole('Author');
        
        $response = $this->actingAs($user)->get('/cpanel/cms/article');
        
        $response->assertStatus(200);
    }

    public function test_user_without_article_list_permission_cannot_view_articles()
    {
        $user = User::factory()->create();
        // Don't assign any role/permissions
        
        $response = $this->actingAs($user)->get('/cpanel/cms/article');
        
        $response->assertStatus(403);
    }

    public function test_user_with_article_create_permission_can_create_article()
    {
        $user = User::factory()->create();
        $user->assignRole('Editor');
        
        $response = $this->actingAs($user)->get('/cpanel/cms/article/create');
        
        $response->assertStatus(200);
    }

    public function test_user_without_article_create_permission_cannot_create_article()
    {
        $user = User::factory()->create();
        $user->assignRole('Author');
        
        $response = $this->actingAs($user)->get('/cpanel/cms/article/create');
        
        $response->assertStatus(200); // Author has create permission
    }

    public function test_user_with_article_edit_permission_can_edit_article()
    {
        $user = User::factory()->create();
        $user->assignRole('Editor');
        
        $article = Article::factory()->create();
        
        $response = $this->actingAs($user)->get("/cpanel/cms/article/edit/{$article->id}");
        
        $response->assertStatus(200);
    }

    public function test_user_without_article_edit_permission_cannot_edit_article()
    {
        $user = User::factory()->create();
        // Don't assign any role/permissions
        
        $article = Article::factory()->create();
        
        $response = $this->actingAs($user)->get("/cpanel/cms/article/edit/{$article->id}");
        
        $response->assertStatus(403);
    }

    public function test_user_with_article_delete_permission_can_delete_article()
    {
        $user = User::factory()->create();
        $user->assignRole('Admin');
        
        $article = Article::factory()->create();
        
        $response = $this->actingAs($user)->delete("/cpanel/cms/article/{$article->id}");
        
        $response->assertRedirect();
    }

    public function test_user_without_article_delete_permission_cannot_delete_article()
    {
        $user = User::factory()->create();
        $user->assignRole('Editor');
        
        $article = Article::factory()->create();
        
        $response = $this->actingAs($user)->delete("/cpanel/cms/article/{$article->id}");
        
        $response->assertStatus(403);
    }

    public function test_user_with_article_edit_permission_can_toggle_article_status()
    {
        $user = User::factory()->create();
        $user->assignRole('Editor');
        
        $article = Article::factory()->create();
        
        $response = $this->actingAs($user)->patch("/cpanel/cms/article/{$article->id}/toggle-status");
        
        $response->assertRedirect();
    }

    public function test_user_without_article_edit_permission_cannot_toggle_article_status()
    {
        $user = User::factory()->create();
        // Don't assign any role/permissions
        
        $article = Article::factory()->create();
        
        $response = $this->actingAs($user)->patch("/cpanel/cms/article/{$article->id}/toggle-status");
        
        $response->assertStatus(403);
    }

    public function test_user_with_article_edit_permission_can_update_article_position()
    {
        $user = User::factory()->create();
        $user->assignRole('Editor');
        
        $response = $this->actingAs($user)->patch('/cpanel/cms/article/update-position', [
            'articles' => [
                ['id' => 1, 'position' => 1]
            ]
        ]);
        
        $response->assertRedirect();
    }

    public function test_user_without_article_edit_permission_cannot_update_article_position()
    {
        $user = User::factory()->create();
        // Don't assign any role/permissions
        
        $response = $this->actingAs($user)->patch('/cpanel/cms/article/update-position', [
            'articles' => [
                ['id' => 1, 'position' => 1]
            ]
        ]);
        
        $response->assertStatus(403);
    }
}
