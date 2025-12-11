import { useEffect, useMemo, useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';
import { PageTransition } from '../components/layout/PageTransition';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useCartStore } from '../store/cartStore';
import { orderService } from '../services';
import type { PaymentMethod } from '../services';
import type { CartItem } from '../types';
import { handleApiError } from '../utils/errorHandler';
import { FiCheckCircle, FiX } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useTranslation } from '../hooks/useTranslation';

type CheckoutFormState = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  note: string;
  paymentMethod: PaymentMethod;
};

const resolveProductId = (item: CartItem): number | null => {
  const direct = Number(item.productId);
  if (!Number.isNaN(direct) && Number.isFinite(direct)) {
    return direct;
  }

  const fallback = Number(String(item.id).split('-')[0]);
  if (!Number.isNaN(fallback) && Number.isFinite(fallback)) {
    return fallback;
  }

  return null;
};

export const CheckoutPage = () => {
  const { t } = useTranslation();
  
  const PAYMENT_OPTIONS = [
    {
      value: 0,
      label: t('checkout.cashOnDelivery'),
      helper: t('checkout.cashOnDeliveryDesc'),
    },
    {
      value: 1,
      label: t('checkout.cardPayment'),
      helper: t('checkout.cardPaymentDesc'),
    },
    {
      value: 2,
      label: t('checkout.bankTransfer'),
      helper: t('checkout.bankTransferDesc'),
    },
  ] as const satisfies ReadonlyArray<{ value: PaymentMethod; label: string; helper: string }>;
  
  const navigate = useNavigate();
  const { items, total, clearCart } = useCartStore();

  const [form, setForm] = useState<CheckoutFormState>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    note: '',
    paymentMethod: PAYMENT_OPTIONS[0].value,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [orderNumber, setOrderNumber] = useState<string | null>(null);

  useEffect(() => {
    // Don't redirect if showing success modal
    if (items.length === 0 && !showSuccessModal) {
      navigate('/cart');
    }
  }, [items.length, navigate, showSuccessModal]);

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items]
  );

  const onChange = (field: keyof typeof form) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      setForm((prev) => ({ ...prev, [field]: event.target.value }));
    };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (items.length === 0) {
      navigate('/cart');
      return;
    }

    // Validate each required field
    if (!form.firstName.trim()) {
      toast.error(t('checkout.requiredField'));
      return;
    }
    if (!form.lastName.trim()) {
      toast.error(t('checkout.requiredField'));
      return;
    }
    if (!form.email.trim()) {
      toast.error(t('checkout.requiredField'));
      return;
    }
    if (!form.phone.trim()) {
      toast.error(t('checkout.requiredField'));
      return;
    }
    if (!form.address.trim()) {
      toast.error(t('checkout.requiredField'));
      return;
    }

    const orderItems = items
      .map((item) => {
        const productId = resolveProductId(item);
        if (productId == null) {
          return null;
        }
        return {
          productId,
          quantity: item.quantity,
        };
      })
      .filter((item): item is { productId: number; quantity: number } => Boolean(item));

    if (orderItems.length === 0) {
      toast.error('Sifariş üçün məhsul tapılmadı. Zəhmət olmasa səbəti yeniləyin.');
      return;
    }

    const customerName = `${form.firstName} ${form.lastName}`.trim();
    const shippingAddress = form.address.trim() || 'Ünvan telefonla təsdiqlənəcək';

    setIsSubmitting(true);
    try {
      const order = await orderService.create({
        customerName,
        customerEmail: form.email.trim(),
        customerPhone: form.phone.trim(),
        shippingAddress,
        customerNote: form.note.trim() || undefined,
        paymentMethod: form.paymentMethod,
        items: orderItems,
      });

      clearCart();
      setOrderNumber(order.orderNumber || order.id);
      setShowSuccessModal(true);
    } catch (err) {
      toast.error(handleApiError(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <PageTransition>
        {/* Success Modal */}
        {showSuccessModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => {
                setShowSuccessModal(false);
                navigate('/');
              }}
            />
            <div className="relative bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 animate-fade-in">
              <button
                onClick={() => {
                  setShowSuccessModal(false);
                  navigate('/');
                }}
                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
              >
                <FiX className="w-5 h-5" />
              </button>
              
              <div className="text-center">
                <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                  <FiCheckCircle className="w-10 h-10 text-green-600" />
                </div>
                
                <h2 className="text-2xl font-display font-bold text-gray-900 mb-3">
                  {t('checkout.orderSuccess')}
                </h2>
                
                <p className="text-gray-600 mb-4">
                  {t('checkout.emailSent')}
                </p>

                <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-6 text-left">
                  <p className="text-sm text-blue-800 font-medium mb-1">
                    📋 {t('checkout.infoTitle')}
                  </p>
                  <p className="text-sm text-blue-700">
                    {t('checkout.infoDescription')}
                  </p>
                </div>
                
                {orderNumber && (
                  <div className="bg-gray-50 rounded-xl p-4 mb-6">
                    <p className="text-sm text-gray-500 mb-1">{t('checkout.orderNumber')}</p>
                    <p className="text-xl font-bold text-gray-900">#{orderNumber}</p>
                  </div>
                )}
                
                <div className="space-y-3">
                  <Button
                    variant="primary"
                    className="w-full"
                    onClick={() => {
                      setShowSuccessModal(false);
                      navigate('/');
                    }}
                  >
                    {t('checkout.returnHome')}
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full"
                    onClick={() => {
                      setShowSuccessModal(false);
                      navigate('/orders');
                    }}
                  >
                    {t('checkout.viewOrders')}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="min-h-screen bg-gray-50 pt-28 pb-16">
          <div className="container-custom">
            <div className="max-w-5xl mx-auto">
              <div className="mb-10 text-center">
                <p className="text-xs uppercase tracking-[0.4em] text-gray-400">{t('checkout.title')}</p>
                <h1 className="mt-3 text-4xl md:text-5xl font-display font-bold text-gray-900">{t('checkout.title')}</h1>
                <p className="mt-3 text-sm text-gray-500">
                  {t('checkout.description')}
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-6">
                  <div className="rounded-3xl bg-white p-8 shadow-sm border border-gray-100">
                    <h2 className="text-lg font-semibold text-gray-900 mb-6">{t('checkout.contactInfo')}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <Input
                        label={t('checkout.firstName')}
                        placeholder={t('checkout.firstName')}
                        value={form.firstName}
                        onChange={onChange('firstName')}
                        required
                      />
                      <Input
                        label={t('checkout.lastName')}
                        placeholder={t('checkout.lastName')}
                        value={form.lastName}
                        onChange={onChange('lastName')}
                        required
                      />
                      <Input
                        label={t('checkout.email')}
                        type="email"
                        placeholder="example@mail.com"
                        value={form.email}
                        onChange={onChange('email')}
                        required
                      />
                      <Input
                        label={t('checkout.phone')}
                        placeholder="+994 XX XXX XX XX"
                        value={form.phone}
                        onChange={onChange('phone')}
                        required
                      />
                    </div>
                  </div>

                  <div className="rounded-3xl bg-white p-8 shadow-sm border border-gray-100">
                    <h2 className="text-lg font-semibold text-gray-900 mb-6">{t('checkout.deliveryAddress')}</h2>
                    <div className="space-y-5">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">{t('checkout.address')}</label>
                        <textarea
                          className="w-full rounded-xl border-2 border-gray-200 bg-gray-50/50 px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent focus:bg-white transition-all duration-200"
                          rows={3}
                          placeholder={t('checkout.address')}
                          value={form.address}
                          onChange={onChange('address')}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">{t('checkout.note')}</label>
                        <textarea
                          className="w-full rounded-xl border-2 border-gray-200 bg-gray-50/50 px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent focus:bg-white transition-all duration-200"
                          rows={3}
                          placeholder={t('checkout.notePlaceholder')}
                          value={form.note}
                          onChange={onChange('note')}
                        />
                      </div>
                    </div>
                  </div>

              
                  

                  <div className="flex flex-col sm:flex-row justify-end gap-4">
                    <Button
                      type="submit"
                      variant="primary"
                      disabled={isSubmitting}
                      className="px-8"
                    >
                      {isSubmitting ? t('checkout.processing') : t('checkout.placeOrder')}
                    </Button>
                  </div>
                </form>

                <aside className="rounded-3xl bg-gray-900 text-white p-8 h-fit sticky top-24">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-display font-semibold">{t('checkout.yourOrder')}</h2>
                    <span className="text-xs uppercase tracking-widest text-white/60">{t('checkout.total')} {items.length} {t('checkout.totalProducts')}</span>
                  </div>

                  <div className="space-y-4 mb-6">
                    {items.map((item) => (
                      <div key={item.id} className="flex items-start gap-4">
                        <div className="h-16 w-16 overflow-hidden rounded-xl bg-white/10">
                          <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-white line-clamp-2">{item.name}</p>
                          <p className="mt-1 text-xs text-white/60">{t('checkout.quantity')}: {item.quantity}</p>
                        </div>
                        <p className="text-sm font-semibold text-white/90">{(item.price * item.quantity).toFixed(2)} AZN</p>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-3 text-sm text-white/70">
                    <div className="flex justify-between">
                      <span>{t('checkout.subtotal')}</span>
                      <span>{subtotal.toFixed(2)} AZN</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{t('checkout.shipping')}</span>
                      <span>{t('checkout.freeShipping')}</span>
                    </div>
                  </div>

                  <div className="mt-6 border-t border-white/10 pt-6 flex justify-between items-center">
                    <span className="text-lg font-semibold text-white/80">{t('checkout.total')}</span>
                    <span className="text-3xl font-display font-semibold">{total.toFixed(2)} AZN</span>
                  </div>

                  <p className="mt-6 text-xs text-white/60 leading-relaxed">
                    {t('checkout.termsText')}
                  </p>
                </aside>
              </div>
            </div>
          </div>
        </div>
      </PageTransition>
    </Layout>
  );
};
