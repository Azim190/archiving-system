import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import { Building2, ArrowRight, ArrowLeft } from 'lucide-react';

import logo from '../assets/logo.png';

export const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const { login } = useAuth();
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();

    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (email === 'abd.ibrahim@darmaaka.com' && password === '123456789') {
            login(email);
            navigate('/');
        } else {
            setError('Invalid email or password');
        }
    };

    const isRTL = i18n.dir() === 'rtl';

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
                <div className="bg-brand-600 p-8 text-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-brand-700/50 mix-blend-multiply"></div>
                    <div className="relative z-10 flex flex-col items-center">
                        <div className="w-24 h-24 bg-white rounded-2xl flex items-center justify-center mb-4 shadow-lg p-2">
                            <img src={logo} alt="Dar Makkah Logo" className="w-full h-full object-contain" />
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-2">{t('app.title')}</h2>
                        <p className="text-brand-100 text-sm">Engineering Consultants</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    {error && (
                        <div className="p-3 text-sm text-red-500 bg-red-50 border border-red-100 rounded-lg">
                            {error}
                        </div>
                    )}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            {t('auth.email')}
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none transition-all"
                            placeholder="abd.ibrahim@darmaaka.com"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            {t('auth.password')}
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none transition-all"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-brand-600 text-white py-3 rounded-lg font-semibold hover:g-brand-700 transition-colors flex items-center justify-center gap-2 group"
                    >
                        <span>{t('auth.signin')}</span>
                        {isRTL ?
                            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" /> :
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        }
                    </button>
                </form>
            </div>
        </div>
    );
};
