import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
    LayoutDashboard,
    Building2,
    Zap,
    Map,
    LogOut,
    Building,
    X
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { clsx } from 'clsx';

import logo from '../../assets/logo.png';

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

export const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
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
        <>
            <aside className={clsx(
                "fixed inset-y-0 start-0 z-50 w-64 bg-white border-r border-slate-200 flex flex-col transition-transform duration-300 ease-in-out md:static md:transform-none rtl:border-r-0 rtl:border-l",
                isOpen ? "translate-x-0" : "-translate-x-full rtl:translate-x-full"
            )}>
                <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                    <div className="flex justify-center flex-1">
                        <img src={logo} alt="Dar Makkah Logo" className="w-24 h-auto object-contain" />
                    </div>
                    <button
                        onClick={onClose}
                        className="md:hidden p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-50"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            onClick={() => {
                                // Close sidebar on mobile when item clicked
                                if (window.innerWidth < 768) {
                                    onClose();
                                }
                            }}
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

            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
                    onClick={onClose}
                />
            )}
        </>
    );
};
