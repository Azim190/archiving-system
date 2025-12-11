import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Search, FileText, Trash2, Edit2, Cloud } from 'lucide-react';
import { useProjects } from '../contexts/ProjectContext';
import type { ProjectType, Project } from '../contexts/ProjectContext';

interface ProjectsPageProps {
    title: string;
    type: ProjectType;
}

export const ProjectsPage: React.FC<ProjectsPageProps> = ({ title, type }) => {
    const { t } = useTranslation();
    const { getProjectsByType, deleteProject, addProject, updateProject } = useProjects();
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProject, setEditingProject] = useState<Project | null>(null);

    const projects = getProjectsByType(type).filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.clientPhone?.includes(searchTerm)
    );

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        client: '',
        location: '',
        year: new Date().getFullYear().toString(),
        oneDriveLink: '',
        clientPhone: ''
    });

    const handleOpenModal = (project?: Project) => {
        if (project) {
            setEditingProject(project);
            setFormData({
                name: project.name,
                client: project.client,
                location: project.location,
                year: project.year,
                oneDriveLink: project.oneDriveLink || '',
                clientPhone: project.clientPhone || ''
            });
        } else {
            setEditingProject(null);
            setFormData({
                name: '',
                client: '',
                location: '',
                year: new Date().getFullYear().toString(),
                oneDriveLink: '',
                clientPhone: ''
            });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const payload = {
            ...formData,
            type
        };

        if (editingProject) {
            updateProject(editingProject.id, payload);
        } else {
            addProject(payload);
        }
        setIsModalOpen(false);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">{title}</h2>
                    <p className="text-slate-500 text-sm">Manage your archived projects</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="btn-primary flex items-center gap-2"
                >
                    <Plus className="w-4 h-4" />
                    <span>{t('actions.add_project')}</span>
                </button>
            </div>

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 rtl:left-auto rtl:right-3" />
                <input
                    type="text"
                    placeholder={t('actions.search')}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none transition-all rtl:pl-4 rtl:pr-10"
                />
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.length === 0 ? (
                    <div className="col-span-full py-12 text-center text-slate-400 bg-white rounded-xl border border-dashed border-slate-300">
                        <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                        <p>No projects found. Add one to get started.</p>
                    </div>
                ) : (
                    projects.map((project) => (
                        <div key={project.id} className="card-hover p-6 flex flex-col group">
                            <div className="flex items-start justify-between mb-4">
                                <div className="w-10 h-10 rounded-lg bg-brand-50 flex items-center justify-center text-brand-600 font-bold">
                                    {project.name.charAt(0)}
                                </div>
                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => handleOpenModal(project)}
                                        className="p-2 text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors"
                                    >
                                        <Edit2 className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => deleteProject(project.id)}
                                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            <h3 className="text-lg font-bold text-slate-800 mb-1 line-clamp-1">{project.name}</h3>
                            <p className="text-slate-500 text-sm mb-4">{project.client}</p>

                            <div className="space-y-2 mb-6">
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-400">Location</span>
                                    <span className="text-slate-700 font-medium">{project.location}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-400">Year</span>
                                    <span className="text-slate-700 font-medium">{project.year}</span>
                                </div>

                            </div>

                            <div className="mt-auto pt-4 border-t border-slate-100 flex gap-2">
                                {project.oneDriveLink ? (
                                    <a
                                        href={project.oneDriveLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex-1 flex items-center justify-center gap-2 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
                                    >
                                        <Cloud className="w-4 h-4" />
                                        Download Files
                                    </a>
                                ) : (
                                    <span className="flex-1 py-2 text-center text-slate-400 text-sm bg-slate-50 rounded-lg">No Link</span>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Modal */}
            {
                isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                        <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                                <h3 className="text-xl font-bold text-slate-800">
                                    {editingProject ? 'Edit Project' : t('actions.add_project')}
                                </h3>
                                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">×</button>
                            </div>

                            <form onSubmit={handleSubmit} className="p-6 space-y-4">
                                <div>
                                    <label className="text-sm font-medium text-slate-700 block mb-1">Project Name</label>
                                    <input
                                        required
                                        className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-brand-200 outline-none"
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-medium text-slate-700 block mb-1">Client</label>
                                        <input
                                            required
                                            className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-brand-200 outline-none"
                                            value={formData.client}
                                            onChange={e => setFormData({ ...formData, client: e.target.value })}
                                        />

                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-slate-700 block mb-1">{t('actions.client_phone')}</label>
                                        <input
                                            className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-brand-200 outline-none"
                                            value={formData.clientPhone}
                                            onChange={e => setFormData({ ...formData, clientPhone: e.target.value })}
                                            placeholder="05..."
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-slate-700 block mb-1">Year</label>
                                        <input
                                            required
                                            type="number"
                                            className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-brand-200 outline-none"
                                            value={formData.year}
                                            onChange={e => setFormData({ ...formData, year: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="text-sm font-medium text-slate-700 block mb-1">Location</label>
                                    <input
                                        required
                                        className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-brand-200 outline-none"
                                        value={formData.location}
                                        onChange={e => setFormData({ ...formData, location: e.target.value })}
                                    />
                                </div>

                                <div>
                                    <label className="text-sm font-medium text-slate-700 block mb-1">Download Files Link (Optional)</label>
                                    <input
                                        type="url"
                                        className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-brand-200 outline-none"
                                        value={formData.oneDriveLink}
                                        onChange={e => setFormData({ ...formData, oneDriveLink: e.target.value })}
                                        placeholder="https://..."
                                    />
                                </div>

                                <div className="pt-4 flex justify-end gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className="px-4 py-2 text-slate-600 hover:bg-slate-50 rounded-lg font-medium"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="btn-primary"
                                    >
                                        {editingProject ? 'Save Changes' : 'Create Project'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )
            }
        </div >
    );
};
