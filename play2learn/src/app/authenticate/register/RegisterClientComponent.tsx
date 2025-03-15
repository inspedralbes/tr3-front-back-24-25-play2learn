"use client";
import { UserPlus, Eye, EyeOff, Search, Loader2, User2, Mail } from "lucide-react";
import { useEffect, useState } from "react";
import { apiRequest } from "@/services/communicationManager/apiRequest";
import { useRouter } from "next/navigation";
import Input from "@/components/ui/Input";

function RegisterClientComponent() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  interface User {
    name: string;
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
  }

  interface Error {
    name: string;
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
  }

  const [error, setError] = useState<Error>({
    name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [user, setUser] = useState<User>({
    name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const verifyPassword = () => {
    if (user.password !== user.confirmPassword) {
      setError((prev) => ({
        ...prev,
        confirmPassword: "Las contraseñas no coinciden",
      }));
    } else {
      setError((prev) => ({
        ...prev,
        confirmPassword: "",
      }));
    }
  };

  useEffect(() => {
    verifyPassword();
  }, [user.password, user.confirmPassword]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // useEffect(()=>{
  //   console.log(user);
  // },[user]);

  const handleRegister = async () => {
    try {
      setIsLoading(true);
      const response = await apiRequest("/auth/register", "POST", user);
      console.log(response);
      if (response.status === 'success') {
        router.push('/');
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen text-gray-900 flex justify-center">
      <div className="bg-indigo-800/60 rounded-xl border border-indigo-700 max-w-screen-xl m-0 sm:m-10 flex justify-center flex-1">
        <div className="lg:w-1/2 xl:w-5/12 p-6 sm:p-12">
          <div className="mt-12 flex flex-col items-center">
            <h1 className="text-2xl xl:text-3xl font-extrabold text-white">Register</h1>
            <div className="w-full flex-1 mt-8">
              <div className="mx-auto max-w-xs">
                <div className="grid grid-cols-2 gap-4">
                  <Input name="name" placeholder="Nombre" type="text" onChange={handleInputChange} value={user.name} icon={User2} />
                  <Input name="username" placeholder="Username" type="text" onChange={handleInputChange} value={user.username} icon={Search} />
                </div>

                <div className="mt-5">
                  <Input name="email" 
                  placeholder="Email" 
                  type="email" 
                  onChange={handleInputChange} 
                  value={user.email} 
                  icon={Mail} 
                  />
                </div>
                <div className="mt-5">
                  <Input name="password" 
                    placeholder="Password" 
                    type={showPassword ? "text" : "password"} 
                    onChange={handleInputChange} 
                    value={user.password} 
                    icon={showPassword ? EyeOff : Eye} 
                    iconClick={() => setShowPassword(!showPassword)} 
                    />
                </div>
                <div className="mt-5">
                  <Input name="confirmPassword" 
                    placeholder="Confirm Password" 
                    type={showConfirmPassword ? "text" : "password"} 
                    onChange={handleInputChange} 
                    value={user.confirmPassword} 
                    icon={showConfirmPassword ? EyeOff : Eye} 
                    iconClick={() => setShowConfirmPassword(!showConfirmPassword)} 
                    />
                </div>
                {error.confirmPassword && (
                  <p className="text-red-500 text-sm mt-1">
                    {error.confirmPassword}
                  </p>
                )}

                <button
                  onClick={handleRegister}
                  disabled={isLoading}
                  className={`mt-5 tracking-wide font-semibold ${isLoading ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-500 hover:bg-indigo-700'
                    } text-gray-100 w-full py-2 rounded-lg transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none`}
                >
                  {isLoading ? (
                    <Loader2 size={24} className="animate-spin -ml-2" />
                  ) : (
                    <UserPlus size={24} className="-ml-2" />
                  )}
                  <span className="ml-3">
                    {isLoading ? 'Signing up...' : 'Sign Up'}
                  </span>
                </button>
                <p className="mt-6 text-xs text-white text-center">
                  I agree to abide by templatana's
                  <a
                    href="#"
                    className="border-b border-gray-500 border-dotted"
                  >
                    Terms of Service
                  </a>
                  and its
                  <a
                    href="#"
                    className="border-b border-gray-500 border-dotted"
                  >
                    Privacy Policy
                  </a>
                </p>
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

export default RegisterClientComponent;
