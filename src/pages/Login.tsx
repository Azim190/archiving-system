import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import { Building2, ArrowRight, ArrowLeft } from 'lucide-react';

import logo from '../assets/logo.png';

export const Login = () => {
    const [name, setName] = useState('');
    const [idNumber, setIdNumber] = useState('');

    const { login, error: authError } = useAuth();
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();

    const [localError, setLocalError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLocalError('');

        const success = await login(name, idNumber);
        if (success) {
            navigate('/');
        } else {
            // AuthContext handles setting its own error, but we can sync local state if needed
            // Or just rely on authError. For now, let's assume authError is sufficient but we might want to clear inputs?
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
                        <h2 className="text-lg md:text-2xl font-bold text-white mb-2">{t('app.title')}</h2>
                        <p className="text-brand-100 text-sm">Engineering Consultants</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    {(authError || localError) && (
                        <div className="p-3 text-sm text-red-500 bg-red-50 border border-red-100 rounded-lg">
                            {authError || localError}
                        </div>
                    )}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Name
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none transition-all"
                            placeholder="Type your name"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            ID Number
                        </label>
                        <input
                            type="text" // Changed to text to avoid spinner on some browsers, or allow leading zeros
                            value={idNumber}
                            onChange={(e) => setIdNumber(e.target.value)}
                            className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none transition-all"
                            placeholder="Enter your ID number"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-brand-600 text-white py-3 rounded-lg font-semibold hover:bg-brand-700 transition-colors flex items-center justify-center gap-2 group"
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
