import { useTranslation } from 'react-i18next';
import { Building2, Ruler, Map, Zap, Building } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useOutletContext } from 'react-router-dom';
import { useProjects } from '../contexts/ProjectContext';

interface DashboardContext {
    openSupport: () => void;
}

export const Dashboard = () => {
    const { t } = useTranslation();
    const { openSupport } = useOutletContext<DashboardContext>();
    const { getProjectsByType } = useProjects();

    const sections = [
        {
            id: 'arch',
            title: t('sections.architectural'),
            icon: Building2,
            color: 'bg-blue-500',
            link: '/architectural',
            count: getProjectsByType('architectural').length
        },
        {
            id: 'struct',
            title: t('sections.structural'),
            icon: Ruler,
            color: 'bg-emerald-500',
            link: '/structural',
            count: getProjectsByType('structural').length
        },
        {
            id: 'survey',
            title: t('sections.surveying'),
            icon: Map,
            color: 'bg-amber-500',
            link: '/surveying',
            count: getProjectsByType('surveying').length
        },
        {
            id: 'electrical',
            title: t('sections.electrical'),
            icon: Zap,
            color: 'bg-yellow-500',
            link: '/electrical',
            count: getProjectsByType('electrical').length
        },
        {
            id: 'mechanical',
            title: t('sections.mechanical'),
            icon: Building,
            color: 'bg-orange-500',
            link: '/mechanical',
            count: getProjectsByType('mechanical').length
        },
    ];

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold text-slate-800 mb-2">{t('app.dashboard')}</h2>
                <p className="text-slate-500">{t('app.welcome_message')}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {sections.map((section) => (
                    <Link
                        key={section.id}
                        to={section.link}
                        className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm border border-slate-100 hover:shadow-xl transition-all duration-300"
                    >
                        <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/0 to-white/20 translate-x-8 -translate-y-8 rounded-full`} />

                        <div className="flex items-center justify-between mb-4">
                            <div className={`p-3 rounded-xl ${section.color} text-white shadow-lg group-hover:scale-110 transition-transform`}>
                                <section.icon className="w-6 h-6" />
                            </div>
                            <span className="text-3xl font-bold text-slate-700">{section.count}</span>
                        </div>

                        <h3 className="text-lg font-bold text-slate-800 mb-1 group-hover:text-brand-600 transition-colors">
                            {section.title}
                        </h3>
                        <p className="text-slate-400 text-sm">{t('actions.view')}</p>
                    </Link>
                ))}
            </div>

            <div className="bg-gradient-to-r from-brand-600 to-brand-800 rounded-2xl p-8 text-white relative overflow-hidden">
                <div className="relative z-10">
                    <h3 className="text-xl font-bold mb-2">{t('app.need_help')}</h3>
                    <p className="mb-4 text-brand-100 max-w-lg">{t('app.need_help_desc')}</p>
                    <div className="flex gap-3">
                        <button
                            onClick={openSupport}
                            className="px-4 py-2 bg-white text-brand-700 rounded-lg font-medium hover:bg-brand-50 transition-colors"
                        >
                            {t('app.contact_support')}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
