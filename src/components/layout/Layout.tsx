import { useEffect, useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Sidebar } from './Sidebar';
import { useAuth } from '../../contexts/AuthContext';
import { Globe, Headphones } from 'lucide-react';
import { SupportModal } from '../ui/SupportModal';

export const Layout = () => {
    const { user } = useAuth();
    const { i18n, t } = useTranslation();
    const [isSupportOpen, setIsSupportOpen] = useState(false);

    // Handle direction change
    useEffect(() => {
        document.documentElement.dir = i18n.dir();
        document.documentElement.lang = i18n.language;
    }, [i18n.language]);

    const toggleLanguage = () => {
        i18n.changeLanguage(i18n.language === 'en' ? 'ar' : 'en');
    };

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return (
        <div className="flex min-h-screen bg-slate-50 font-sans">
            <Sidebar />

            <main className="flex-1 flex flex-col min-w-0">
                <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-10 glass-effect">
                    <h1 className="text-xl font-bold text-slate-800 tracking-tight">
                        {t('app.title')}
                    </h1>

                    <div className="flex items-center gap-4">
                        <button
                            onClick={toggleLanguage}
                            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium transition-colors"
                        >
                            <Globe className="w-4 h-4" />
                            <span>{i18n.language === 'en' ? 'العربية' : 'English'}</span>
                        </button>

                        <button
                            onClick={() => setIsSupportOpen(true)}
                            className="p-2 text-slate-400 hover:text-brand-600 transition-colors"
                            title={t('app.support')}
                        >
                            <Headphones className="w-5 h-5" />
                        </button>

                        <div className="w-8 h-8 bg-brand-100 rounded-full flex items-center justify-center text-brand-700 font-semibold text-sm">
                            {user.name.charAt(0)}
                        </div>
                    </div>
                </header>

                <div className="p-8 flex-1 overflow-auto">
                    <Outlet context={{ openSupport: () => setIsSupportOpen(true) }} />
                </div>

                <SupportModal isOpen={isSupportOpen} onClose={() => setIsSupportOpen(false)} />
            </main>
        </div>
    );
};
