import { useState } from "react";
import { useLoginMutation } from "../app/authApi";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { setCredentials } from "../features/auth/authSlice";
import { jwtDecode } from "jwt-decode";
import logo from "../assets/lunaa.png";


const loginFormSchema = z.object({
  username: z.string().email(),
  password: z.string(),
});

const Login = () => {
  const [error, setError] = useState();
  const loginFormComponent = useForm({
    resolver: zodResolver(loginFormSchema),
  });
  const dispatch = useDispatch();

  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const [login, { data, isSuccess, isLoading, error: loginError }] =
    useLoginMutation();

  const handleLogin = async (values) => {
    try {
      const response = await login(values).unwrap();
      const decodedResponse = response ? jwtDecode(response?.token) : null;
      const userId = decodedResponse?.user_id;
      dispatch(setCredentials({ user: userId, token: response?.token }));
      navigate("/dashboard");
    } catch (err) {
      setError(err.data?.message || "Login failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md border border-accent-dark">
        {/* App Logo */}
        <div className="flex justify-center mb-2">
          <img
            src={logo}
            alt="App Logo"
            className="w-30 h-30"
          />
        </div>

        {/* Welcome Heading */}
        <h2 className="text-2xl font-bold text-center text-primary mb-1">
          Welcome Back
        </h2>
        <p className="text-sm text-neutral-dark text-center mb-6">
          Enter your credentials to sign in to your account{" "}
        </p>

        {/* Login Form */}
        <Form {...loginFormComponent}>
          <form
            onSubmit={loginFormComponent.handleSubmit(handleLogin)}
            className="space-y-4"
          >
            <FormField
              control={loginFormComponent.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="name@example.com"
                      value={field?.value ?? ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={loginFormComponent.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        {...field}
                        type={showPassword ? "text" : "password"}
                        placeholder="********"
                        value={field?.value ?? ""}
                      />
                      <Button
                        className="absolute inset-y-0 right-2 flex items-center text-sm text-neutral-dark cursor-pointer"
                        variant="link"
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff /> : <Eye />}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="text-sm text-primary flex justify-end">
              Forgot Password?
            </div>
            {/* Error Message */}
            {loginError && (
              <div className="text-red-500 text-sm text-center ">{error}</div>
            )}
            <Button className="w-full text-white" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
        </Form>

        {/* Sign Up Link */}
        <div className="mt-4 text-center">
          <p className="text-sm text-neutral-dark">
            Don't have an account?{" "}
            <a href="/signup" className="text-primary hover:underline">
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
