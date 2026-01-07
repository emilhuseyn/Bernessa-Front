import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiUpload, FiPackage } from 'react-icons/fi';
import toast from 'react-hot-toast';
import AdminLayout from '../../components/admin/AdminLayout';
import { brandService } from '../../services/brandService';
import type { Brand, CreateBrandDTO, UpdateBrandDTO } from '../../types';
import { handleApiError } from '../../utils/errorHandler';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';

interface BrandFormState {
  name: string;
  logo: File | null;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5034/api';
const MEDIA_BASE_URL = API_BASE_URL.replace(/\/?api\/?$/, '');
const PLACEHOLDER_IMAGE = 'https://via.placeholder.com/200x200?text=Logo';

const createInitialFormState = (): BrandFormState => ({
  name: '',
  logo: null,
});

const resolveImageUrl = (url: string): string => {
  if (!url) return PLACEHOLDER_IMAGE;
  if (url.startsWith('http')) return url;
  const normalized = url.replace(/^\/+/, '');
  return `${MEDIA_BASE_URL}/${normalized}`;
};

export default function AdminBrands() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [brandToDelete, setBrandToDelete] = useState<Brand | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
  const [formState, setFormState] = useState<BrandFormState>(createInitialFormState);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [existingLogo, setExistingLogo] = useState<string | null>(null);

  useEffect(() => {
    void fetchBrands();
  }, []);

