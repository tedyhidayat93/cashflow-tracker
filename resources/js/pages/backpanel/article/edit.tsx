import React, { useState, useEffect } from 'react';
import { Head, Link, useForm, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import HeaderTitle from '@/components/header-title';
import FlashMessage from '@/components/flash-message';
import { type BreadcrumbItem } from '@/types';
import { ArrowLeft, Save, FileText, Upload, Tag as TagIcon, Calendar, Loader } from 'lucide-react';
import TinyMCEEditor from '@/components/TinyMCEEditor';
import TreeSelect from '@/components/tree-select';

interface Author {
  id: number;
  name: string;
}

interface Article {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  featured_image?: string;
  status: string;
  published_at?: string;
  author_id: number;
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string;
  views_count: number;
  tags?: string[];
  position?: number;
  is_headline?: boolean;
  category_id?: number;
  category?: string;
  author?: {
    id: number;
    name: string;
  };
  created_at: string;
  updated_at: string;
}

interface Props {
  article: Article;
  authors: Author[];
  blogCategories: Array<{ id: number; name: string; slug: string; type: string; is_active: boolean; }>;
}

export default function ArticleEdit({ article, authors, blogCategories }: Props) {
  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'CMS',
      href: '/cpanel/cms',
    },
    {
      title: 'Artikel',
      href: '/cpanel/cms/article',
    },
    {
      title: 'Edit',
      href: `/cpanel/cms/article/edit/${article.id}`,
    },
  ];

  const [tags, setTags] = useState<string[]>(Array.isArray(article.tags) ? article.tags : []);
  const [tagInput, setTagInput] = useState('');
  const [removeFeaturedImage, setRemoveFeaturedImage] = useState(false);
  const [featuredImagePreview, setFeaturedImagePreview] = useState<string | null>(
    article.featured_image ? `/storage/${article.featured_image}` : null
  );
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);

  const { data, setData, post, processing, transform, errors, reset } = useForm({
    title: article.title,
    slug: article.slug,
    content: article.content,
    excerpt: article.excerpt || '',
    featured_image: null as File | null,
    status: article.status,
    published_at: article.published_at ? new Date(article.published_at).toISOString().slice(0, 16) : '',
    author_id: article.author_id.toString(),
    meta_title: article.meta_title || '',
    meta_description: article.meta_description || '',
    meta_keywords: article.meta_keywords || '',
    tags: Array.isArray(article.tags) ? article.tags : [],
    is_headline: article.is_headline || false,
    category_id: article.category_id || (blogCategories.length > 0 ? blogCategories[0].id.toString() : ''),
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    if (type === 'number') {
      setData(name as keyof typeof data, parseInt(value) || 0);
    } else if (type === 'checkbox') {
      const checkbox = e.target as HTMLInputElement;
      setData(name as keyof typeof data, checkbox.checked);
    } else {
      setData(name as keyof typeof data, value);
    }
    
    // Auto-generate slug from title only if slug hasn't been manually edited
    if (name === 'title' && !slugManuallyEdited) {
      const slugValue = value
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '') // Remove special characters except spaces and hyphens
        .replace(/\s+/g, '-') // Replace spaces with hyphens
        .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
        .trim(); // Remove leading/trailing spaces and hyphens
      setData('slug', slugValue);
    }
  };

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setData('slug', value);
    setSlugManuallyEdited(true); // Mark as manually edited when user types in slug field
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setData('featured_image', file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFeaturedImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      const newTags = [...tags, tagInput.trim()];
      setTags(newTags);
      setData('tags', newTags);
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    const newTags = tags.filter(tag => tag !== tagToRemove);
    setTags(newTags);
    setData('tags', newTags);
  };

  const handleSubmit = (
    e: React.FormEvent
  ) => {

    e.preventDefault();

    transform((data) => ({
      ...data,
      _method: 'PUT',
      tags,

      remove_featured_image:
        removeFeaturedImage,
    }));

    post(
      `/cpanel/cms/article/${article.id}`,
      {
        forceFormData: true,
      }
    );
  };
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Edit Artikel" />
      {/* <FlashMessage /> */}
      
      <div className="space-y-6 p-6">
        <div className="flex items-center space-x-4">
          <Link href="/cpanel/cms/article">
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Kembali ke Artikel
            </Button>
          </Link>
          <div>
            <p className="text-muted-foreground">Perbarui informasi artikel di bawah ini</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Detail Artikel</CardTitle>
            <CardDescription>
              Ubah informasi untuk "{article.title}".
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Judul Artikel *</Label>
                  <Input
                    id="title"
                    name="title"
                    value={data.title}
                    onChange={handleInputChange}
                    placeholder="Judul artikel"
                    required
                  />
                  {errors.title && <p className="text-sm text-red-600">{errors.title}</p>}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="slug">Slug</Label>
                  <Input
                    id="slug"
                    name="slug"
                    type="text"
                    value={data.slug}
                    onChange={handleSlugChange}
                    placeholder="URL-friendly slug (opsional)"
                  />
                  {errors.slug && <p className="text-sm text-red-600">{errors.slug}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="excerpt">Ringkasan</Label>
                <Textarea
                  id="excerpt"
                  name="excerpt"
                  value={data.excerpt}
                  onChange={handleInputChange}
                  placeholder="Ringkasan artikel (maks 500 karakter)"
                  rows={2}
                  maxLength={500}
                />
                {errors.excerpt && <p className="text-sm text-red-600">{errors.excerpt}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Konten *</Label>
                <TinyMCEEditor
                  value={data.content}
                  onChange={(content) => setData('content', content)}
                  height={500}
                />
                {errors.content && <p className="text-sm text-red-600">{errors.content}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="featured_image">Gambar Utama</Label>
                  <Input
                    id="featured_image"
                    name="featured_image"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                  {errors.featured_image && <p className="text-sm text-red-600">{errors.featured_image}</p>}
                  {featuredImagePreview && (
                    <div className="mt-2">
                      <img
                        src={featuredImagePreview}
                        alt="Preview"
                        className="h-32 w-auto rounded-lg object-cover"
                      />
                      {article.featured_image && (
                        <div className="mt-2">
                          <label className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              checked={removeFeaturedImage}
                              onChange={(e) => setRemoveFeaturedImage(e.target.checked)}
                              className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                            />
                            <span className="text-sm text-gray-700">Hapus gambar ini</span>
                          </label>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="published_at">Tanggal Terbit</Label>
                  <Input
                    id="published_at"
                    name="published_at"
                    type="datetime-local"
                    value={data.published_at}
                    onChange={handleInputChange}
                  />
                  {errors.published_at && <p className="text-sm text-red-600">{errors.published_at}</p>}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="status">Status *</Label>
                  <Select value={data.status} onValueChange={(value) => {
                    setData('status', value);
                  }}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="published">Diterbitkan</SelectItem>
                      <SelectItem value="archived">Diarsipkan</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.status && <p className="text-sm text-red-600">{errors.status}</p>}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="author_id">Penulis *</Label>
                  <Select value={data.author_id} onValueChange={(value) => {
                    setData('author_id', value);
                  }}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih penulis" />
                    </SelectTrigger>
                    <SelectContent>
                      {authors.map((author) => (
                        <SelectItem key={author.id} value={author.id.toString()}>
                          {author.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.author_id && <p className="text-sm text-red-600">{errors.author_id}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category_id">Kategori *</Label>
                  <TreeSelect
                    data={blogCategories}
                    value={data.category_id?.toString()}
                    onChange={(val) => setData('category_id', val ?? '')}
                  />
                  {errors.category_id && <p className="text-sm text-red-600">{errors.category_id}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="is_headline"
                    name="is_headline"
                    checked={data.is_headline}
                    onChange={(e) => {
                      setData('is_headline', e.target.checked);
                    }}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <Label htmlFor="is_headline" className="text-sm font-medium">
                    Jadikan sebagai Headline
                  </Label>
                </div>
                {errors.is_headline && <p className="text-sm text-red-600">{errors.is_headline}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="meta_title">Meta Title</Label>
                <Input
                  id="meta_title"
                  name="meta_title"
                  value={data.meta_title}
                  onChange={handleInputChange}
                  placeholder="SEO meta title"
                />
                {errors.meta_title && <p className="text-sm text-red-600">{errors.meta_title}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="meta_description">Meta Description</Label>
                <Textarea
                  id="meta_description"
                  name="meta_description"
                  value={data.meta_description}
                  onChange={handleInputChange}
                  placeholder="SEO meta description"
                  rows={2}
                />
                {errors.meta_description && <p className="text-sm text-red-600">{errors.meta_description}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="meta_keywords">Meta Keywords</Label>
                <Input
                  id="meta_keywords"
                  name="meta_keywords"
                  value={data.meta_keywords}
                  onChange={handleInputChange}
                  placeholder="SEO meta keywords (pisahkan dengan koma)"
                />
                {errors.meta_keywords && <p className="text-sm text-red-600">{errors.meta_keywords}</p>}
              </div>

              <div className="space-y-2">
                <Label>Tags</Label>
                <div className="flex items-center space-x-2 mb-2">
                  <Input
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    placeholder="Tambah tag..."
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addTag();
                      }
                    }}
                    className="flex-1"
                  />
                  <Button type="button" onClick={addTag}>
                    Tambah
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag, index) => (
                    <div key={index} className="inline-flex items-center space-x-1 bg-gray-100 text-gray-800 px-2 py-1 rounded-md text-sm">
                      <TagIcon className="h-3 w-3" />
                      <span>{tag}</span>
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="ml-1 text-xs text-red-500 hover:text-red-700"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  {tags.length === 0 && (
                    <div className="text-xs text-gray-400">
                      Belum ada tag yang ditambahkan
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Link href="/cpanel/cms/article">
                  <Button type="button" variant="outline">
                    Batal
                  </Button>
                </Link>
                <Button type="submit" disabled={processing}>
                  {processing ? (
                    <Loader className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="mr-2 h-4 w-4" />
                  )}
                  {processing ? 'Memperbarui...' : 'Perbarui Artikel'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
