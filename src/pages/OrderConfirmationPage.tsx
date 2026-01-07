import type { FC } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';
import { PageTransition } from '../components/layout/PageTransition';
import { Button } from '../components/ui/Button';
import type { CartItem } from '../types';
import type { OrderSummary } from '../services';

const DEFAULT_SUCCESS_MESSAGE =
  'Əlaqə məlumatlarınız qeydə alındı. Tezliklə sizinlə əlaqə saxlanılacaq.';

interface CheckoutContactInfo {
  fullName?: string;
  email?: string;
  phone?: string;
  note?: string;
}

export const OrderConfirmationPage: FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const order = location.state?.order as OrderSummary | undefined;
  const itemsSnapshot = (location.state?.itemsSnapshot as CartItem[] | undefined) ?? [];
  const contact = location.state?.contact as CheckoutContactInfo | undefined;
  const successMessage =
    typeof location.state?.message === 'string' && location.state.message.trim().length
      ? location.state.message
      : DEFAULT_SUCCESS_MESSAGE;

  if (!order) {
    navigate('/');
    return null;
  }

  const customerName = order.customerName || contact?.fullName;
  const orderDate = order.createdAt ? new Date(order.createdAt) : new Date();

  const orderItems = order.items?.length
    ? order.items.map((item) => ({
        id: item.id,
        name: item.name ?? 'Məhsul',
        quantity: item.quantity,
        price: item.price,
      }))
    : itemsSnapshot.map((item) => ({
        id: item.id,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
      }));

  const totalAmount =
    typeof order.totalAmount === 'number'
      ? order.totalAmount
      : orderItems.reduce(
          (sum, item) => sum + (typeof item.price === 'number' ? item.price * item.quantity : 0),
          0
        );

  const shippingAddress = [
    order.shippingAddress,
    contact?.phone,
    contact?.email,
    contact?.note,
  ]
    .filter((value): value is string => Boolean(value && value.toString().trim().length))
    .join('\n') || 'Ünvan məlumatları qeydə alınıb.';

  return (
    <Layout>
      <PageTransition>
        <div className="container-custom py-16">
          <div className="max-w-2xl mx-auto text-center">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-2">Sifariş Uğurla Yerləşdirildi!</h1>
            <p className="text-gray-600 mb-4">{successMessage}</p>
            <p className="text-gray-500 mb-8">
              Alış-verişiniz üçün təşəkkür edirik.
              {customerName ? ` Hörmətli ${customerName}, sifarişiniz təsdiqləndi.` : ' Sifarişiniz təsdiqləndi.'}
            </p>

            <div className="bg-white rounded-lg shadow-md p-8 mb-8 text-left">
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-sm text-gray-600">Sifariş Nömrəsi</p>
                  <p className="font-semibold">{order.orderNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Tarix</p>
                  <p className="font-semibold">{orderDate.toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Ümumi Məbləğ</p>
                  <p className="font-semibold text-lg">{totalAmount.toFixed(2)} AZN</p>
                </div>
               
              </div>

              <div className="border-t pt-6">
                <h3 className="font-semibold mb-3">Çatdırılma Ünvanı</h3>
                <p className="text-sm text-gray-600 whitespace-pre-line">{shippingAddress}</p>
              </div>

              <div className="border-t pt-6 mt-6">
                <h3 className="font-semibold mb-3">Sifarişə daxil olan məhsullar</h3>
                <div className="space-y-3">
                  {orderItems.map((item) => (
                    <div key={item.id} className="flex justify-between items-start text-sm">
                      <div className="flex-1">
                        <span className="font-medium">{item.name}</span>
                        {item.volume && <span className="text-gray-500 ml-2">({item.volume})</span>}
                        <span className="text-gray-500"> × {item.quantity}</span>
                      </div>
                      <span className="font-medium">
                        {(typeof item.price === 'number' ? item.price * item.quantity : 0).toFixed(2)} AZN
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button onClick={() => navigate('/orders')} variant="primary" size="lg">
                Sifarişlərimi Gör
              </Button>
              <Button onClick={() => navigate('/')} variant="outline" size="lg">
                Alış-verişə Davam Et
              </Button>
            </div>
          </div>
        </div>
      </PageTransition>
    </Layout>
  );
};
