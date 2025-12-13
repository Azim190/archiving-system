import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Building2, Ruler, Map, Zap, Building, Search, Phone, User, Calendar, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useOutletContext } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useProjects, type Project } from '../contexts/ProjectContext';

interface DashboardContext {
    openSupport: () => void;
}

export const Dashboard = () => {
    const { t } = useTranslation();
    const { openSupport } = useOutletContext<DashboardContext>();
    const { projects, getProjectsByType } = useProjects();
    const [searchQuery, setSearchQuery] = useState('');

    const { user } = useAuth(); // Import user

    const allSections = [ // Rename to allSections
        {
            id: 'arch',
            title: t('sections.architectural'),
            icon: Building2,
            color: 'bg-blue-500',
            link: '/architectural',
            count: getProjectsByType('architectural').length,
            sectionId: 'architectural' // Add sectionId for mapping
        },
        {
            id: 'struct',
            title: t('sections.structural'),
            icon: Ruler,
            color: 'bg-emerald-500',
            link: '/structural',
            count: getProjectsByType('structural').length,
            sectionId: 'structural'
        },
        {
            id: 'survey',
            title: t('sections.surveying'),
            icon: Map,
            color: 'bg-amber-500',
            link: '/surveying',
            count: getProjectsByType('surveying').length,
            sectionId: 'surveying'
        },
        {
            id: 'electrical',
            title: t('sections.electrical'),
            icon: Zap,
            color: 'bg-yellow-500',
            link: '/electrical',
            count: getProjectsByType('electrical').length,
            sectionId: 'electrical'
        },
        {
            id: 'mechanical',
            title: t('sections.mechanical'),
            icon: Building,
            color: 'bg-orange-500',
            link: '/mechanical',
            count: getProjectsByType('mechanical').length,
            sectionId: 'mechanical'
        },
    ];

    const sections = allSections.filter(section => {
        if (!user) return false;
        if (user.role === 'admin') return true;
        return section.sectionId === user.section?.toLowerCase();
    });

    const filteredProjects = projects.filter(project => {
        if (!searchQuery) return false;
        const query = searchQuery.toLowerCase();
        return (
            project.client.toLowerCase().includes(query) ||
            (project.clientPhone?.includes(query))
        );
    });

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-slate-800 mb-2">{t('app.dashboard')}</h2>
                    <p className="text-slate-500">{t('app.welcome_message')}</p>
                </div>

                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder={t('actions.search')}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all shadow-sm"
                    />
                </div>
            </div>

            {searchQuery ? (
                <div className="space-y-6">
                    <h3 className="text-xl font-bold text-slate-800">
                        Search Results ({filteredProjects.length})
                    </h3>

                    {filteredProjects.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredProjects.map((project) => (
                                <div key={project.id} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-lg transition-all">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="p-3 rounded-xl bg-brand-50 text-brand-600">
                                            <Building2 className="w-6 h-6" />
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600`}>
                                            {t(`sections.${project.type}`)}
                                        </span>
                                    </div>

                                    <h3 className="text-lg font-bold text-slate-800 mb-2">{project.name}</h3>

                                    <div className="space-y-3 text-sm text-slate-500">
                                        <div className="flex items-center gap-2">
                                            <User className="w-4 h-4" />
                                            <span>{project.client}</span>
                                        </div>
                                        {project.clientPhone && (
                                            <div className="flex items-center gap-2">
                                                <Phone className="w-4 h-4" />
                                                <span>{project.clientPhone}</span>
                                            </div>
                                        )}
                                        <div className="flex items-center gap-2">
                                            <MapPin className="w-4 h-4" />
                                            <span>{project.location}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Calendar className="w-4 h-4" />
                                            <span>{project.year}</span>
                                        </div>
                                    </div>

                                    {project.oneDriveLink && (
                                        <a
                                            href={project.oneDriveLink}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="mt-6 block w-full py-2 text-center bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors"
                                        >
                                            View Files
                                        </a>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 bg-slate-50 rounded-2xl">
                            <Search className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                            <p className="text-slate-500">No projects found matching "{searchQuery}"</p>
                        </div>
                    )}
                </div>
            ) : (
                <>
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
                </>
            )}
        </div>
    );
};
