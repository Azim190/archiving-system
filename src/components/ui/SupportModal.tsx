import React from 'react';
import { Mail, Phone, X, MessageCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface SupportModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const SupportModal: React.FC<SupportModalProps> = ({ isOpen, onClose }) => {
    const { t } = useTranslation();

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 rtl:right-auto rtl:left-4 text-slate-400 hover:text-slate-600 transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="p-8 text-center">
                    <div className="w-16 h-16 bg-brand-50 rounded-full flex items-center justify-center mx-auto mb-4 text-brand-600">
                        <Phone className="w-8 h-8" />
                    </div>

                    <h3 className="text-xl font-bold text-slate-800 mb-2">{t('app.support')}</h3>
                    <p className="text-slate-500 text-sm mb-8">
                        Need assistance? Contact our technical support team via:
                    </p>

                    <div className="space-y-3">
                        <a
                            href="https://wa.me/966502537104"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 p-4 rounded-xl border border-green-100 bg-green-50 text-green-700 hover:bg-green-100 transition-colors group"
                        >
                            <div className="p-2 bg-white rounded-lg text-green-600 shadow-sm">
                                <MessageCircle className="w-5 h-5" />
                            </div>
                            <div className="text-start rtl:text-right">
                                <div className="font-bold">WhatsApp</div>
                                <div className="text-xs opacity-75">Instant Chat Support</div>
                            </div>
                        </a>

                        <a
                            href="mailto:support@darmakkah.com"
                            className="flex items-center gap-3 p-4 rounded-xl border border-blue-100 bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors group"
                        >
                            <div className="p-2 bg-white rounded-lg text-blue-600 shadow-sm">
                                <Mail className="w-5 h-5" />
                            </div>
                            <div className="text-start rtl:text-right">
                                <div className="font-bold">Email</div>
                                <div className="text-xs opacity-75">support@darmakkah.com</div>
                            </div>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};
