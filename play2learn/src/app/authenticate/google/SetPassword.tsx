"use client";

import {UserPlus, Search, User, Eye, EyeOff, Loader2} from "lucide-react";
import {useEffect, useState, useContext} from "react";
import Input from "@/components/ui/Input";
import {apiRequest} from "@/services/communicationManager/apiRequest";
import {useRouter} from "next/navigation";
import {AuthenticatorContext} from "@/contexts/AuthenticatorContext";

function SetPassword() {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError('Las contraseñas no coinciden');
            return;
        }
        console.log("Contra", password, confirmPassword)

        const response = await fetch('http://localhost:8000/api/auth/google/save-password', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password, password_confirmation: confirmPassword }),
        });

        const data = await response.json();
        if (data.status === 'success') {
            alert('Contraseña guardada con éxito');
            window.location.href = '/';
        } else {
            setError(data.message);
            console.log("ERROR", data.message)
        }
    };

    return (
        <div>
            <h2>Introduce tu contraseña</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <input
                    type="password"
                    placeholder="Contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Confirmar contraseña"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <button type="submit">Guardar contraseña</button>
            </form>
        </div>
    );
}

export default SetPassword;
