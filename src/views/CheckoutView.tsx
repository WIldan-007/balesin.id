import React, { useState } from 'react';
import { ViewMode, UserProfile } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { updateUserSubscriptionInDb } from '../services/authService';
import { 
  ArrowLeft, 
  CheckCircle2, 
  Lock, 
  CreditCard, 
  QrCode, 
  Building2, 
  Sparkles,
  Cpu
} from 'lucide-react';

interface CheckoutViewProps {
  mode: 'plus' | 'pro';
  setView: (view: ViewMode) => void;
  user?: UserProfile;
  setUser: React.Dispatch<React.SetStateAction<UserProfile>>;
}

export const CheckoutView: React.FC<CheckoutViewProps> = ({ mode, setView, user, setUser }) => {
  const { t } = useLanguage();
  const isPro = mode === 'pro';
  const priceUSD = isPro ? 149 : 49;
  const priceIDR = isPro ? '179.000' : '99.000';
  const protocolName = isPro ? 'PRO PROTOCOL' : 'PLUS PROTOCOL';

  const [paymentMethod, setPaymentMethod] = useState<'bca' | 'mandiri' | 'gopay' | 'card'>('bca');
  const [operatorName, setOperatorName] = useState(user?.name || 'Operator Balesin');
  const [operatorEmail, setOperatorEmail] = useState(user?.email || 'operator@balesin.ai');
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);

  const [isProcessing, setIsProcessing] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const applyPromo = () => {
    if (promoCode.toUpperCase() === 'ALPHA20') {
      setDiscount(20);
    } else if (promoCode.trim().length > 0) {
      alert(t('Kode promo injeksi tidak valid atau telah kadaluarsa', 'Invalid or expired injection promo code'));
    }
  };

  const finalUSD = Math.max(0, priceUSD - discount);

  const handleExecutePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    const newTier = isPro ? 'PRO' : 'PLUS';

    try {
      if (user?.id) {
        await updateUserSubscriptionInDb(user.id, newTier);
      }
    } catch (err) {
      console.error('Firestore subscription update error:', err);
    } finally {
      setIsProcessing(false);
      setIsCompleted(true);
      setUser(prev => ({
        ...prev,
        tier: newTier,
        isLoggedIn: true,
        isTrialExpired: false,
      }));
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-700 font-sans py-10 px-4 sm:px-6 lg:px-8 select-none">
      
      <div className="max-w-3xl mx-auto space-y-6">
        
        {/* Top Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <button
            onClick={() => setView('landing')}
            className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{t('BATALKAN PEMBAYARAN', 'ABORT CHECKOUT PROTOCOL')}</span>
          </button>

          <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-bold bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            <Lock className="w-3.5 h-3.5 text-emerald-600" />
            <span>{t('PEMBAYARAN TERENKRIPSI 256-BIT', '256-BIT ENCRYPTED CHECKOUT')}</span>
          </div>
        </div>

        {isCompleted ? (
          /* RECEIPT CONFIRMATION STATE */
          <div className="p-8 sm:p-10 rounded-2xl bg-white border border-emerald-200 space-y-6 text-center shadow-md">
            <div className="w-16 h-16 rounded-2xl bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-600 mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h1 className="text-2xl font-extrabold text-slate-900 font-heading">{t('TRANSAKSI BERHASIL DIEKSEKUSI', 'TRANSACTION EXECUTED SUCCESSFULLY')}</h1>
              <p className="text-xs text-slate-600">
                {t('Lisensi Operator', 'Operator License')} <strong className="text-[#F2542D]">{protocolName}</strong> {t('telah diaktifkan pada sistem Anda.', 'has been provisioned to your system.')}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-left text-xs space-y-2 max-w-md mx-auto">
              <div className="flex justify-between text-slate-500">
                <span>{t('HASH TRANSAKSI:', 'TRANSACTION HASH:')}</span>
                <span className="font-bold font-mono text-[#0EA5E9]">TX-092841-CYB</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>{t('OPERATOR:', 'OPERATOR:')}</span>
                <span className="font-bold text-slate-900">{operatorName}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>{t('TOTAL DIBAYAR:', 'TOTAL PAID:')}</span>
                <span className="font-bold text-emerald-600">Rp {priceIDR} (${finalUSD} USD)</span>
              </div>
            </div>

            <button
              onClick={() => setView('dashboard')}
              className="px-8 py-3.5 rounded-xl bg-[#F2542D] hover:bg-[#e04520] text-white font-bold text-xs uppercase tracking-wider shadow-md transition-all cursor-pointer"
            >
              {t('MASUK KE DASHBOARD OPERATOR', 'GO TO OPERATOR DASHBOARD')}
            </button>
          </div>
        ) : (
          /* CHECKOUT FORM STATE */
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Form Column */}
            <div className="md:col-span-2 p-6 sm:p-8 rounded-2xl bg-white border border-slate-200/80 space-y-6 shadow-xs">
              
              <div>
                <h1 className="text-2xl font-extrabold text-slate-900 font-heading">{t('PROTOKOL PEMBAYARAN LISENSI', 'LICENSE PAYMENT PROTOCOL')}</h1>
                <p className="text-xs text-slate-500 mt-1">{t('Pilih metode pembayaran dan verifikasi identitas operator', 'Select payment method and verify operator identity')}</p>
              </div>

              <form onSubmit={handleExecutePayment} className="space-y-6 text-xs">
                
                {/* Identity Inputs */}
                <div className="space-y-3">
                  <div className="text-xs font-bold text-[#F2542D] uppercase tracking-wider">1. {t('IDENTITAS OPERATOR', 'OPERATOR IDENTITY')}</div>
                  
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1.5">{t('NAMA OPERATOR', 'NAME')}</label>
                    <input
                      type="text"
                      required
                      value={operatorName}
                      onChange={(e) => setOperatorName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-medium text-xs focus:outline-none focus:border-[#F2542D] focus:bg-white transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-600 font-semibold mb-1.5">{t('IDENTITAS EMAIL', 'EMAIL IDENTIFIER')}</label>
                    <input
                      type="email"
                      required
                      value={operatorEmail}
                      onChange={(e) => setOperatorEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-medium text-xs focus:outline-none focus:border-[#F2542D] focus:bg-white transition-all"
                    />
                  </div>
                </div>

                {/* Payment Method Selector */}
                <div className="space-y-3">
                  <div className="text-xs font-bold text-[#F2542D] uppercase tracking-wider">2. {t('METODE PEMBAYARAN', 'PAYMENT METHOD')}</div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('bca')}
                      className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all ${
                        paymentMethod === 'bca' ? 'bg-orange-50/70 border-[#F2542D] text-slate-900 font-bold shadow-xs' : 'bg-slate-50/80 border-slate-200 text-slate-600 hover:bg-slate-100/80'
                      }`}
                    >
                      <Building2 className="w-4 h-4 text-blue-600 mb-1" />
                      <div className="font-heading">BCA Virtual Account</div>
                      <div className="text-[10px] text-slate-500 font-normal">{t('Verifikasi Otomatis', 'Auto Verification')}</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('mandiri')}
                      className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all ${
                        paymentMethod === 'mandiri' ? 'bg-orange-50/70 border-[#F2542D] text-slate-900 font-bold shadow-xs' : 'bg-slate-50/80 border-slate-200 text-slate-600 hover:bg-slate-100/80'
                      }`}
                    >
                      <Building2 className="w-4 h-4 text-amber-600 mb-1" />
                      <div className="font-heading">Mandiri VA</div>
                      <div className="text-[10px] text-slate-500 font-normal">{t('Proses Instan', 'Instant Clearance')}</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('gopay')}
                      className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all ${
                        paymentMethod === 'gopay' ? 'bg-orange-50/70 border-[#F2542D] text-slate-900 font-bold shadow-xs' : 'bg-slate-50/80 border-slate-200 text-slate-600 hover:bg-slate-100/80'
                      }`}
                    >
                      <QrCode className="w-4 h-4 text-emerald-600 mb-1" />
                      <div className="font-heading">QRIS / GoPay / OVO</div>
                      <div className="text-[10px] text-slate-500 font-normal">{t('Pindai Dompet Digital', 'E-Wallet Scan')}</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('card')}
                      className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all ${
                        paymentMethod === 'card' ? 'bg-orange-50/70 border-[#F2542D] text-slate-900 font-bold shadow-xs' : 'bg-slate-50/80 border-slate-200 text-slate-600 hover:bg-slate-100/80'
                      }`}
                    >
                      <CreditCard className="w-4 h-4 text-purple-600 mb-1" />
                      <div className="font-heading">Kartu Kredit / Stripe</div>
                      <div className="text-[10px] text-slate-500 font-normal">Visa / Mastercard</div>
                    </button>
                  </div>
                </div>

                {/* Promo Code Injection */}
                <div className="space-y-2">
                  <label className="block text-slate-600 font-semibold">{t('KODE PROMO DISKON (OPSIONAL)', 'PROMO CODE (OPTIONAL)')}</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="e.g. ALPHA20"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono text-xs uppercase focus:outline-none focus:border-[#F2542D] focus:bg-white transition-all"
                    />
                    <button
                      type="button"
                      onClick={applyPromo}
                      className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold cursor-pointer transition-all"
                    >
                      {t('GUNAKAN', 'APPLY')}
                    </button>
                  </div>
                  {discount > 0 && (
                    <div className="text-[11px] text-emerald-600 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{t('PROMO DIGUNAKAN: DISKON -$20.00 USD', 'PROMO APPLIED: -$20.00 USD DISCOUNT')}</span>
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full py-4 rounded-xl bg-[#F2542D] hover:bg-[#e04520] text-white font-extrabold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  {isProcessing ? (
                    <>
                      <Sparkles className="w-4 h-4 animate-spin" />
                      <span>{t('MENGEKSEKUSI TRANSAKSI...', 'EXECUTING TRANSACTION...')}</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      <span>{t('SELESAIKAN PEMBAYARAN & AKTIFKAN', 'COMPLETE PAYMENT & INITIALIZE')}</span>
                    </>
                  )}
                </button>

              </form>

            </div>

            {/* Order Summary Sidebar */}
            <div className="p-6 rounded-2xl bg-white border border-orange-200 space-y-4 h-fit shadow-xs">
              <div className="text-xs font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center justify-between font-heading">
                <span>{t('RINGKASAN PESANAN', 'ORDER SUMMARY')}</span>
                <Cpu className="w-4 h-4 text-[#F2542D]" />
              </div>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">{t('Protokol Dipilih:', 'Selected Protocol:')}</span>
                  <span className="font-bold text-slate-900 font-heading">{protocolName}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-500">{t('Harga Dasar (USD):', 'Base Price (USD):')}</span>
                  <span className="font-bold text-slate-900">${priceUSD}.00 / {t('bln', 'mo')}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-500">{t('Harga Rupiah (IDR):', 'Indonesian IDR Price:')}</span>
                  <span className="font-extrabold text-[#F2542D]">Rp {priceIDR} / {t('bln', 'mo')}</span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-bold">
                    <span>{t('Diskon:', 'Discount:')}</span>
                    <span>-${discount}.00</span>
                  </div>
                )}

                <div className="pt-3 border-t border-slate-100 flex justify-between text-sm font-extrabold font-heading text-slate-900">
                  <span>{t('TOTAL BAYAR:', 'TOTAL DUE:')}</span>
                  <span className="text-[#F2542D]">Rp {priceIDR} (${finalUSD})</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-orange-50/60 border border-orange-100 text-[11px] text-slate-600 space-y-1.5">
                <div className="flex items-center gap-1.5 text-slate-800 font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>{t('Aktivasi Lisensi Otomatis & Instan', 'Instant License Key Injection')}</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-800 font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>{t('Garansi Kepuasan 100%', '100% Satisfaction Guarantee')}</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-800 font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>{t('Batal Kapan Saja via Pengaturan', 'Cancel Anytime via Settings')}</span>
                </div>
              </div>
            </div>

          </div>
        )}

      </div>

    </div>
  );
};

