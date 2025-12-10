import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
    id: string;
    name: string;
    email: string;
}

interface AuthContextType {
    user: User | null;
    login: (email: string) => void;
    logout: () => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);

    // Mock login - in real app this would call API
    const login = (email: string) => {
        setUser({
            id: '1',
            name: 'Admin User',
            email: email
        });
        localStorage.setItem('user', JSON.stringify({ email }));
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
    };

    // Check locally stored user on boot
    useEffect(() => {
        const stored = localStorage.getItem('user');
        if (stored) {
            setUser({ id: '1', name: 'Admin User', email: JSON.parse(stored).email });
        }
    }, []);

    return (
        <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
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
