import React, { useState } from 'react';
import { Layout } from '../components/layout/Layout';
import { PageTransition } from '../components/layout/PageTransition';

const faqs = [
  {
    question: "Sifarişim nə vaxt çatdırılacaq?",
    answer: "Bakı daxili sifarişlər 1-2 iş günü, bölgələrə isə 3-5 iş günü ərzində çatdırılır."
  },
  {
    question: "Ödəniş üsulları hansılardır?",
    answer: "Siz bank kartı (Visa, Mastercard) və ya qapıda nağd ödəniş edə bilərsiniz."
  },
  {
    question: "Məhsulu necə qaytara bilərəm?",
    answer: "Məhsulu 14 gün ərzində qaytara bilərsiniz. Ətraflı məlumat üçün 'Qaytarma və Dəyişdirmə' səhifəsinə baxın."
  },
  {
    question: "Çatdırılma ödənişlidir?",
    answer: "50 AZN-dən yuxarı sifarişlərdə çatdırılma pulsuzdur. Digər hallarda Bakı daxili 5 AZN təşkil edir."
  },
  {
    question: "Sifarişi ləğv edə bilərəm?",
    answer: "Bəli, sifariş kuryerə təhvil verilməyibsə, şəxsi kabinetinizdən ləğv edə bilərsiniz."
  }
];

export const FAQPage: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <Layout>
      <PageTransition>
        <div className="min-h-screen bg-gray-50 pt-32 pb-16">
          <div className="container-custom">
            <div className="max-w-3xl mx-auto">
              <h1 className="text-3xl font-display font-bold text-gray-900 mb-8 text-center">Tez-tez Soruşulan Suallar</h1>
              
              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <div key={index} className="bg-white rounded-2xl shadow-sm overflow-hidden">
                    <button
                      className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                      onClick={() => setOpenIndex(openIndex === index ? null : index)}
                    >
                      <span className="font-medium text-gray-900">{faq.question}</span>
                      <svg
                        className={`w-5 h-5 text-gray-500 transition-transform ${openIndex === index ? 'rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {openIndex === index && (
                      <div className="px-6 pb-4 text-gray-600 animate-fade-in">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </PageTransition>
    </Layout>
  );
};
