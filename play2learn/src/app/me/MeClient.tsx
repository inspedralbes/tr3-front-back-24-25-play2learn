"use client"
import React, { useState, useRef, useContext, useEffect } from 'react';
import { Camera, Save, Lock, Eye, EyeOff } from 'lucide-react';
import { AuthenticatorContext } from '@/contexts/AuthenticatorContext';
import { useRouter } from "next/navigation";
import { NavBarContext } from '@/contexts/NavBarContext';
import { apiRequest } from '@/services/communicationManager/apiRequest';

interface User {
    profile_pic: string;
    username: string;
    name: string;
    email: string;
}

export const ProfileEditor = () => {
    const { user, token, isAuthenticated, setUser, authUser } = useContext(AuthenticatorContext);
    const router = useRouter();
    const [userData, setUserData] = useState<User>(user || {} as User);
    const [imageUrl, setImageUrl] = useState(user?.profile_pic);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const {setActiveSection, showLoader, hideLoader} = useContext(NavBarContext);

    useEffect(() => {
        if (!isAuthenticated) {
            router.push("/authenticate/login");
            return;
        }
        setActiveSection('me');
        console.log(user)
        
    }, [isAuthenticated, router])
    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file && (file.type === "image/png" || file.type === "image/jpeg")) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const result = reader.result as string;
                setImageUrl(result);
                setUserData({ ...userData, profile_pic: result });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setImageUrl(event.target.value);
        setUserData({ ...userData, profile_pic: event.target.value });
    };

    const handleSubmit = async(e: React.FormEvent) => {
        e.preventDefault();
        showLoader();
        const saveData = {
            ...userData,
            ...(isChangingPassword && currentPassword && newPassword
                ? { password: { current: currentPassword, new: newPassword } }
                : {})
        };

        console.log(saveData)
        const response = await apiRequest('/user/update', "POST", saveData);
        if(response.status==='success')
        {
            console.log(response.user)
            authUser(response.user, token || "");
        }
        hideLoader();
    
    };

    return (
        <div className="min-h-screen  py-12 px-4 sm:px-6 lg:px-8">
            <div className=" mx-auto">
                <form onSubmit={handleSubmit} className=" p-8 ">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-white">Editar Perfil</h2>
                    </div>

                    <div className="space-y-8">
                        {/* Top Section: Profile Picture and Basic Info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Left Column: Profile Picture and Image URL */}
                            <div className="space-y-4">
                                <div className="flex flex-col items-center">
                                    <div className="relative mb-4">
                                        <img
                                            src={imageUrl}
                                            alt="Profile"
                                            className="w-40 h-40 rounded-full object-cover border-4 border-purple-500/30"
                                            onError={(e) => {
                                                e.currentTarget.src = "https://images.unsplash.com/photo-1494790108377-be9c29b29330";
                                            }}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => fileInputRef.current?.click()}
                                            className="absolute bottom-2 right-2 bg-purple-500 p-2 rounded-full text-white hover:bg-purple-600 transition-colors"
                                        >
                                            <Camera className="w-5 h-5" />
                                        </button>
                                    </div>
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleImageChange}
                                        accept="image/png,image/jpeg"
                                        className="hidden"
                                    />
                                    <div className="w-full">
                                        <label className="block text-sm font-medium text-white/80 mb-1">
                                            URL de imagen
                                        </label>
                                        <input
                                            type="url"
                                            value={imageUrl}
                                            onChange={handleUrlChange}
                                            className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                            placeholder="https://ejemplo.com/imagen.jpg"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Right Column: Username and Full Name */}
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-white/80 mb-1">
                                        Nombre de usuario
                                    </label>
                                    <input
                                        type="text"
                                        value={userData.username}
                                        onChange={(e) => setUserData({ ...userData, username: e.target.value })}
                                        className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-white/80 mb-1">
                                        Nombre completo
                                    </label>
                                    <input
                                        type="text"
                                        value={userData.name}
                                        onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                                        className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Bottom Section: Email */}
                        <div className="max-w-2xl">
                            <label className="block text-sm font-medium text-white/80 mb-1">
                                Email
                            </label>
                            <input
                                type="email"
                                value={userData.email}
                                onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                        </div>

                        {/* Password Section */}
                        <div className="max-w-2xl border-t border-white/10 pt-6">
                            <button
                                type="button"
                                onClick={() => setIsChangingPassword(!isChangingPassword)}
                                className="flex items-center cursor-pointer gap-2 text-white/80 hover:text-white transition-colors"
                            >
                                <Lock className="w-4 h-4" />
                                <span>Cambiar contraseña</span>
                            </button>

                            {isChangingPassword && (
                                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-white/80 mb-1">
                                            Contraseña actual
                                        </label>
                                        <div className="relative">
                                            <input
                                                type={showCurrentPassword ? "text" : "password"}
                                                value={currentPassword}
                                                onChange={(e) => setCurrentPassword(e.target.value)}
                                                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 pr-10"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                                className="absolute right-2 top-1/2 -translate-y-1/2 text-white/60 hover:text-white/80 transition-colors"
                                            >
                                                {showCurrentPassword ? (
                                                    <EyeOff className="w-5 h-5" />
                                                ) : (
                                                    <Eye className="w-5 h-5" />
                                                )}
                                            </button>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-white/80 mb-1">
                                            Nueva contraseña
                                        </label>
                                        <div className="relative">
                                            <input
                                                type={showNewPassword ? "text" : "password"}
                                                value={newPassword}
                                                onChange={(e) => setNewPassword(e.target.value)}
                                                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 pr-10"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowNewPassword(!showNewPassword)}
                                                className="absolute right-2 top-1/2 -translate-y-1/2 text-white/60 hover:text-white/80 transition-colors"
                                            >
                                                {showNewPassword ? (
                                                    <EyeOff className="w-5 h-5" />
                                                ) : (
                                                    <Eye className="w-5 h-5" />
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Save Button */}
                        <div className="flex justify-end pt-4">
                            <button
                                type="submit"
                                className="flex items-center gap-2 cursor-pointer px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl text-white font-semibold shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl hover:from-purple-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-purple-900"
                            >
                                <Save className="w-5 h-5" />
                                Guardar cambios
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};