import { useEffect, useMemo, useState, type ChangeEvent, type FormEvent } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiUpload, FiRefreshCw } from 'react-icons/fi';
import toast from 'react-hot-toast';
import AdminLayout from '../../components/admin/AdminLayout';
import { categoryService, productService, brandService, type CreateProductDTO, type UpdateProductDTO, type ProductVariantDTO } from '../../services';
import type { Category, Product, Brand } from '../../types';
import { handleApiError } from '../../utils/errorHandler';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { useCartStore } from '../../store/cartStore';
import { useWishlistStore } from '../../store/wishlistStore';
import { debouncedTranslate } from '../../utils/translateText';

interface ProductVariant {
  volume: string;
  price: string;
  originalPrice: string;
  isActive: boolean;
}

interface ProductFormState {
  name: string;
  brand: string;
  type: string;
  description: string;
  categoryId: string;
  isActive: boolean;
  isFeatured: boolean;
  images: File[];
  variants: ProductVariant[];
  nameEn: string;
  nameRu: string;
  typeEn: string;
  typeRu: string;
  descriptionEn: string;
  descriptionRu: string;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5034/api';
const MEDIA_BASE_URL = API_BASE_URL.replace(/\/?api\/?$/, '');
const PLACEHOLDER_IMAGE = 'https://via.placeholder.com/600x800?text=M%C9%99hsul';

const createInitialFormState = (): ProductFormState => ({
  name: '',
  brand: '',
  type: '',
  description: '',
  categoryId: '',
  isActive: true,
  isFeatured: false,
  images: [],
  variants: [{ volume: '', price: '', originalPrice: '', isActive: true }],
  nameEn: '',
  nameRu: '',
  typeEn: '',
  typeRu: '',
  descriptionEn: '',
  descriptionRu: '',
});

const resolveImageUrl = (url: string): string => {
  if (!url) return PLACEHOLDER_IMAGE;
  if (url.startsWith('http')) return url;
  const normalized = url.replace(/^\/+/, '');
  return `${MEDIA_BASE_URL}/${normalized}`;
};

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formState, setFormState] = useState<ProductFormState>(createInitialFormState);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [viewImage, setViewImage] = useState<string | null>(null);
  const [isTranslatingName, setIsTranslatingName] = useState(false);
  const [isTranslatingType, setIsTranslatingType] = useState(false);
  const [isTranslatingDesc, setIsTranslatingDesc] = useState(false);

  useEffect(() => {
    void fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [productsResponse, categoriesResponse, brandsResponse] = await Promise.all([
        productService.getAll({ includeInactive: true }),
        categoryService.getAll(),
        brandService.getAll(),
      ]);

      const normalizedCategories = categoriesResponse.map((category) => ({
        ...category,
        id: String(category.id),
      })) as Category[];

      setCategories(normalizedCategories);
      setBrands(brandsResponse);
      setProducts(productsResponse);
    } catch (error) {
      const message = handleApiError(error);
      toast.error(message);

      const { products: mockProducts, categories: mockCategories } = await import('../../data/mockData');
      setProducts(mockProducts);
      setCategories(mockCategories.map((category) => ({
        ...category,
        id: String(category.id),
      })) as Category[]);
    } finally {
      setIsLoading(false);
    }
  };

  const categoryMap = useMemo(() => {
    return categories.reduce<Record<string, string>>((acc, category) => {
      acc[String(category.id)] = category.name;
      return acc;
    }, {});
  }, [categories]);

  const productsWithMeta = useMemo(() => {
    return products.map((product) => {
      const rawImages = product.imageUrls && product.imageUrls.length > 0 ? product.imageUrls : product.images;
      const resolvedImages = (rawImages ?? []).map((img) => resolveImageUrl(img));
      const images = resolvedImages.length > 0 ? resolvedImages : [PLACEHOLDER_IMAGE];
      const categoryName = product.category || (product.categoryId ? categoryMap[product.categoryId] ?? '' : '');

      return {
        ...product,
        images,
        category: categoryName,
      } satisfies Product;
    });
  }, [products, categoryMap]);

  const filteredProducts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    const filtered = productsWithMeta.filter((product) => {
      const matchesSearch =
        !query ||
        product.name.toLowerCase().includes(query) ||
        (product.brand && product.brand.toLowerCase().includes(query));
      const matchesCategory =
        selectedCategory === 'all' || product.categoryId === selectedCategory;

      return matchesSearch && matchesCategory;
    });

    // Sort by updatedAt descending (newest first)
    return filtered.sort((a, b) => {
      const dateA = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
      const dateB = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
      return dateB - dateA;
    });
  }, [productsWithMeta, searchQuery, selectedCategory]);

  const resetForm = () => {
    imagePreviews.forEach((url) => URL.revokeObjectURL(url));
    setFormState(createInitialFormState());
    setImagePreviews([]);
    setExistingImages([]);
    setEditingProduct(null);
  };

  const handleOpenModal = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      
      // Create variants from product data
      const variants = product.variants && product.variants.length > 0
        ? product.variants.map(v => ({
            volume: v.volume || '',
            price: String(v.price || 0),
            originalPrice: v.originalPrice != null ? String(v.originalPrice) : '',
            isActive: v.isActive ?? true
          }))
        : product.price ? [{
            volume: product.volume ?? '',
            price: String(product.price),
            originalPrice: product.originalPrice != null ? String(product.originalPrice) : '',
            isActive: true
          }] : [{ volume: '', price: '', originalPrice: '', isActive: true }];
      
      setFormState({
        name: product.name ?? '',
        brand: product.brandId ? String(product.brandId) : (product.brand ?? ''),
        type: product.type ?? '',
        description: product.description ?? '',
        categoryId: product.categoryId ?? '',
        isActive: product.isActive ?? true,
        isFeatured: product.isFeatured ?? false,
        images: [],
        variants: variants,
        nameEn: product.translations?.en?.name ?? '',
        nameRu: product.translations?.ru?.name ?? '',
        typeEn: product.translations?.en?.type ?? '',
        typeRu: product.translations?.ru?.type ?? '',
        descriptionEn: product.translations?.en?.description ?? '',
        descriptionRu: product.translations?.ru?.description ?? '',
      });
      setExistingImages(product.images ?? []);
    } else {
      resetForm();
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    resetForm();
  };

  const handleInputChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target;
    setFormState((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Auto-translate specific fields
    if (name === 'name' && value.trim()) {
      setIsTranslatingName(true);
      debouncedTranslate(value, (result) => {
        setFormState(prev => ({
          ...prev,
          nameEn: result.en,
          nameRu: result.ru,
        }));
        setIsTranslatingName(false);
      });
    } else if (name === 'type' && value.trim()) {
      setIsTranslatingType(true);
      debouncedTranslate(value, (result) => {
        setFormState(prev => ({
          ...prev,
          typeEn: result.en,
          typeRu: result.ru,
        }));
        setIsTranslatingType(false);
      });
    } else if (name === 'description' && value.trim()) {
      setIsTranslatingDesc(true);
      debouncedTranslate(value, (result) => {
        setFormState(prev => ({
          ...prev,
          descriptionEn: result.en,
          descriptionRu: result.ru,
        }));
        setIsTranslatingDesc(false);
      });
    }
  };

  const handleCheckboxChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = event.target;
    setFormState((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const handleSelectChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = event.target;
    console.log(`Select changed - ${name}:`, value, typeof value);
    setFormState((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files ? Array.from(event.target.files) : [];
    imagePreviews.forEach((url) => URL.revokeObjectURL(url));
    const previews = files.map((file) => URL.createObjectURL(file));
    setFormState((prev) => ({ ...prev, images: files }));
    setImagePreviews(previews);
  };

  const handleAddVariant = () => {
    setFormState((prev) => ({
      ...prev,
      variants: [...prev.variants, { volume: '', price: '', originalPrice: '', isActive: true }],
    }));
  };

  const handleRemoveVariant = (index: number) => {
    setFormState((prev) => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== index),
    }));
  };

  const handleVariantChange = (index: number, field: keyof ProductVariant, value: string | boolean) => {
    setFormState((prev) => ({
      ...prev,
      variants: prev.variants.map((variant, i) =>
        i === index ? { ...variant, [field]: value } : variant
      ),
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Validation - Required fields
    if (!formState.name.trim()) {
      toast.error('Məhsul adı daxil edilməlidir');
      return;
    }

    if (!formState.brand) {
      toast.error('Brend seçilməlidir');
      return;
    }

    if (!formState.type.trim()) {
      toast.error('Ətir növü daxil edilməlidir');
      return;
    }

    if (!formState.description.trim()) {
      toast.error('Təsvir daxil edilməlidir');
      return;
    }

    if (!formState.variants || formState.variants.length === 0) {
      toast.error('Ən azı bir variant əlavə edilməlidir');
      return;
    }

    // Validate variants
    for (let i = 0; i < formState.variants.length; i++) {
      const variant = formState.variants[i];
      if (!variant.volume.trim()) {
        toast.error(`Variant ${i + 1}: Həcm daxil edilməlidir`);
        return;
      }
      if (!variant.price || parseFloat(variant.price) <= 0) {
        toast.error(`Variant ${i + 1}: Düzgün qiymət daxil edilməlidir`);
        return;
      }
    }

    if (!formState.categoryId) {
      toast.error('Kateqoriya seçilməlidir');
      return;
    }

    // Validation - Translation fields
    if (!formState.nameEn.trim()) {
      toast.error('İngilis dilində məhsul adı daxil edilməlidir');
      return;
    }

    if (!formState.nameRu.trim()) {
      toast.error('Rus dilində məhsul adı daxil edilməlidir');
      return;
    }

    if (!formState.typeEn.trim()) {
      toast.error('İngilis dilində ətir növü daxil edilməlidir');
      return;
    }

    if (!formState.typeRu.trim()) {
      toast.error('Rus dilində ətir növü daxil edilməlidir');
      return;
    }

    if (!formState.descriptionEn.trim()) {
      toast.error('İngilis dilində təsvir daxil edilməlidir');
      return;
    }

    if (!formState.descriptionRu.trim()) {
      toast.error('Rus dilində təsvir daxil edilməlidir');
      return;
    }

    // Validation - Images
    if (!editingProduct && formState.images.length === 0) {
      toast.error('Ən azı bir şəkil yükləməlisiniz');
      return;
    }

    const categoryIdNumber = Number(formState.categoryId);
    if (Number.isNaN(categoryIdNumber)) {
      toast.error('Kateqoriya məlumatı düzgün deyil');
      return;
    }

    const brandIdNumber = Number(formState.brand);
    console.log('=== BRAND DEBUG ===');
    console.log('formState.brand:', formState.brand, typeof formState.brand);
    console.log('brandIdNumber:', brandIdNumber);
    console.log('Available brands:', brands);
    console.log('==================');
    
    if (!brandIdNumber || Number.isNaN(brandIdNumber)) {
      toast.error('Brend düzgün seçilməyib');
      return;
    }

    // Convert variants to DTO format
    const variants = formState.variants.map(v => ({
      volume: v.volume.trim(),
      price: parseFloat(v.price),
      originalPrice: v.originalPrice ? parseFloat(v.originalPrice) : undefined,
      isActive: v.isActive
    }));

    const payloadBase: CreateProductDTO = {
      name: formState.name.trim(),
      brandId: brandIdNumber,
      type: formState.type.trim(),
      description: formState.description.trim(),
      categoryId: categoryIdNumber,
      isActive: formState.isActive,
      isFeatured: formState.isFeatured,
      images: formState.images.length ? formState.images : undefined,
      variants: variants,
      nameEn: formState.nameEn.trim(),
      nameRu: formState.nameRu.trim(),
      typeEn: formState.typeEn.trim(),
      typeRu: formState.typeRu.trim(),
      descriptionEn: formState.descriptionEn.trim(),
      descriptionRu: formState.descriptionRu.trim(),
    };

    setIsSaving(true);
    try {
      if (editingProduct) {
        const updatePayload: UpdateProductDTO = { ...payloadBase };
        if (!formState.images.length) {
          delete (updatePayload as { images?: File[] }).images;
        }

        const updatedProduct = await productService.update(editingProduct.id, updatePayload);
        setProducts((prev) =>
          prev.map((product) => (product.id === updatedProduct.id ? updatedProduct : product))
        );
        toast.success('Məhsul yeniləndi');
      } else {
        const createdProduct = await productService.create(payloadBase);
        setProducts((prev) => [createdProduct, ...prev]);
        toast.success('Yeni məhsul əlavə olundu');
      }

      handleCloseModal();
    } catch (error) {
      const message = handleApiError(error);
      toast.error(message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteRequest = (product: Product) => {
    setProductToDelete(product);
  };

  const handleCancelDelete = () => {
    if (isDeleting) {
      return;
    }
    setProductToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (!productToDelete) {
      return;
    }

    const targetId = productToDelete.id;
    setIsDeleting(true);
    try {
      await productService.delete(targetId);
      setProducts((prev) => prev.filter((product) => product.id !== targetId));
      
      // Remove from cart and wishlist across all users' local storage
      useCartStore.getState().removeByProductId(targetId);
      useWishlistStore.getState().removeByProductId(targetId);
      
      toast.success('Məhsul silindi');
    } catch (error) {
      const message = handleApiError(error);
      toast.error(message);
    } finally {
      setIsDeleting(false);
      setProductToDelete(null);
    }
  };

  return (
    <>
    <AdminLayout>
      <div className="p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Məhsullar</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Mövcud məhsulları idarə edin, stok və aktivlik statuslarını yeniləyin
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => void fetchData()}
              className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <FiRefreshCw className="h-4 w-4" />
              <span>Yenilə</span>
            </button>
            <button
              type="button"
              onClick={() => handleOpenModal()}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg shadow-sm transition-colors hover:bg-indigo-700"
            >
              <FiPlus className="h-4 w-4" />
              <span>Yeni Məhsul</span>
            </button>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-5 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Axtarış</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-3 flex items-center text-gray-400 dark:text-gray-500">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Məhsul adı və ya brend axtar..."
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900/10 dark:focus:ring-gray-100/10 focus:border-gray-900/30 dark:focus:border-gray-100/30 dark:text-white dark:placeholder-gray-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Kateqoriya</label>
              <select
                value={selectedCategory}
                onChange={(event) => setSelectedCategory(event.target.value)}
                className="w-full px-3 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900/10 dark:focus:ring-gray-100/10 focus:border-gray-900/30 dark:focus:border-gray-100/30 dark:text-white"
              >
                <option value="all">Bütün kateqoriyalar</option>
                {categories.map((category) => (
                  <option key={category.id} value={String(category.id)}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="h-12 w-12 border-4 border-gray-200 dark:border-gray-700 border-t-gray-900 dark:border-t-white rounded-full animate-spin" />
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="py-24 text-center">
              <p className="text-gray-500 dark:text-gray-400 text-lg">Göstəriləcək məhsul tapılmadı</p>
              <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">Axtarış kriteriyalarını dəyişin və ya yeni məhsul əlavə edin</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-100 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-900/50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Məhsul</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Kateqoriya</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Qiymət</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Əməliyyatlar</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700 bg-white dark:bg-gray-800">
                  {filteredProducts.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50/60 dark:hover:bg-gray-700/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 cursor-pointer hover:ring-2 hover:ring-primary-500 transition-all">
                            <img
                              src={product.images[0]}
                              alt={product.name}
                              className="w-full h-full object-cover"
                              onClick={() => setViewImage(product.images[0])}
                            />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-900 dark:text-white">{product.name}</p>
                            {product.brand && (
                              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{product.brand}</p>
                            )}
                            <p className="text-xs text-gray-400 dark:text-gray-500 line-clamp-2 mt-1 max-w-xs">
                              {product.description}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{product.category || '—'}</td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1">
                          {product.volume && product.price ? (
                            <>
                              <span className="text-xs text-gray-500 dark:text-gray-400">{product.volume}</span>
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-semibold text-gray-900 dark:text-white">{product.price.toFixed(2)} ₼</span>
                                {product.originalPrice && (
                                  <span className="text-xs text-gray-400 dark:text-gray-500 line-through">
                                    {product.originalPrice.toFixed(2)} ₼
                                  </span>
                                )}
                              </div>
                            </>
                          ) : (
                            <span className="text-sm text-gray-400 dark:text-gray-500">—</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1">
                          <span
                            className={`inline-flex w-fit items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                              product.isActive ?? true
                                ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400'
                                : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                            }`}
                          >
                            {(product.isActive ?? true) ? 'Aktiv' : 'Passiv'}
                          </span>
                          {product.isFeatured && (
                            <span className="inline-flex w-fit items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400">
                              Seçilmiş
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleOpenModal(product)}
                            className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                          >
                            <FiEdit2 />
                          </button>
                          <button
                            onClick={() => handleDeleteRequest(product)}
                            disabled={isDeleting && productToDelete?.id === product.id}
                            className="p-2 text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <FiTrash2 />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {isModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
          onClick={handleCloseModal}
        >
          <div 
            className="relative w-full max-w-4xl overflow-hidden rounded-2xl bg-white dark:bg-gray-800 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-700 px-6 py-4">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {editingProduct ? 'Məhsulu redaktə et' : 'Yeni məhsul əlavə et'}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Məhsul məlumatlarını doldurun və şəkilləri yükləyin
                </p>
              </div>
              <button
                onClick={handleCloseModal}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <FiX size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="max-h-[80vh] overflow-y-auto px-6 py-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Məhsul adı *</label>
                  <input
                    type="text"
                    name="name"
                    value={formState.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900/10 dark:focus:ring-gray-100/10"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Brend *</label>
                  <select
                    name="brand"
                    value={formState.brand}
                    onChange={handleSelectChange}
                    required
                    className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900/10 dark:focus:ring-gray-100/10"
                  >
                    <option value="">Brend seçin</option>
                    {brands.map((brand) => (
                      <option key={brand.id} value={brand.id}>
                        {brand.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Variants Section */}
                <div className="col-span-2">
                  <div className="flex items-center justify-between mb-3">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Variantlar (Həcm və Qiymətlər) *</label>
                    <button
                      type="button"
                      onClick={handleAddVariant}
                      className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-primary-600 bg-primary-50 dark:bg-primary-900/20 dark:text-primary-400 rounded-lg hover:bg-primary-100 dark:hover:bg-primary-900/30 transition-colors"
                    >
                      <FiPlus className="w-4 h-4" />
                      Variant əlavə et
                    </button>
                  </div>
                  
                  <div className="space-y-3">
                    {formState.variants.map((variant, index) => (
                      <div key={index} className="flex gap-3 items-start p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                        <div className="flex-1 grid grid-cols-3 gap-3">
                          <div>
                            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Həcm</label>
                            <input
                              type="text"
                              value={variant.volume}
                              onChange={(e) => handleVariantChange(index, 'volume', e.target.value)}
                              placeholder="50ml"
                              className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Qiymət (₼)</label>
                            <input
                              type="number"
                              value={variant.price}
                              onChange={(e) => handleVariantChange(index, 'price', e.target.value)}
                              placeholder="100"
                              min="0"
                              step="0.01"
                              className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Əvvəlki qiymət (₼)</label>
                            <input
                              type="number"
                              value={variant.originalPrice}
                              onChange={(e) => handleVariantChange(index, 'originalPrice', e.target.value)}
                              placeholder="150"
                              min="0"
                              step="0.01"
                              className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                            />
                          </div>
                        </div>
                        {formState.variants.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveVariant(index)}
                            className="mt-6 p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                            title="Sil"
                          >
                            <FiTrash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Ətir növü *</label>
                  <input
                    type="text"
                    name="type"
                    value={formState.type}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900/10 dark:focus:ring-gray-100/10"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Kateqoriya *</label>
                  <select
                    name="categoryId"
                    value={formState.categoryId}
                    onChange={handleSelectChange}
                    required
                    className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900/10 dark:focus:ring-gray-100/10"
                  >
                    <option value="">Kateqoriya seçin</option>
                    {categories.map((category) => (
                      <option key={category.id} value={String(category.id)}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Təsvir *</label>
                <textarea
                  name="description"
                  value={formState.description}
                  onChange={handleInputChange}
                  rows={4}
                  required
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900/10 dark:focus:ring-gray-100/10"
                />
              </div>

              {/* Translations Section */}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-semibold text-gray-900 dark:text-white">Tərcümələr</h3>
                  {(isTranslatingName || isTranslatingType || isTranslatingDesc) && (
                    <span className="flex items-center gap-2 text-xs text-indigo-600 dark:text-indigo-400">
                      <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Tərcümə olunur...
                    </span>
                  )}
                </div>
                
                {/* English Translation */}
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">🇬🇧 English</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Product Name</label>
                      <div className="relative">
                        <input
                          type="text"
                          name="nameEn"
                          value={formState.nameEn}
                          onChange={handleInputChange}
                          disabled={isTranslatingName}
                          placeholder="Auto-translated"
                          className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900/10 dark:focus:ring-gray-100/10 disabled:opacity-50"
                        />
                        {isTranslatingName && (
                          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                            <svg className="h-4 w-4 animate-spin text-indigo-500" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                          </div>
                        )}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Perfume Type</label>
                      <div className="relative">
                        <input
                          type="text"
                          name="typeEn"
                          value={formState.typeEn}
                          onChange={handleInputChange}
                          disabled={isTranslatingType}
                          placeholder="Auto-translated"
                          className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900/10 dark:focus:ring-gray-100/10 disabled:opacity-50"
                        />
                        {isTranslatingType && (
                          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                            <svg className="h-4 w-4 animate-spin text-indigo-500" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="mt-3">
                    <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Description</label>
                    <div className="relative">
                      <textarea
                        name="descriptionEn"
                        value={formState.descriptionEn}
                        onChange={handleInputChange}
                        disabled={isTranslatingDesc}
                        placeholder="Auto-translated"
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900/10 dark:focus:ring-gray-100/10 disabled:opacity-50"
                      />
                      {isTranslatingDesc && (
                        <div className="pointer-events-none absolute top-3 right-3">
                          <svg className="h-4 w-4 animate-spin text-indigo-500" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Russian Translation */}
                <div>
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">🇷🇺 Русский</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Название продукта</label>
                      <div className="relative">
                        <input
                          type="text"
                          name="nameRu"
                          value={formState.nameRu}
                          onChange={handleInputChange}
                          disabled={isTranslatingName}
                          placeholder="Автоматический перевод"
                          className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900/10 dark:focus:ring-gray-100/10 disabled:opacity-50"
                        />
                        {isTranslatingName && (
                          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                            <svg className="h-4 w-4 animate-spin text-indigo-500" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                          </div>
                        )}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Тип аромата</label>
                      <div className="relative">
                        <input
                          type="text"
                          name="typeRu"
                          value={formState.typeRu}
                          onChange={handleInputChange}
                          disabled={isTranslatingType}
                          placeholder="Автоматический перевод"
                          className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900/10 dark:focus:ring-gray-100/10 disabled:opacity-50"
                        />
                        {isTranslatingType && (
                          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                            <svg className="h-4 w-4 animate-spin text-indigo-500" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="mt-3">
                    <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Описание</label>
                    <div className="relative">
                      <textarea
                        name="descriptionRu"
                        value={formState.descriptionRu}
                        onChange={handleInputChange}
                        disabled={isTranslatingDesc}
                        placeholder="Автоматический перевод"
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900/10 dark:focus:ring-gray-100/10 disabled:opacity-50"
                      />
                      {isTranslatingDesc && (
                        <div className="pointer-events-none absolute top-3 right-3">
                          <svg className="h-4 w-4 animate-spin text-indigo-500" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formState.isActive}
                    onChange={handleCheckboxChange}
                    className="h-4 w-4 rounded border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:ring-gray-900/20 dark:focus:ring-gray-100/20 dark:bg-gray-900"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Məhsul aktiv olsun</span>
                </label>
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    name="isFeatured"
                    checked={formState.isFeatured}
                    onChange={handleCheckboxChange}
                    className="h-4 w-4 rounded border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:ring-gray-900/20 dark:focus:ring-gray-100/20 dark:bg-gray-900"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Seçilmiş məhsullar siyahısına əlavə et</span>
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Şəkillər</label>
                <div className="flex flex-col gap-3">
                  <label className="flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 py-6 cursor-pointer hover:border-gray-300 dark:hover:border-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                    <FiUpload className="text-gray-500 dark:text-gray-400" size={20} />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {formState.images.length > 0
                        ? `${formState.images.length} fayl seçildi`
                        : 'Şəkilləri bura sürüklə və ya seç'}
                    </span>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>

                  {existingImages.length > 0 && (
                    <div>
                      <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">Mövcud şəkillər</p>
                      <div className="flex flex-wrap gap-3">
                        {existingImages.map((image, index) => (
                          <img
                            key={`${image}-${index}`}
                            src={image}
                            alt={`Mövcud şəkil ${index + 1}`}
                            className="h-20 w-20 rounded-lg object-cover border border-gray-200 dark:border-gray-600 cursor-pointer hover:ring-2 hover:ring-primary-500 transition-all"
                            onClick={() => setViewImage(image)}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {imagePreviews.length > 0 && (
                    <div>
                      <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">Yüklənəcək şəkillər</p>
                      <div className="flex flex-wrap gap-3">
                        {imagePreviews.map((preview, index) => (
                          <img
                            key={`${preview}-${index}`}
                            src={preview}
                            alt={`Yeni şəkil ${index + 1}`}
                            className="h-20 w-20 rounded-lg object-cover border border-gray-200 dark:border-gray-600 cursor-pointer hover:ring-2 hover:ring-primary-500 transition-all"
                            onClick={() => setViewImage(preview)}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-col-reverse md:flex-row md:justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-5 py-2 rounded-lg border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  disabled={isSaving}
                >
                  Ləğv et
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2 rounded-lg bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors disabled:opacity-50"
                >
                  {isSaving ? 'Yüklənir...' : editingProduct ? 'Yenilə' : 'Yarat'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Image Preview Modal */}
      {viewImage && (
        <div 
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 px-4"
          onClick={() => setViewImage(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setViewImage(null)}
              className="absolute -top-12 right-0 p-2 text-white hover:text-gray-300 transition-colors"
            >
              <FiX size={32} />
            </button>
            <img
              src={viewImage}
              alt="Böyük görüntü"
              className="max-w-full max-h-[90vh] rounded-xl object-contain"
            />
          </div>
        </div>
      )}
    </AdminLayout>

    <ConfirmDialog
      open={Boolean(productToDelete)}
      title="Məhsulu silmək istədiyinizdən əminsiniz?"
      description={productToDelete ? `"${productToDelete.name}" məhsulu silinəcək. Bu əməliyyat geri qaytarılmır.` : undefined}
      confirmLabel="Bəli, sil"
      cancelLabel="Ləğv et"
      isLoading={isDeleting}
      onCancel={handleCancelDelete}
      onConfirm={handleConfirmDelete}
    />
    </>
  );
}
