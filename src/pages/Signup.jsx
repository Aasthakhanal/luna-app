import { useState } from "react";
import { useSignupMutation } from "../app/authApi";
import { useDispatch } from "react-redux";
import { setCredentials } from "../features/auth/authSlice";
import { Eye, EyeOff } from "lucide-react";
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
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { jwtDecode } from "jwt-decode";
import logo from "../assets/lunaa.png";
import { useNavigate } from "react-router-dom";


const signupFormSchema = z
  .object({
    name: z.string(),
    email: z.string().email(),
    phone_number: z.string().regex(/^\+?[0-9]{10,15}$/, "Enter a valid number"),
    password: z
      .string()
      .min(8, "Password must be atleast 8 characters")
      .regex(
        /(?=.*[A-Z])(?=.*\d)/,
        "Password must have one uppercase letter & one number"
      ),
    confirm_password: z.string(),
    role: z.enum(["USER", "ADMIN"]).default("USER"),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
  });

const Signup = () => {
  const signupFormComponent = useForm({
    resolver: zodResolver(signupFormSchema),
    defaultValues: {
      role: "USER",
    },
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");

  const dispatch = useDispatch();

  const [signup, { isLoading }] = useSignupMutation();
  const navigate = useNavigate();

  const handleSignup = async (values) => {
    setError("");

    try {
      const response = await signup({
        name: values.name,
        email: values.email,
        phone_number: values.phone_number,
        password: values.password,
        role: values.role,
      }).unwrap();
      const decodedResponse = response ? jwtDecode(response?.token) : null;
      const userId = decodedResponse?.user_id;
      dispatch(setCredentials({ user: userId, token: response?.token }));
      navigate("/login");
    } catch (err) {
      setError(err.data?.message || "Signup failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md border border-accent-dark">
        {/* App Logo */}
        <div className="flex items-center justify-center h-20 w-auto mb-1">
          <img src={logo} alt="App Logo" className="h-20" />
        </div>

        {/* Welcome Heading */}
        <h2 className="text-2xl font-bold text-center text-primary mb-1">
          Create Account
        </h2>
        <p className="text-sm text-neutral-dark text-center mb-6">
          Sign up to get started with your new account
        </p>
        {/* Signup Form */}
        <Form {...signupFormComponent}>
          <form
            onSubmit={signupFormComponent.handleSubmit(handleSignup)}
            className="space-y-4"
          >
            <FormField
              control={signupFormComponent.control}
              name="name"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="John Doe"
                      value={field?.value ?? ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={signupFormComponent.control}
              name="email"
              render={({ field }) => (
                <FormItem className="w-full">
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
              control={signupFormComponent.control}
              name="phone_number"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="+9779XXXXXXXX"
                      value={field?.value ?? ""}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={signupFormComponent.control}
              name="role"
              render={({ field }) => (
                <input type="hidden" value="USER" {...field} />
              )}
            />

            <FormField
              control={signupFormComponent.control}
              name="password"
              render={({ field }) => (
                <FormItem className="w-full">
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
            <FormField
              control={signupFormComponent.control}
              name="confirm_password"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        {...field}
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="********"
                        value={field?.value ?? ""}
                      />
                      <Button
                        className="absolute inset-y-0 right-2 flex items-center text-sm text-neutral-dark cursor-pointer"
                        variant="link"
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                      >
                        {showConfirmPassword ? <EyeOff /> : <Eye />}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Error Message */}
            {error && (
              <div className="text-red-500 text-sm text-center">{error}</div>
            )}
            {/* Sign Up Button */}
            <Button disabled={isLoading} className="w-full text-white">
              {isLoading ? "Creating Account..." : "Create Account"}
             
            </Button>
          </form>
        </Form>
        {/* Sign In Link */}
        <div className="mt-4 text-center">
          <p className="text-sm text-neutral-dark">
            Already have an account?{" "}
            <a href="/login" className="text-primary hover:underline">
              Sign in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
