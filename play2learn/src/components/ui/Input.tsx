import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    icon?: React.ComponentType<{ className?: string }>;
    iconClick?: () => void;
}

function Input({ icon: Icon, iconClick, className = "", ...props }: InputProps) {
    if (Icon) {
        return (
            <div className="relative">
                <div 
                    className="absolute inset-y-0 left-0 pl-3 flex items-center"
                    onClick={iconClick}
                    style={{ cursor: iconClick ? 'pointer' : 'default' }}
                >
                    <Icon className="h-5 w-5 text-indigo-400" />
                </div>
                <input
                    {...props}
                    className={`w-full pl-10 pr-4 py-3 bg-indigo-900/30 border border-indigo-700 rounded-lg text-white placeholder-indigo-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${className}`}
                />
            </div>
        );
    }
    return (
        <input
            {...props}
            className={`w-full pl-4 pr-4 py-3 bg-indigo-900/30 border border-indigo-700 rounded-lg text-white placeholder-indigo-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${className}`}
        />
    );
}

export default Input;
