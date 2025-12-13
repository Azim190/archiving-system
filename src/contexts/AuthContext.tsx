import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
    id: string;
    name: string;
    id_number: string;
    role: 'admin' | 'user';
    section?: string;
}

interface AuthContextType {
    user: User | null;
    login: (name: string, idNumber: string) => Promise<boolean>;
    logout: () => void;
    isAuthenticated: boolean;
    error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [error, setError] = useState<string | null>(null);

    const login = async (name: string, idNumber: string): Promise<boolean> => {
        try {
            setError(null);
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, idNumber }),
            });

            const text = await response.text();

            let data;
            try {
                data = text ? JSON.parse(text) : {};
            } catch (e) {
                console.error('Failed to parse login response:', text);
                throw new Error('Server returned invalid response');
            }

            if (!response.ok) {
                throw new Error(data.error || `Login failed (${response.status})`);
            }

            setUser(data);
            localStorage.setItem('user', JSON.stringify(data));
            return true;
        } catch (err: any) {
            console.error('Login error:', err);
            setError(err.message);
            return false;
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
    };

    // Check locally stored user on boot
    useEffect(() => {
        const stored = localStorage.getItem('user');
        if (stored) {
            setUser(JSON.parse(stored));
        }
    }, []);

    return (
        <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user, error }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
