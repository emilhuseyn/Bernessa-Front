import { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { categoryService, type UpdateCategoryDTO } from '../../services';
import type { Category } from '../../types';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiEye } from 'react-icons/fi';
import { handleApiError } from '../../utils/errorHandler';
import toast from 'react-hot-toast';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';

export default function AdminCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    image: null as File | null,
  });
  const [imagePreview, setImagePreview] = useState<string>('');
  const [viewCategory, setViewCategory] = useState<Category | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      const data = await categoryService.getAll();
      setCategories(data);
    } catch (error) {
      const errorMessage = handleApiError(error);
      toast.error(errorMessage);
      // Load mock data if API fails
      const { categories: mockCategories } = await import('../../data/mockData');
      setCategories(mockCategories);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenModal = (category?: Category) => {
    if (category) {
      setEditingCategory(category);
      setFormData({
        name: category.name,
        slug: category.slug,
        image: null,
      });
      setImagePreview(category.imageUrl || '');
    } else {
      setEditingCategory(null);
      setFormData({
        name: '',
        slug: '',
        image: null,
      });
      setImagePreview('');
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
    setFormData({
      name: '',
      slug: '',
      image: null,
    });
    setImagePreview('');
  };

  const handleOpenView = (category: Category) => {
    setViewCategory(category);
  };

  const handleCloseView = () => {
    setViewCategory(null);
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/ə/g, 'e')
      .replace(/ı/g, 'i')
      .replace(/ü/g, 'u')
      .replace(/ö/g, 'o')
      .replace(/ğ/g, 'g')
      .replace(/ş/g, 's')
      .replace(/ç/g, 'c')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5034/api';
  const mediaBaseUrl = apiBaseUrl.replace(/\/?api\/?$/, '');

  const sanitizeMediaPath = (value: string) =>
    value.replace(/\\/g, '/').replace(/\/{2,}/g, '/').replace(/^\/+/, '');

  const resolveImageSrc = (category: Category) => {
    const placeholder = 'https://via.placeholder.com/160x160?text=Kateqoriya';
    const rawPath = category.imageUrl || category.image;

    if (!rawPath) {
      return placeholder;
    }

    if (rawPath.startsWith('http')) {
      return rawPath;
    }

    const normalizedPath = sanitizeMediaPath(rawPath);
    if (!normalizedPath) {
      return placeholder;
    }

    return `${mediaBaseUrl}/${normalizedPath}`;
  };

  const handleCategoryImageError = (event: React.SyntheticEvent<HTMLImageElement>) => {
    const target = event.currentTarget;
    if (target.dataset.fallbackApplied) {
      return;
    }
    target.dataset.fallbackApplied = 'true';
    target.src = 'https://via.placeholder.com/160x160?text=Kateqoriya';
  };

  const handleNameChange = (name: string) => {
    setFormData({
      ...formData,
      name,
      slug: generateSlug(name),
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, image: file });
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingCategory) {
        // Update
        const updateData: UpdateCategoryDTO = {
          name: formData.name,
          slug: formData.slug,
          image: formData.image || undefined,
        };
        const updated = await categoryService.update(editingCategory.id, updateData);
        setCategories(categories.map(c => c.id === editingCategory.id ? updated : c));
        toast.success('Kateqoriya yeniləndi');
      } else {
        // Create
        const createData = {
          name: formData.name,
          slug: formData.slug,
          image: formData.image || undefined,
        };
        const created = await categoryService.create(createData);
        setCategories([...categories, created]);
        toast.success('Kateqoriya yaradıldı');
      }
      handleCloseModal();
    } catch (error) {
      const errorMessage = handleApiError(error);
      toast.error(errorMessage);
    }
  };

  const handleDeleteRequest = (category: Category) => {
    setCategoryToDelete(category);
  };

  const handleCancelDelete = () => {
    if (isDeleting) {
      return;
    }
    setCategoryToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (!categoryToDelete) {
      return;
    }

    const targetId = categoryToDelete.id;
    setIsDeleting(true);
    try {
      await categoryService.delete(targetId);
      setCategories((prev) => prev.filter((category) => category.id !== targetId));
      toast.success('Kateqoriya silindi');
    } catch (error) {
      const errorMessage = handleApiError(error);
      toast.error(errorMessage);
    } finally {
      setIsDeleting(false);
      setCategoryToDelete(null);
    }
  };

  return (
    <>
      <AdminLayout>
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Kateqoriyalar</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">Məhsul kateqoriyalarını idarə edin</p>
            </div>
            <button
              onClick={() => handleOpenModal()}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <FiPlus />
              Yeni Kateqoriya
            </button>
          </div>

          {isLoading ? (
            <div className="flex h-64 items-center justify-center">
              <div className="h-12 w-12 rounded-full border-b-2 border-indigo-600 animate-spin" />
            </div>
          ) : categories.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-gray-600 dark:text-gray-400">Heç bir kateqoriya tapılmadı</p>
            </div>
          ) : (
            <>
              <div className="hidden md:block">
                <div className="overflow-x-auto rounded-lg border border-gray-100 bg-white shadow dark:border-gray-700 dark:bg-gray-800">
                  <table className="min-w-[720px] w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-900">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Şəkil</th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Ad</th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Slug</th>
                        <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Əməliyyatlar</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
                      {categories.map((category) => (
                        <tr key={category.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                          <td className="px-6 py-4">
                            <img
                              src={resolveImageSrc(category)}
                              alt={category.name}
                              className="h-12 w-12 rounded-lg object-cover"
                              onError={handleCategoryImageError}
                            />
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm font-medium text-gray-900 dark:text-white">{category.name}</span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm text-gray-600 dark:text-gray-400">{category.slug}</span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-3">
                              <button
                                onClick={() => handleOpenView(category)}
                                className="text-blue-600 transition-colors hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                                title="Bax"
                              >
                                <FiEye className="h-5 w-5" />
                              </button>
                              <button
                                onClick={() => handleOpenModal(category)}
                                className="text-indigo-600 transition-colors hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                                title="Redaktə et"
                              >
                                <FiEdit2 className="h-5 w-5" />
                              </button>
                              <button
                                onClick={() => handleDeleteRequest(category)}
                                className="text-red-600 transition-colors hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                                title="Sil"
                              >
                                <FiTrash2 className="h-5 w-5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="grid gap-4 md:hidden">
                {categories.map((category) => (
                  <div
                    key={category.id}
                    className="flex gap-4 rounded-xl border border-gray-100 bg-white p-4 shadow dark:border-gray-700 dark:bg-gray-800"
                  >
                    <img
                      src={resolveImageSrc(category)}
                      alt={category.name}
                      className="h-20 w-20 flex-shrink-0 rounded-lg object-cover"
                      onError={handleCategoryImageError}
                    />
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="text-base font-semibold text-gray-900 dark:text-white">{category.name}</h3>
                          <p className="break-all text-xs text-gray-500 dark:text-gray-400">/{category.slug}</p>
                        </div>
                        <button
                          onClick={() => handleOpenView(category)}
                          className="text-blue-600 transition-colors hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                          aria-label="Kateqoriyaya bax"
                        >
                          <FiEye className="h-5 w-5" />
                        </button>
                      </div>

                      <div className="mt-4 flex flex-wrap items-center gap-3">
                        <button
                          onClick={() => handleOpenModal(category)}
                          className="flex items-center gap-2 rounded-lg bg-indigo-50 px-3 py-2 text-sm font-medium text-indigo-700 transition-colors hover:bg-indigo-100 dark:bg-indigo-900/40 dark:text-indigo-200 dark:hover:bg-indigo-900/60"
                        >
                          <FiEdit2 className="h-4 w-4" />
                          Redaktə
                        </button>
                        <button
                          onClick={() => handleDeleteRequest(category)}
                          className="flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-100 dark:bg-red-900/40 dark:text-red-200 dark:hover:bg-red-900/60"
                        >
                          <FiTrash2 className="h-4 w-4" />
                          Sil
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {viewCategory && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
              <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-xl dark:bg-gray-800">
                <div className="p-6">
                  <div className="mb-6 flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Kateqoriya Məlumatı</h2>
                    <button
                      onClick={handleCloseView}
                      className="rounded-full p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-200"
                      aria-label="Pəncərəni bağla"
                    >
                      <FiX size={20} />
                    </button>
                  </div>
                  <div className="flex flex-col items-center gap-6">
                    <img
                      src={resolveImageSrc(viewCategory)}
                      alt={viewCategory.name}
                      className="w-full max-w-sm rounded-3xl border border-gray-200 object-cover shadow-lg dark:border-gray-600"
                      onError={handleCategoryImageError}
                    />
                    <div className="w-full space-y-2 text-center">
                      <p className="text-lg font-semibold text-gray-900 dark:text-white">{viewCategory.name}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Slug: <span className="font-mono break-all">{viewCategory.slug}</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {isModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
              <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-xl dark:bg-gray-800">
                <div className="p-6">
                  <div className="mb-6 flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      {editingCategory ? 'Kateqoriyanı Redaktə Et' : 'Yeni Kateqoriya'}
                    </h2>
                    <button
                      onClick={handleCloseModal}
                      className="rounded-full p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-200"
                      aria-label="Pəncərəni bağla"
                    >
                      <FiX size={20} />
                    </button>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Ad *</label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(event) => handleNameChange(event.target.value)}
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                        required
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Slug *</label>
                      <input
                        type="text"
                        value={formData.slug}
                        onChange={(event) => setFormData({ ...formData, slug: event.target.value })}
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                        required
                      />
                      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">URL-də istifadə olunacaq (avtomatik yaranır)</p>
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Şəkil</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 file:mr-4 file:rounded-lg file:border-0 file:bg-indigo-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-indigo-700 hover:file:bg-indigo-100 focus:ring-2 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:file:bg-indigo-900 dark:file:text-indigo-300"
                      />
                    </div>

                    {imagePreview && (
                      <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Önizləmə</label>
                        <img
                          src={imagePreview}
                          alt="Kateqoriya önizləməsi"
                          className="h-32 w-32 rounded-lg border border-gray-200 object-cover dark:border-gray-600"
                        />
                      </div>
                    )}

                    <div className="flex gap-3 pt-4">
                      <button
                        type="submit"
                        className="flex-1 rounded-lg bg-indigo-600 px-4 py-2 text-white transition-colors hover:bg-indigo-700"
                      >
                        {editingCategory ? 'Yenilə' : 'Yarat'}
                      </button>
                      <button
                        type="button"
                        onClick={handleCloseModal}
                        className="flex-1 rounded-lg bg-gray-200 px-4 py-2 text-gray-800 transition-colors hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                      >
                        Ləğv et
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}
        </div>
      </AdminLayout>

      <ConfirmDialog
        open={Boolean(categoryToDelete)}
        title="Kateqoriyanı silmək istədiyinizdən əminsiniz?"
        description={categoryToDelete ? `"${categoryToDelete.name}" kateqoriyası silinəcək. Bu kategoriyaya aid olan bütün məhsullar silinəcək.` : undefined}
        confirmLabel="Bəli, sil"
        cancelLabel="Ləğv et"
        isLoading={isDeleting}
        onCancel={handleCancelDelete}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
}
