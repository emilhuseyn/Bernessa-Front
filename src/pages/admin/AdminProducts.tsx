import { useEffect, useMemo, useState, type ChangeEvent, type FormEvent } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiUpload, FiRefreshCw } from 'react-icons/fi';
import toast from 'react-hot-toast';
import AdminLayout from '../../components/admin/AdminLayout';
import { categoryService, productService, type CreateProductDTO, type UpdateProductDTO } from '../../services';
import type { Category, Product } from '../../types';
import { handleApiError } from '../../utils/errorHandler';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { useCartStore } from '../../store/cartStore';
import { useWishlistStore } from '../../store/wishlistStore';

interface ProductFormState {
  name: string;
  brand: string;
  price: string;
  originalPrice: string;
  volume: string;
  type: string;
  description: string;
  categoryId: string;
  stock: string;
  isActive: boolean;
  isFeatured: boolean;
  images: File[];
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5034/api';
const MEDIA_BASE_URL = API_BASE_URL.replace(/\/?api\/?$/, '');
const PLACEHOLDER_IMAGE = 'https://via.placeholder.com/600x800?text=M%C9%99hsul';

const createInitialFormState = (): ProductFormState => ({
  name: '',
  brand: '',
  price: '',
  originalPrice: '',
  volume: '',
  type: '',
  description: '',
  categoryId: '',
  stock: '0',
  isActive: true,
  isFeatured: false,
  images: [],
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

  useEffect(() => {
    void fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [productsResponse, categoriesResponse] = await Promise.all([
        productService.getAll({ includeInactive: true }),
        categoryService.getAll(),
      ]);

      const normalizedCategories = categoriesResponse.map((category) => ({
        ...category,
        id: String(category.id),
      })) as Category[];

      setCategories(normalizedCategories);
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
      const stockValue = product.stock != null ? product.stock : product.inStock ? 1 : 0;

      return {
        ...product,
        images,
        category: categoryName,
        inStock: stockValue > 0,
        stock: product.stock ?? stockValue,
      } satisfies Product;
    });
  }, [products, categoryMap]);

  const filteredProducts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return productsWithMeta.filter((product) => {
      const matchesSearch =
        !query ||
        product.name.toLowerCase().includes(query) ||
        (product.brand && product.brand.toLowerCase().includes(query));
      const matchesCategory =
        selectedCategory === 'all' || product.categoryId === selectedCategory;

      return matchesSearch && matchesCategory;
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
      setFormState({
        name: product.name ?? '',
        brand: product.brand ?? '',
        price: product.price != null ? String(product.price) : '',
        originalPrice: product.originalPrice != null ? String(product.originalPrice) : '',
        volume: product.volume ?? '',
        type: product.type ?? '',
        description: product.description ?? '',
        categoryId: product.categoryId ?? '',
        stock: product.stock != null ? String(product.stock) : product.inStock ? '1' : '0',
        isActive: product.isActive ?? true,
        isFeatured: product.isFeatured ?? false,
        images: [],
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

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!formState.name.trim() || !formState.brand.trim()) {
      toast.error('Məhsul adı və brend daxil edilməlidir');
      return;
    }

    const price = Number(formState.price);
    if (Number.isNaN(price) || price <= 0) {
      toast.error('Etibarlı qiymət daxil edin');
      return;
    }

    if (!formState.categoryId) {
      toast.error('Kateqoriya seçilməlidir');
      return;
    }

    const stock = formState.stock ? Number(formState.stock) : 0;
    if (Number.isNaN(stock) || stock < 0) {
      toast.error('Stok miqdarı yanlış göstərilib');
      return;
    }

    const categoryIdNumber = Number(formState.categoryId);
    if (Number.isNaN(categoryIdNumber)) {
      toast.error('Kateqoriya məlumatı düzgün deyil');
      return;
    }

    const payloadBase: CreateProductDTO = {
      name: formState.name.trim(),
      brand: formState.brand.trim(),
      price,
      originalPrice: formState.originalPrice ? Number(formState.originalPrice) : undefined,
      volume: formState.volume.trim(),
      type: formState.type.trim(),
      description: formState.description.trim(),
      categoryId: categoryIdNumber,
      stock,
      isActive: formState.isActive,
      isFeatured: formState.isFeatured,
      images: formState.images.length ? formState.images : undefined,
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
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Stok</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Əməliyyatlar</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700 bg-white dark:bg-gray-800">
                  {filteredProducts.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50/60 dark:hover:bg-gray-700/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600">
                            <img
                              src={product.images[0]}
                              alt={product.name}
                              className="w-full h-full object-cover"
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
                        <div className="flex flex-col">
                          <span className="text-sm font-semibold text-gray-900 dark:text-white">{product.price.toFixed(2)} ₼</span>
                          {product.originalPrice && (
                            <span className="text-xs text-gray-400 dark:text-gray-500 line-through">
                              {product.originalPrice.toFixed(2)} ₼
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${
                            product.inStock
                              ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/30'
                              : 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border-red-100 dark:border-red-900/30'
                          }`}
                        >
                          {product.stock ?? 0} ədəd
                        </span>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="relative w-full max-w-4xl overflow-hidden rounded-2xl bg-white dark:bg-gray-800 shadow-2xl">
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
                  <input
                    type="text"
                    name="brand"
                    value={formState.brand}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900/10 dark:focus:ring-gray-100/10"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Qiymət (₼) *</label>
                  <input
                    type="number"
                    name="price"
                    value={formState.price}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                    required
                    className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900/10 dark:focus:ring-gray-100/10"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Əvvəlki qiymət (₼)</label>
                  <input
                    type="number"
                    name="originalPrice"
                    value={formState.originalPrice}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                    className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900/10 dark:focus:ring-gray-100/10"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Həcm *</label>
                  <input
                    type="text"
                    name="volume"
                    value={formState.volume}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900/10 dark:focus:ring-gray-100/10"
                  />
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
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Stok *</label>
                  <input
                    type="number"
                    name="stock"
                    value={formState.stock}
                    onChange={handleInputChange}
                    min="0"
                    required
                    className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900/10 dark:focus:ring-gray-100/10"
                  />
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
                            className="h-20 w-20 rounded-lg object-cover border border-gray-200 dark:border-gray-600"
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
                            className="h-20 w-20 rounded-lg object-cover border border-gray-200 dark:border-gray-600"
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