  const fetchBrands = async () => {
    setIsLoading(true);
    try {
      const data = await brandService.getAll();
      console.log('Fetched brands:', data);
      setBrands(data);
    } catch (error) {
      console.error('Error in fetchBrands:', error);
      handleApiError(error, 'Brendlər yüklənərkən xəta baş verdi');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogoChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormState((prev) => ({ ...prev, logo: file }));
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!formState.name.trim()) {
      toast.error('Brend adı tələb olunur');
      return;
    }

    setIsSaving(true);
    try {
      if (editingBrand) {
        const updateData: UpdateBrandDTO = {
          id: editingBrand.id,
          name: formState.name,
          logo: formState.logo || undefined,
        };
        await brandService.update(editingBrand.id, updateData);
        toast.success('Brend uğurla yeniləndi');
      } else {
        const createData: CreateBrandDTO = {
          name: formState.name,
          logo: formState.logo || undefined,
        };
        await brandService.create(createData);
        toast.success('Brend uğurla əlavə edildi');
      }
      
      await fetchBrands();
      closeModal();
    } catch (error) {
      handleApiError(error, editingBrand ? 'Brend yenilənərkən xəta baş verdi' : 'Brend əlavə edilərkən xəta baş verdi');
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (brand: Brand) => {
    setEditingBrand(brand);
    setFormState({
      name: brand.name,
      logo: null,
    });
    setLogoPreview(null);
    setExistingLogo(brand.logo || null);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (brand: Brand) => {
    console.log('Delete button clicked for brand:', brand);
    setBrandToDelete(brand);
  };

  const handleDeleteConfirm = async () => {
    if (!brandToDelete) return;
    
    console.log('Deleting brand:', brandToDelete);
    setIsDeleting(true);
    try {
      await brandService.delete(brandToDelete.id);
      console.log('Brand deleted successfully');
      toast.success('Brend uğurla silindi');
      await fetchBrands();
      setBrandToDelete(null);
    } catch (error) {
      console.error('Delete error:', error);
      handleApiError(error, 'Brend silinərkən xəta baş verdi');
    } finally {
      setIsDeleting(false);
    }
  };

  const openCreateModal = () => {
    setEditingBrand(null);
    setFormState(createInitialFormState());
    setLogoPreview(null);
    setExistingLogo(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingBrand(null);
    setFormState(createInitialFormState());
    setLogoPreview(null);
    setExistingLogo(null);
  };

  const filteredBrands = brands?.filter((brand) =>
    brand.name.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Brendlər</h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Bütün brendləri idarə edin
            </p>
          </div>
          <button
            type="button"
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 rounded-xl bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-primary-700 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
          >
            <FiPlus className="h-5 w-5" />
            Yeni Brend
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <input
            type="text"
            placeholder="Brend axtar..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 pl-11 text-sm text-slate-900 placeholder-slate-400 transition-colors duration-200 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder-slate-500"
          />
          <svg
            className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        {/* Brands Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600 dark:border-slate-700 dark:border-t-primary-500" />
          </div>
        ) : filteredBrands.length === 0 ? (
          <div className="rounded-xl border border-slate-200 bg-white p-12 text-center dark:border-slate-800 dark:bg-slate-900">
            <FiPackage className="mx-auto h-12 w-12 text-slate-400" />
            <h3 className="mt-4 text-lg font-semibold text-slate-900 dark:text-white">
              Brend tapılmadı
            </h3>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              {searchQuery ? 'Axtarış nəticəsi tapılmadı' : 'Hələ heç bir brend əlavə edilməyib'}
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredBrands.map((brand) => (
              <div
                key={brand.id}
                className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all duration-200 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
              >
                <div className="aspect-square w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                  <img
                    src={resolveImageUrl(brand.logo || brand.logoUrl || '')}
                    alt={brand.name}
                    className="h-full w-full object-contain p-6 transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="p-4">
                  <h3 className="truncate text-base font-semibold text-slate-900 dark:text-white">
                    {brand.name}
                  </h3>
                  {brand.productCount !== undefined && (
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                      {brand.productCount} məhsul
                    </p>
                  )}
                </div>
                <div className="flex border-t border-slate-200 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => handleEdit(brand)}
                    className="flex flex-1 items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-slate-700 transition-colors duration-200 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800"
                  >
                    <FiEdit2 className="h-4 w-4" />
                    Redaktə et
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteClick(brand)}
                    className="flex flex-1 items-center justify-center gap-2 border-l border-slate-200 px-4 py-3 text-sm font-medium text-red-600 transition-colors duration-200 hover:bg-red-50 dark:border-slate-800 dark:text-red-400 dark:hover:bg-red-950/20"
                  >
                    <FiTrash2 className="h-4 w-4" />
                    Sil
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 dark:border-slate-800">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                {editingBrand ? 'Brendi Redaktə Et' : 'Yeni Brend Əlavə Et'}
              </h2>
              <button
                type="button"
                onClick={closeModal}
                className="rounded-lg p-2 text-slate-400 transition-colors duration-200 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-300"
              >
                <FiX className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              <div className="space-y-4">
                {/* Name */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Brend Adı *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formState.name}
                    onChange={handleInputChange}
                    required
                    className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 transition-colors duration-200 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>

                {/* Logo */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Loqo
                  </label>
                  <div className="mt-1.5">
                    {(logoPreview || existingLogo) && (
                      <div className="mb-3 flex justify-center">
                        <img
                          src={logoPreview || resolveImageUrl(existingLogo || '')}
                          alt="Preview"
                          className="h-32 w-32 rounded-lg border border-slate-200 object-contain p-2 dark:border-slate-700"
                        />
                      </div>
                    )}
                    <label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-sm font-medium text-slate-600 transition-colors duration-200 hover:border-primary-500 hover:bg-primary-50 hover:text-primary-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:border-primary-500 dark:hover:bg-primary-950/20 dark:hover:text-primary-400">
                      <FiUpload className="h-5 w-5" />
                      Loqo Yüklə
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleLogoChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-6 flex gap-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors duration-200 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                >
                  Ləğv et
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex-1 rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors duration-200 hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isSaving ? 'Yadda saxlanılır...' : editingBrand ? 'Yadda Saxla' : 'Əlavə Et'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={brandToDelete !== null}
        onCancel={() => setBrandToDelete(null)}
        onConfirm={handleDeleteConfirm}
        title="Brendi Sil"
        description={`"${brandToDelete?.name}" brendini silmək istədiyinizdən əminsiniz? Bu əməliyyat geri qaytarıla bilməz.`}
        confirmLabel="Sil"
        cancelLabel="Ləğv et"
        isLoading={isDeleting}
      />
    </AdminLayout>
  );
}
