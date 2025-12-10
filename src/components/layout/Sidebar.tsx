import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
    LayoutDashboard,
    Building2,
    Zap,
    Map,
    LogOut,
    Building
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { clsx } from 'clsx';

export const Sidebar = () => {
    const { t } = useTranslation();
    const { logout } = useAuth();

    const navItems = [
        { to: '/', icon: LayoutDashboard, label: t('app.dashboard') },
        { to: '/architectural', icon: Building2, label: t('sections.architectural') },
        { to: '/structural', icon: Building, label: t('sections.structural') },
        { to: '/surveying', icon: Map, label: t('sections.surveying') },
        { to: '/electrical', icon: Zap, label: t('sections.electrical') },
        { to: '/mechanical', icon: Building, label: t('sections.mechanical') },
    ];

    return (
        <aside className="w-64 bg-white border-r border-slate-200 h-screen flex flex-col sticky top-0 rtl:border-r-0 rtl:border-l">
            <div className="p-6 border-b border-slate-100 flex items-center justify-center">
                <div className="w-32 h-32 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 text-xs text-center border-2 border-dashed border-slate-300">
                    Logo
                </div>
            </div>

            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                {navItems.map((item) => (
                    <NavLink
                        key={item.to}
                        to={item.to}
                        className={({ isActive }) => clsx(
                            "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200",
                            isActive
                                ? "bg-brand-50 text-brand-700 font-medium shadow-sm"
                                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                        )}
                    >
                        <item.icon className="w-5 h-5" />
                        <span>{item.label}</span>
                    </NavLink>
                ))}
            </nav>

            <div className="p-4 border-t border-slate-100">
                <button
                    onClick={logout}
                    className="flex items-center gap-3 w-full px-4 py-3 text-slate-600 hover:bg-red-50 hover:text-red-700 rounded-lg transition-colors"
                >
                    <LogOut className="w-5 h-5" />
                    <span>{t('app.logout')}</span>
                </button>
            </div>
        </aside>
    );
};
