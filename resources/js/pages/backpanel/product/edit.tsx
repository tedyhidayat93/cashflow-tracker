import React, { useState } from 'react';
import { Head, Link, useForm, router, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import HeaderTitle from '@/components/header-title';
import { type BreadcrumbItem } from '@/types';
import { formatPrice, parseCurrencyInput, formatCurrencyInput } from '@/utils/currency';
import { ArrowLeft, Save, Upload, X, Image as ImageIcon, Package, Tag as TagIcon, Plus, Trash2, ChevronDown, FormInput, Loader } from 'lucide-react';
import TreeSelect from '@/components/tree-select';
import { flattenCategories } from '@/lib/utils';
import { getContainerSpecs, type ContainerSpec } from '@/utils/product';
import { Category } from '../category/create';
import TinyMCEEditor from '@/components/TinyMCEEditor';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface Brand {
  id: number;
  name: string;
}

interface ProductImage {
  id: number;
  product_id: number;
  image_path: string;
  is_cover: boolean;
  position: number;
  created_at: string;
  updated_at: string;
}

interface Product {
  id: number;
  name: string;
  slug: string;
  type: 'physical' | 'digital';
  description?: string;
  short_description?: string;
  sku?: string;
  price: number;
  compare_at_price?: number;
  cost_per_item?: number;
  track_quantity: boolean;
  quantity?: number;
  barcode?: string;
  status: 'draft' | 'published';
  is_featured: boolean;
  is_bestseller: boolean;
  is_new: boolean;
  is_for_sell: boolean;
  is_rent: boolean;
  show_price: boolean;
  show_stock: boolean;
  published_at?: string;
  position?: number;
  brand_id?: number;
  category_id?: number;
  meta_title?: string;
  meta_description?: string;
  tags: string[];
  created_at: string;
  updated_at: string;
  images: ProductImage[];
  specific_specs?: Array<{ label: string; value: string; note: string }>;
}

interface Props {
  product: Product;
  brands: Brand[];
  categories: Category[];
}

export default function ProductEdit({ product, brands, categories }: Props) {
  const [isTemplateDropdownOpen, setIsTemplateDropdownOpen] = useState(false);
  
  const [imagePreviews, setImagePreviews] = useState<Array<{ file: File; preview: string }>>([]);
  const [removeImages, setRemoveImages] = useState<number[]>([]);
  const [tags, setTags] = useState<string[]>(product.tags);
  const [tagInput, setTagInput] = useState('');
  const [imageErrors, setImageErrors] = useState<string[]>([]);
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);

  // Calculate active images (existing images that haven't been removed)
  const activeImages = product.images.filter(img => !removeImages.includes(img.id));

  // State for formatted currency display
  const [formattedPrice, setFormattedPrice] = useState(
    product.price !== null && product.price !== undefined
      ? formatCurrencyInput(product.price.toString())
      : '0'
  );

  const [formattedComparePrice, setFormattedComparePrice] = useState(
    product.compare_at_price !== null && product.compare_at_price !== undefined
      ? formatCurrencyInput(product.compare_at_price.toString())
      : ''
  );

  // Calculate initial cover image index from active images (excluding removed ones)
  const getInitialCoverIndex = () => {
    const activeImages = product.images.filter(img => !removeImages.includes(img.id));
    const coverImage = activeImages.find(img => img.is_cover);
    return coverImage ? activeImages.indexOf(coverImage) : 0;
  };

  // Get the actual cover image ID for form submission
  const getInitialCoverImageId = () => {
    const coverImage = product.images.find(img => img.is_cover);
    return coverImage ? coverImage.id : null;
  };

  const [coverImageIndex, setCoverImageIndex] = useState<number>(getInitialCoverIndex());

  const { data, setData, post, processing, transform, errors, reset } = useForm<{
    name: string;
    slug: string;
    type: 'physical' | 'digital';
    description: string;
    short_description: string;
    sku: string;
    price: string;
    compare_at_price: string;
    cost_per_item: string;
    track_quantity: boolean;
    quantity: string;
    barcode: string;
    status: 'draft' | 'published';
    is_featured: boolean;
    is_bestseller: boolean;
    is_new: boolean;
    is_for_sell: boolean;
    is_rent: boolean;
    show_price: boolean;
    show_stock: boolean;
    // position: number;
    brand_id: string | null;
    category_id: string | null;
    meta_title: string;
    meta_description: string;
    tags: string[];
    images: File[];
    cover_image: string | number | null;
    remove_images: number[];
    specific_specs: any[];
  }>({
    name: product.name,
    slug: product.slug,
    type: product.type,
    description: product.description || '',
    short_description: product.short_description || '',
    sku: product.sku || '',
    price: product.price.toString(),
    compare_at_price: product.compare_at_price?.toString() || '',
    cost_per_item: product.cost_per_item?.toString() || '',
    track_quantity: product.track_quantity,
    quantity: product.quantity?.toString() || '',
    barcode: product.barcode || '',
    status: product.status,
    is_featured: product.is_featured,
    is_bestseller: product.is_bestseller,
    is_new: product.is_new,
    is_for_sell: product.is_for_sell,
    is_rent: product.is_rent,
    show_price: product.show_price,
    show_stock: product.show_stock,
    // position: product.position || 0,
    brand_id: product.brand_id?.toString() || null,
    category_id: product.category_id?.toString() || null,
    meta_title: product.meta_title || '',
    meta_description: product.meta_description || '',
    tags: product.tags,
    images: [] as File[],
    cover_image: getInitialCoverImageId(),
    remove_images: [] as number[],
    specific_specs: product.specific_specs || [],
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Handle specific_specs array fields
    if (name.startsWith('specific_specs[')) {
      const match = name.match(/specific_specs\[(\d+)\]\[(.+)\]/);
      if (match) {
        const index = parseInt(match[1]);
        const field = match[2];
        const newSpecs = [...data.specific_specs];
        
        // Ensure the index exists
        while (newSpecs.length <= index) {
          newSpecs.push({ label: '', value: '', note: '' });
        }
        
        newSpecs[index] = {
          ...newSpecs[index],
          [field]: value
        };
        
        setData('specific_specs', newSpecs);
        return;
      }
    }
    
    setData(name as keyof typeof data, value);
    
    // Auto-generate slug from name only if slug hasn't been manually edited
    if (name === 'name' && !slugManuallyEdited) {
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

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCurrencyInput(e.target.value);
    setFormattedPrice(formatted);
    const rawValue = parseCurrencyInput(formatted);
    setData('price', rawValue.toString());
  };

  const handleComparePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCurrencyInput(e.target.value);
    setFormattedComparePrice(formatted);
    const rawValue = parseCurrencyInput(formatted);
    setData('compare_at_price', rawValue.toString());
  };

  const handleCostChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatCurrencyInput(e.target.value);
    const rawValue = parseCurrencyInput(formattedValue);
    setData('cost_per_item', rawValue.toString());
    e.target.value = formattedValue;
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      const errors: string[] = [];
      
      // Clear previous errors
      setImageErrors([]);
      
      // Validate file count
      const totalImages = activeImages.length + imagePreviews.length + newFiles.length;
      if (totalImages > 10) {
        errors.push('Maksimal 10 gambar yang diperbolehkan');
        setImageErrors(errors);
        e.target.value = '';
      }
      
      // Validate each file
      const validFiles: File[] = [];
      const validPreviews: { file: File; preview: string }[] = [];
      
      for (const file of newFiles) {
        // Validate file extension
        const validExtensions = ['jpg', 'jpeg', 'png', 'gif'];
        const fileExtension = file.name.split('.').pop()?.toLowerCase();
        
        if (!fileExtension || !validExtensions.includes(fileExtension)) {
          errors.push(`File "${file.name}" tidak valid. Hanya file JPG, JPEG, PNG, dan GIF yang diperbolehkan`);
          continue;
        }
        
        // Validate file size (5MB = 5 * 1024 * 1024 bytes)
        const maxSize = 5 * 1024 * 1024;
        if (file.size > maxSize) {
          errors.push(`File "${file.name}" terlalu besar. Maksimal ukuran file adalah 5MB`);
          continue;
        }
        
        validFiles.push(file);
        validPreviews.push({
          file,
          preview: URL.createObjectURL(file)
        });
      }
      
      // Set errors if any
      if (errors.length > 0) {
        setImageErrors(errors);
      }
      
      if (validFiles.length > 0) {
        const newImages = [...data.images, ...validFiles];
        const newPreviews = [...imagePreviews, ...validPreviews];
        
        setData('images', newImages);
        setImagePreviews(newPreviews);
        
        // Auto-set first new image as cover if no cover is set
        if (coverImageIndex === null || coverImageIndex === undefined || coverImageIndex === -1) {
          const firstNewImageIndex = activeImages.length; // Index of the first newly uploaded image
          setCoverImageIndex(firstNewImageIndex);
          setData('cover_image', `new_${firstNewImageIndex - activeImages.length}`);
        }
      }
      
      // Clear input if no valid files
      if (validFiles.length === 0) {
        e.target.value = '';
      }
    }
  };

  const handleRemoveNewImage = (index: number) => {
    const newImages = data.images.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    
    setData('images', newImages);
    setImagePreviews(newPreviews);
    
    // Adjust cover image index if needed
    if (coverImageIndex >= product.images.length + newImages.length) {
      setCoverImageIndex(Math.max(0, product.images.length + newImages.length - 1));
      setData('cover_image', Math.max(0, product.images.length + newImages.length - 1));
    }
  };

  const handleRemoveExistingImage = (imageId: number) => {
    const newRemoveImages = [...removeImages, imageId];
    setRemoveImages(newRemoveImages);
    setData('remove_images', newRemoveImages);
    
    // Adjust cover image if the removed image was the cover
    const removedImage = product.images.find(img => img.id === imageId);
    if (removedImage && removedImage.is_cover) {
      // Find a new cover image from remaining active images
      const newCoverImage = product.images.find((img) => 
        img.id !== imageId && !newRemoveImages.includes(img.id)
      );
      const newCoverImageId = newCoverImage ? newCoverImage.id : null;
      
      // Update UI index
      const newCoverIndex = newCoverImage ? 
        product.images.filter(img => !newRemoveImages.includes(img.id)).indexOf(newCoverImage) : 0;
      setCoverImageIndex(newCoverIndex);
      setData('cover_image', newCoverImageId);
    }
  };

  const handleSetCoverImage = (index: number) => {
    setCoverImageIndex(index);
    // If this is a new image (index >= activeImages.length), send the relative index with new_ prefix
    if (index >= activeImages.length) {
      const newImageIndex = index - activeImages.length;
      setData('cover_image', `new_${newImageIndex}` as string | number);
    } else {
      // This shouldn't happen for new images, but handle it gracefully
      setData('cover_image', index);
    }
  };

  const handleSetExistingCoverImage = (imageId: number) => {
    // Find the actual index in the filtered activeImages array
    const actualIndex = activeImages.findIndex(img => img.id === imageId);
    console.log('Setting cover image:', { imageId, actualIndex, totalActiveImages: activeImages.length });
    
    if (actualIndex !== -1) {
      setCoverImageIndex(actualIndex);
      setData('cover_image', imageId); // Send image ID, not index
      console.log('Cover image set to image ID:', imageId);
    } else {
      console.log('Image not found in active images:', imageId);
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

  const addSpecRow = () => {
    const newSpec = { label: '', value: '', note: '' };
    setData('specific_specs', [...data.specific_specs, newSpec]);
  };

  const addTemplateSpecs = (templateType: string) => {
    const presetSpecs = getContainerSpecs(templateType);
    setData('specific_specs', [...data.specific_specs, ...presetSpecs]);
    setIsTemplateDropdownOpen(false);
  };

  const removeSpecRow = (index: number) => {
    const newSpecs = data.specific_specs.filter((_, i) => i !== index);
    setData('specific_specs', newSpecs);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    transform((data) => ({
      ...data,
      _method: 'PUT',
      // boolean → string
      track_quantity: data.track_quantity ? '1' : '0',
      is_featured: data.is_featured ? '1' : '0',
      is_bestseller: data.is_bestseller ? '1' : '0',
      is_new: data.is_new ? '1' : '0',
      is_for_sell: data.is_for_sell ? '1' : '0',
      is_rent: data.is_rent ? '1' : '0',
      show_price: data.show_price ? '1' : '0',
      show_stock: data.show_stock ? '1' : '0',

      // null handling
      cover_image: data.cover_image ?? '',

      // optional string fields
      compare_at_price: data.compare_at_price || '',
      cost_per_item: data.cost_per_item || '',
      quantity: data.quantity || '',
      barcode: data.barcode || '',
    }));

    post(`/cpanel/cms/product/${product.id}`, {
      forceFormData: true,
      onSuccess: () => {
        setImagePreviews([]);
        setRemoveImages([]);
        reset();
      },
    });
  };

  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'CMS',
      href: '/cpanel/cms',
    },
    {
      title: 'Produk',
      href: '/cpanel/cms/product',
    },
    {
      title: product.name,
      href: `/cpanel/cms/product/${product.id}`,
    },
    {
      title: 'Ubah',
      href: `/cpanel/cms/product/edit/${product.id}`,
    },
  ];

  const totalImages = activeImages.length + imagePreviews.length;

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={`Ubah Produk: ${product.name}`} />
      
      <div className="space-y-6 p-6">
        <HeaderTitle
          title="Ubah Produk"
          description={`Ubah produk: ${product.name}`}
        />

        <Card className='pt-0 overflow-hidden'>
          <CardHeader className='bg-slate-900 py-5 text-inverse'>
            <CardTitle className='text-xl text-white pb-0'>Form Produk</CardTitle>
            <CardDescription className='pt-0 text-slate-200'>
              Ubah informasi produk di bawah
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Nama Produk <span className="text-red-400">*</span></Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    value={data.name}
                    onChange={handleInputChange}
                    placeholder="Masukkan nama produk"
                    required
                  />
                  {errors.name && <p className="text-sm text-red-600">{errors.name}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sku">SKU</Label>
                  <Input
                    id="sku"
                    name="sku"
                    type="text"
                    value={data.sku}
                    onChange={handleInputChange}
                    placeholder="SKU produk"
                  />
                  {errors.sku && <p className="text-sm text-red-600">{errors.sku}</p>}
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

                <div className="space-y-2">
                  <Label htmlFor="type">Tipe Produk <span className="text-red-400">*</span></Label>
                  <Select value={data.type} onValueChange={(value) => setData('type', value as 'physical' | 'digital')}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih tipe" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="physical">Fisik</SelectItem>
                      <SelectItem value="digital">Digital</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.type && <p className="text-sm text-red-600">{errors.type}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="brand_id">Merek</Label>
                  <Select value={data.brand_id || undefined} onValueChange={(value) => setData('brand_id', value || null)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih merek" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Tidak ada merek</SelectItem>
                      {brands.map((brand) => (
                        <SelectItem key={brand.id} value={brand.id.toString()}>
                          {brand.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.brand_id && <p className="text-sm text-red-600">{errors.brand_id}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category_id">Kategori</Label>
                  <TreeSelect
                    data={categories}
                    value={data.category_id}
                    onChange={(val) => setData('category_id', val)}
                  />
                  {errors.category_id && <p className="text-sm text-red-600">{errors.category_id}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="price">Harga <span className="text-red-400">*</span></Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">Rp</span>
                    <Input
                      id="price"
                      name="price"
                      type="text"
                      value={formattedPrice}
                      onChange={handlePriceChange}
                      placeholder="0"
                      className="pl-10"
                      maxLength={15}
                      required
                    />
                  </div>
                  {errors.price && <p className="text-sm text-red-600">{errors.price}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="compare_at_price">Harga Coret </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">Rp</span>
                    <Input
                      id="compare_at_price"
                      name="compare_at_price"
                      type="text"
                      value={formattedComparePrice}
                      onChange={handleComparePriceChange}
                      placeholder="0"
                      className="pl-10"
                      maxLength={15}
                    />
                  </div>
                  {errors.compare_at_price && <p className="text-sm text-red-600">{errors.compare_at_price}</p>}
                </div>


                <div className="space-y-2">
                  <Label htmlFor="quantity">Stok</Label>
                  <Input
                    id="quantity"
                    name="quantity"
                    type="number"
                    min="0"
                    value={data.quantity}
                    onChange={handleInputChange}
                    placeholder="0"
                  />
                  {errors.quantity && <p className="text-sm text-red-600">{errors.quantity}</p>}
                </div>

                {/* <div className="space-y-2">
                  <Label htmlFor="position">Posisi</Label>
                  <Input
                    id="position"
                    name="position"
                    type="number"
                    min="0"
                    value={data.position}
                    onChange={handleInputChange}
                    placeholder="0"
                  />
                  {errors.position && <p className="text-sm text-red-600">{errors.position}</p>}
                </div> */}
              </div>

              <div className="space-y-2">
                <Label htmlFor="short_description">Deskripsi Singkat</Label>
                <Input
                  id="short_description"
                  name="short_description"
                  type="text"
                  value={data.short_description}
                  onChange={handleInputChange}
                  placeholder="Deskripsi singkat produk"
                  maxLength={500}
                />
                {errors.short_description && <p className="text-sm text-red-600">{errors.short_description}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Deskripsi</Label>
                <TinyMCEEditor
                  value={data.description}
                  onChange={(content) => setData('description', content)}
                  height={300}
                />
                {errors.description && <p className="text-sm text-red-600">{errors.description}</p>}
              </div>

              {/* Specific Specifications */}
              <div className="p-4 space-y-4 bg-slate-100/80 border rounded-lg">

                {/* HEADER */}
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">
                      Spesifikasi Detail
                    </h3>
                    <p className="text-xs text-slate-400">
                      Tambahkan detail spesifikasi produk
                    </p>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addSpecRow}
                      className="shadow-sm bg-lime-300"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Tambah Baris
                    </Button>
                    
                    <div className="relative">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setIsTemplateDropdownOpen(!isTemplateDropdownOpen)}
                        className="shadow-sm"
                      >
                        <FormInput className="mr-2 h-4 w-4" />
                        Template
                        <ChevronDown className="ml-2 h-4 w-4" />
                      </Button>
                      
                      {isTemplateDropdownOpen && (
                        <div className="absolute right-0 mt-1 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                          <div className="py-1">
                            <button
                              type="button"
                              onClick={() => addTemplateSpecs('standar-container')}
                              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              Standar Container
                            </button>
                            <button
                              type="button"
                              onClick={() => addTemplateSpecs('reefer')}
                              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              Reefer Container
                            </button>
                            <button
                              type="button"
                              onClick={() => addTemplateSpecs('open-top')}
                              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              Open Top Container
                            </button>
                            <button
                              type="button"
                              onClick={() => addTemplateSpecs('flat-rack')}
                              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              Flat Rack Container
                            </button>
                            <button
                              type="button"
                              onClick={() => addTemplateSpecs('tank-container')}
                              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              Tank Container
                            </button>
                            <button
                              type="button"
                              onClick={() => addTemplateSpecs('custom-container')}
                              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              Custom Container
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* LIST */}
                <div className="space-y-3">

                  {data.specific_specs && data.specific_specs.map((spec: { label: string; value: string; note: string }, index: number) => (

                    <div
                      key={index}
                      className="border rounded-xl px-4 py-2 bg-white transition hover:shadow-sm"
                    >

                      {/* TOP BAR */}
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs text-slate-400 font-medium">
                          Spesifikasi #{index + 1}
                        </span>

                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeSpecRow(index)}
                          className="text-red-500 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      {/* FORM */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">

                        {/* LABEL */}
                        <div className="space-y-2">
                          <Label htmlFor={`spec_label_${index}`}>Label</Label>
                          <Input
                            id={`spec_label_${index}`}
                            name={`specific_specs[${index}][label]`}
                            value={spec.label || ''}
                            onChange={handleInputChange}
                            placeholder="Masukkan data spek..."
                            className="focus-visible:ring-primary"
                          />
                        </div>

                        {/* VALUE */}
                        <div className="space-y-2">
                          <Label htmlFor={`spec_value_${index}`}>Nilai</Label>
                          <Input
                            id={`spec_value_${index}`}
                            name={`specific_specs[${index}][value]`}
                            value={spec.value || ''}
                            onChange={handleInputChange}
                            placeholder="Masukkan data spek..."
                            className="focus-visible:ring-primary"
                          />
                        </div>

                        {/* NOTE */}
                        <div className="space-y-2">
                          <Label htmlFor={`spec_note_${index}`}>Catatan</Label>
                          <Textarea
                            id={`spec_note_${index}`}
                            name={`specific_specs[${index}][note]`}
                            value={spec.note || ''}
                            onChange={handleInputChange}
                            placeholder="Opsional"
                            rows={2}
                            className="resize-none focus-visible:ring-primary"
                          />
                        </div>

                      </div>

                    </div>

                  ))}

                </div>
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
                </div>
                {errors.tags && <p className="text-sm text-red-600">{errors.tags}</p>}
              </div>

              <div className="space-y-3">

                {/* LABEL */}
                <div className="flex items-center justify-between">
                  <Label htmlFor="images" className="text-sm font-semibold text-slate-800">
                    Gambar Produk
                  </Label>
                  <span className="text-xs text-slate-400">
                    Maksimal 10 gambar
                  </span>
                </div>

                {/* UPLOAD AREA */}
                <div className="border-2 border-dashed border-slate-300 rounded-xl p-5 bg-slate-50/50 hover:border-blue-400 transition">

                  {totalImages === 0 ? (
                    <div className="flex flex-col items-center justify-center text-center space-y-3 py-6">
                      <ImageIcon className="h-10 w-10 text-slate-400" />

                      <div>
                        <label
                          htmlFor="images-hidden"
                          className="cursor-pointer text-sm font-semibold text-blue-600 hover:text-blue-500"
                        >
                          Upload gambar
                        </label>
                        <p className="text-xs text-slate-400">
                          atau drag & drop
                        </p>
                      </div>

                      <p className="text-xs text-slate-400">
                        PNG, JPG, GIF, SVG (max 2MB)
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">

                      {/* GRID IMAGE */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">

                        {/* EXISTING */}
                        {activeImages.map((image, index) => (
                          <div key={image.id} className="relative group">

                            <img
                              src={`/storage/${image.image_path}`}
                              alt={`Image ${index + 1}`}
                              className="w-full aspect-square object-cover rounded-lg border border-slate-200"
                            />

                            {/* DELETE */}
                            <button
                              type="button"
                              onClick={() => handleRemoveExistingImage(image.id)}
                              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                            >
                              <X className="h-3 w-3" />
                            </button>

                            {/* COVER */}
                            <button
                              type="button"
                              onClick={() => handleSetExistingCoverImage(image.id)}
                              className={`absolute bottom-2 left-2 text-[10px] px-2 py-1 rounded font-medium
                                ${coverImageIndex === index
                                  ? 'bg-blue-500 text-white'
                                  : 'bg-black/70 text-white hover:bg-black'}
                              `}
                            >
                              {coverImageIndex === index ? 'Cover' : 'Set'}
                            </button>

                          </div>
                        ))}

                        {/* NEW */}
                        {imagePreviews.map((image, index) => (
                          <div key={`new-${index}`} className="relative group">

                            <img
                              src={image.preview}
                              alt={`New ${index + 1}`}
                              className="w-full aspect-square object-cover rounded-lg border border-blue-200"
                            />

                            {/* DELETE */}
                            <button
                              type="button"
                              onClick={() => handleRemoveNewImage(index)}
                              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                            >
                              <X className="h-3 w-3" />
                            </button>

                            {/* COVER */}
                            <button
                              type="button"
                              onClick={() => handleSetCoverImage(activeImages.length + index)}
                              className={`absolute bottom-2 left-2 text-[10px] px-2 py-1 rounded font-medium
                                ${coverImageIndex === activeImages.length + index
                                  ? 'bg-blue-500 text-white'
                                  : 'bg-black/70 text-white hover:bg-black'}
                              `}
                            >
                              {coverImageIndex === activeImages.length + index ? 'Cover' : 'Set'}
                            </button>

                          </div>
                        ))}

                        {/* ADD BUTTON */}
                        {totalImages < 10 && (
                          <label
                            htmlFor="images-hidden"
                            className="flex items-center justify-center aspect-square border-2 border-dashed border-slate-300 rounded-lg cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition text-sm text-slate-500"
                          >
                            + Tambah
                          </label>
                        )}

                      </div>

                    </div>
                  )}

                </div>

                {/* INPUT */}
                <input
                  id="images-hidden"
                  name="images"
                  type="file"
                  multiple
                  accept="image/*"
                  className="sr-only"
                  onChange={handleImageChange}
                />

                {/* ERROR */}
                {errors.images && (
                  <p className="text-sm text-red-600">{errors.images}</p>
                )}

                {imageErrors.length > 0 && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg space-y-1">
                    {imageErrors.map((error, index) => (
                      <p key={index} className="text-xs text-red-600">
                        ⚠️ {error}
                      </p>
                    ))}
                  </div>
                )}

              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="barcode">Barcode</Label>
                  <Input
                    id="barcode"
                    name="barcode"
                    type="text"
                    value={data.barcode}
                    onChange={handleInputChange}
                    placeholder="Barcode produk"
                  />
                  {errors.barcode && <p className="text-sm text-red-600">{errors.barcode}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status <span className="text-red-400">*</span></Label>
                  <Select value={data.status} onValueChange={(value) => setData('status', value as 'draft' | 'published')}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="published">Diterbitkan</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.status && <p className="text-sm text-red-600">{errors.status}</p>}
                </div>
              </div>

              <div className="grid border-y py-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">

                {/* Unggulan */}
                <label
                  htmlFor="is_featured"
                  className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition
                    ${data.is_featured ? 'bg-blue-50 border-blue-300' : 'bg-white border-slate-200 hover:bg-slate-50'}
                  `}
                >
                  <Checkbox
                    id="is_featured"
                    checked={data.is_featured}
                    onCheckedChange={(checked) => setData('is_featured', Boolean(checked))}
                  />
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="cursor-help text-sm font-medium text-slate-700">
                          Tampil paling atas
                        </span>
                      </TooltipTrigger>

                      <TooltipContent side="top" className='bg-orange-100 border border-orange-300'>
                        <p className="max-w-[220px] text-xs leading-relaxed">
                          Produk akan diprioritaskan tampil di halaman utama
                          dan muncul paling atas pada katalog produk dan juga akan tampil pada card produk yang direkomendasikan.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </label>

                {/* Terlaris */}
                <label
                  htmlFor="is_bestseller"
                  className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition
                    ${data.is_bestseller ? 'bg-blue-50 border-blue-300' : 'bg-white border-slate-200 hover:bg-slate-50'}
                  `}
                >
                  <Checkbox
                    id="is_bestseller"
                    checked={data.is_bestseller}
                    onCheckedChange={(checked) => setData('is_bestseller', Boolean(checked))}
                  />
                  {/* Bestseller */}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="cursor-help text-sm font-medium text-slate-700">
                        Terlaris
                      </span>
                    </TooltipTrigger>

                    <TooltipContent
                      side="top"
                      className="max-w-[240px] border border-amber-200 bg-amber-50 text-slate-700"
                    >
                      <p className="text-xs leading-relaxed">
                        Memberikan label produk terlaris untuk meningkatkan
                        kepercayaan juga daya tarik pelanggan dan akan tampil pada card produk yang direkomendasikan.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </label>

                {/* Show Price */}
                <label
                  htmlFor="show_price"
                  className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition
                    ${data.show_price ? 'bg-purple-50 border-purple-300' : 'bg-white border-slate-200 hover:bg-slate-50'}
                  `}
                >
                  <Checkbox
                    id="show_price"
                    checked={data.show_price}
                    onCheckedChange={(checked) => setData('show_price', Boolean(checked))}
                  />
                  {/* Show Price */}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="cursor-help text-sm font-medium text-slate-700">
                        Tampilkan Harga
                      </span>
                    </TooltipTrigger>

                    <TooltipContent
                      side="top"
                      className="max-w-[240px] border border-purple-200 bg-purple-50 text-slate-700"
                    >
                      <p className="text-xs leading-relaxed">
                        Menampilkan harga produk secara langsung pada katalog
                        dan halaman detail produk.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </label>

                {/* Show Stock */}
                <label
                  htmlFor="show_stock"
                  className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition
                    ${data.show_stock ? 'bg-purple-50 border-purple-300' : 'bg-white border-slate-200 hover:bg-slate-50'}
                  `}
                >
                  <Checkbox
                    id="show_stock"
                    checked={data.show_stock}
                    onCheckedChange={(checked) => setData('show_stock', Boolean(checked))}
                  />
                  {/* Show Stock */}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="cursor-help text-sm font-medium text-slate-700">
                        Tampilkan Stok
                      </span>
                    </TooltipTrigger>

                    <TooltipContent
                      side="top"
                      className="max-w-[240px] border border-purple-200 bg-purple-50 text-slate-700"
                    >
                      <p className="text-xs leading-relaxed">
                        Menampilkan informasi jumlah stok produk yang tersedia
                        kepada pelanggan.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </label>

                {/* Baru */}
                <label
                  htmlFor="is_new"
                  className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition
                    ${data.is_new ? 'bg-blue-50 border-blue-300' : 'bg-white border-slate-200 hover:bg-slate-50'}
                  `}
                >
                  <Checkbox
                    id="is_new"
                    checked={data.is_new}
                    onCheckedChange={(checked) => setData('is_new', Boolean(checked))}
                  />
                  {/* Produk Baru */}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="cursor-help text-sm font-medium text-slate-700">
                        Produk Baru
                      </span>
                    </TooltipTrigger>

                    <TooltipContent
                      side="top"
                      className="max-w-[240px] border border-blue-200 bg-blue-50 text-slate-700"
                    >
                      <p className="text-xs leading-relaxed">
                        Memberikan badge produk baru agar lebih mudah menarik
                        perhatian pengunjung.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </label>

                {/* Dijual */}
                <label
                  htmlFor="is_for_sell"
                  className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition
                    ${data.is_for_sell ? 'bg-emerald-50 border-emerald-300' : 'bg-white border-slate-200 hover:bg-slate-50'}
                  `}
                >
                  <Checkbox
                    id="is_for_sell"
                    checked={data.is_for_sell}
                    onCheckedChange={(checked) => setData('is_for_sell', Boolean(checked))}
                  />
                  {/* Dijual */}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="cursor-help text-sm font-medium text-slate-700">
                        Dijual
                      </span>
                    </TooltipTrigger>

                    <TooltipContent
                      side="top"
                      className="max-w-[240px] border border-emerald-200 bg-emerald-50 text-slate-700"
                    >
                      <p className="text-xs leading-relaxed">
                        Produk tersedia untuk pembelian langsung oleh pelanggan.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </label>

                {/* Disewakan */}
                <label
                  htmlFor="is_rent"
                  className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition
                    ${data.is_rent ? 'bg-emerald-50 border-emerald-300' : 'bg-white border-slate-200 hover:bg-slate-50'}
                  `}
                >
                  <Checkbox
                    id="is_rent"
                    checked={data.is_rent}
                    onCheckedChange={(checked) => setData('is_rent', Boolean(checked))}
                  />
                  {/* Disewakan */}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="cursor-help text-sm font-medium text-slate-700">
                        Disewakan
                      </span>
                    </TooltipTrigger>

                    <TooltipContent
                      side="top"
                      className="max-w-[240px] border border-emerald-200 bg-emerald-50 text-slate-700"
                    >
                      <p className="text-xs leading-relaxed">
                        Produk tersedia untuk kebutuhan sewa dengan durasi
                        tertentu sesuai kebutuhan pelanggan.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </label>


              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="meta_title">Meta Title</Label>
                  <Input
                    id="meta_title"
                    name="meta_title"
                    type="text"
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
                    rows={3}
                  />
                  {errors.meta_description && <p className="text-sm text-red-600">{errors.meta_description}</p>}
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Link href={`/cpanel/cms/product`}>
                  <Button variant="outline">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Batal
                  </Button>
                </Link>
                <Button type="submit" disabled={processing}>

                  {processing ? (
                    <Loader className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="mr-2 h-4 w-4" />
                  )}
                  {processing ? 'Menyimpan...' : 'Simpan'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
