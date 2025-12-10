import React, { createContext, useContext, useState, useEffect } from 'react';

// Define Project Types
export type ProjectType = 'architectural' | 'structural' | 'surveying' | 'electrical' | 'mechanical';

export interface Project {
    id: string;
    name: string;
    client: string;
    location: string;
    year: string;
    type: ProjectType;
    clientPhone?: string;
    oneDriveLink?: string;
    imageUrl?: string;
    createdAt: string;
}

interface ProjectContextType {
    projects: Project[];
    addProject: (project: Omit<Project, 'id' | 'createdAt'>) => void;
    updateProject: (id: string, updates: Partial<Project>) => void;
    deleteProject: (id: string) => void;
    getProjectsByType: (type: ProjectType) => Project[];
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

// Define API URL - Use current window location to determine host if possible, or fallback manually
// Define API URL - Use relative path for production (Hostinger) which acts as same-origin
const API_URL = import.meta.env.PROD ? '/api/projects' : `http://${window.location.hostname}:3001/api/projects`;

export const ProjectProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [error, setError] = useState<string | null>(null);

    // Load from API on mount
    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            const response = await fetch(API_URL);
            if (!response.ok) throw new Error('Failed to fetch projects');
            const data = await response.json();
            setProjects(data);
        } catch (err) {
            console.error(err);
            setError('Failed to load projects');
        }
    };

    const addProject = async (projectData: Omit<Project, 'id' | 'createdAt'>) => {
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...projectData,
                    createdAt: new Date().toISOString()
                })
            });
            if (!response.ok) throw new Error('Failed to create project');
            const newProject = await response.json();
            setProjects(prev => [...prev, newProject]);
        } catch (err) {
            console.error(err);
            setError('Failed to add project');
        }
    };

    const updateProject = async (id: string, updates: Partial<Project>) => {
        try {
            // Optimistic update
            const oldProjects = [...projects];
            setProjects(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));

            const response = await fetch(`${API_URL}/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updates)
            });

            if (!response.ok) {
                // Revert on failure
                setProjects(oldProjects);
                throw new Error('Failed to update project');
            }
        } catch (err) {
            console.error(err);
            setError('Failed to update project');
        }
    };

    const deleteProject = async (id: string) => {
        try {
            // Optimistic deletion
            const oldProjects = [...projects];
            setProjects(prev => prev.filter(p => p.id !== id));

            const response = await fetch(`${API_URL}/${id}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                setProjects(oldProjects);
                throw new Error('Failed to delete project');
            }
        } catch (err) {
            console.error(err);
            setError('Failed to delete project');
        }
    };

    const getProjectsByType = (type: ProjectType) => {
        return projects.filter(p => p.type === type);
    };

    return (
        <ProjectContext.Provider value={{ projects, addProject, updateProject, deleteProject, getProjectsByType }}>
            {children}
        </ProjectContext.Provider>
    );
};

export const useProjects = () => {
    const context = useContext(ProjectContext);
    if (context === undefined) {
        throw new Error('useProjects must be used within a ProjectProvider');
    }
    return context;
};
