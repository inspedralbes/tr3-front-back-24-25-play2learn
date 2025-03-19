"use client";

import {UserPlus, Search, User, Eye, EyeOff, Loader2} from "lucide-react";
import {useEffect, useState, useContext} from "react";
import Input from "@/components/ui/Input";
import {apiRequest} from "@/services/communicationManager/apiRequest";
import {useRouter} from "next/navigation";
import {AuthenticatorContext} from "@/contexts/AuthenticatorContext";
import {useTranslation} from "@/hooks/useTranslation";
import Link from "next/link";

function LoginClientComponent() {
    const router = useRouter();
    const {authUser} = useContext(AuthenticatorContext);
    const {t} = useTranslation();

    interface User {
        user: string;
        password: string;
    }

    interface Error {
        user: string;
        password: string;
    }


    const [user, setUser] = useState<User>({
        user: "",
        password: "",
    });
    const [error, setError] = useState<Error>({
        user: "",
        password: "",
    });
    const [loginError, setLoginError] = useState("");

    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setUser((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const fields: (keyof User)[] = ['user', 'password'];

    const verifyFields = () => {
        let hasErrors = false;

        fields.forEach((field) => {
            if (user[field] === '') {
                hasErrors = true;
                setError((prev) => ({
                    ...prev,
                    [field]: t('authenticate.field_required'),
                }));
            } else {
                setError((prev) => ({
                    ...prev,
                    [field]: "",
                }));
            }
        });

        return !hasErrors;
    }

    const handleLogin = async () => {
        try {
            setIsLoading(true);
            const isValid = verifyFields();
            if (!isValid) {
                setIsLoading(false);
                return;
            }
            const response = await apiRequest("/auth/login", "POST", user);
            console.log(response);
            if (response.status === 'success') {
                const {user, token} = response;
                authUser(user, token);
                router.push('/');
            } else {
                setLoginError(response.message);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }

    };

    const singInGoogle = async () => {
        try {

            window.location.href = "http://127.0.0.1:8000/api/auth/google/redirect";

        } catch (error) {
            console.log(error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen text-gray-900 flex justify-center">
            <div
                className="bg-indigo-800/60 rounded-xl border border-indigo-700 max-w-screen-xl m-0 sm:m-10 shadow sm:rounded-lg flex justify-center flex-1">
                <div className="lg:w-1/2 xl:w-5/12 p-6 sm:p-12">
                    {/* <div>
                        <img src="https://storage.googleapis.com/devitary-image-host.appspot.com/15846435184459982716-LogoMakr_7POjrN.png"
                            className="w-32 mx-auto" alt="Logo" />
                    </div> */}
                    <div className="mt-12 flex flex-col items-center">
                        <h1 className="text-2xl xl:text-3xl font-extrabold">{t('authenticate.login')}</h1>
                        <div className="w-full flex-1 mt-8">
                            <div className="flex flex-col items-center">
                                <button
                                    className="w-full max-w-xs font-bold shadow-sm rounded-lg py-1 bg-indigo-100 text-gray-800 flex items-center justify-center transition-all duration-300 ease-in-out focus:outline-none hover:shadow focus:shadow-sm focus:shadow-outline"
                                    onClick={singInGoogle}>
                                    <div className="bg-white p-1 rounded-full">
                                        <img src="/img/google.svg" alt="Google"/>
                                    </div>
                                    <span className="ml-4">{t('authenticate.login_google')}</span>
                                </button>

                                <button
                                    className="w-full max-w-xs font-bold shadow-sm rounded-lg py-1 bg-indigo-100 text-gray-800 flex items-center justify-center transition-all duration-300 ease-in-out focus:outline-none hover:shadow focus:shadow-sm focus:shadow-outline mt-5">
                                    <div className="bg-white p-1 rounded-full">
                                        <img src="/img/github.svg" alt="GitHub"/>
                                    </div>
                                    <span className="ml-4">{t('authenticate.login_github')}</span>
                                </button>
                            </div>

                            <div className="my-10 border-b border-indigo-700 text-center">
                                <div
                                    className="leading-none px-2 inline-block text-sm text-white tracking-wide font-medium bg-indigo-800/60 transform translate-y-1/2">
                                    {t('authenticate.or_sign_up_with_email')}
                                </div>
                            </div>

                            <div className="mx-auto max-w-xs">

                                <div className="">
                                    <Input name="user"
                                           placeholder={t('authenticate.user_placeholder')}
                                           type="text"
                                           onChange={handleInputChange}
                                           value={user.user}
                                           icon={User}
                                    />
                                </div>
                                {error.user && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {error.user}
                                    </p>
                                )}
                                <div className="mt-5">
                                    <Input name="password"
                                           placeholder={t('authenticate.password_placeholder')}
                                           type={showPassword ? "text" : "password"}
                                           onChange={handleInputChange}
                                           value={user.password}
                                           icon={showPassword ? EyeOff : Eye}
                                           iconClick={() => setShowPassword(!showPassword)}
                                    />
                                </div>
                                {error.password && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {error.password}
                                    </p>
                                )}
                                {loginError && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {loginError}
                                    </p>
                                )}
                                <button
                                    className="mt-5 tracking-wide font-semibold bg-indigo-500 text-gray-100 w-full py-2 rounded-lg hover:bg-indigo-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none"
                                    onClick={handleLogin}
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <Loader2 size={24} className="animate-spin -ml-2"/>
                                    ) : (
                                        <UserPlus size={24} className="-ml-2"/>
                                    )}
                                    <span className="ml-3">
                    {isLoading ? t('authenticate.logging_in') : t('authenticate.login')}
                  </span>
                                </button>
                                <div className="mt-6 flex flex-col space-y-3">
                                    <div
                                        className="text-sm text-gray-600 text-center flex justify-center items-center gap-2">
                                        <span>{t('authenticate.no_account')}</span>
                                        <Link
                                            href="/authenticate/register"
                                            className="text-indigo-700 hover:text-indigo-900 font-semibold transition-colors duration-200"
                                        >
                                            {t('authenticate.create_account')}
                                        </Link>
                                    </div>
                                    <div className="text-sm text-gray-600 text-center">
                                        <Link
                                            href="/authenticate/forgot-password"
                                            className="text-indigo-700 hover:text-indigo-900 font-semibold transition-colors duration-200"
                                        >
                                            {t('authenticate.forgot_password_question')}
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex-1 bg-indigo-100 text-center hidden lg:flex">
                    <div
                        className="m-12 xl:m-16 w-full bg-contain bg-center bg-no-repeat"
                        style={{
                            backgroundImage:
                                "url('https://storage.googleapis.com/devitary-image-host.appspot.com/15848031292911696601-undraw_designer_life_w96d.svg')",
                        }}
                    ></div>
                </div>
            </div>
        </div>
    );
}

export default LoginClientComponent;

