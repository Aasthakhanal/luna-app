import React, { useState, useEffect } from "react";
import {
  useForgotPasswordMutation,
  useVerifyResetOtpMutation,
  useResendResetOtpMutation,
  useResetPasswordMutation,
} from "../app/authApi";
import { Link, useNavigate } from "react-router-dom";
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
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Mail, Lock, KeyRound, CheckCircle } from "lucide-react";
import logo from "../assets/lunaa.png";
import { toast } from "sonner";

const emailSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

const otpSchema = z.object({
  otp: z.string().length(6, "OTP must be 6 digits"),
});

const passwordSchema = z.object({
  newPassword: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    ),
});

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [userId, setUserId] = useState(null);
  const [timeLeft, setTimeLeft] = useState(60);
  const [showPassword, setShowPassword] = useState(false);
  const [redirectTimer, setRedirectTimer] = useState(5);

  const [forgotPassword, { isLoading: isEmailLoading }] =
    useForgotPasswordMutation();
  const [verifyOtp, { isLoading: isOtpLoading }] = useVerifyResetOtpMutation();
  const [resendOtp, { isLoading: isResendLoading }] =
    useResendResetOtpMutation();
  const [resetPassword, { isLoading: isResetLoading }] =
    useResetPasswordMutation();

  const emailForm = useForm({
    resolver: zodResolver(emailSchema),
  });

  const otpForm = useForm({
    resolver: zodResolver(otpSchema),
  });

  const passwordForm = useForm({
    resolver: zodResolver(passwordSchema),
  });

  // Timer logic
  useEffect(() => {
    if (step !== 2 || timeLeft === 0) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [step, timeLeft]);

  // Redirect timer after password reset success
  useEffect(() => {
    if (step === 4 && redirectTimer > 0) {
      const interval = setInterval(() => {
        setRedirectTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else if (step === 4 && redirectTimer === 0) {
      navigate("/login");
    }
  }, [step, redirectTimer, navigate]);

  // Send Forgot Password
  const handleForgotPassword = async (values) => {
    try {
      const res = await forgotPassword(values.email).unwrap();
      toast.success(res.message);
      setEmail(values.email);
      setUserId(res.user_id);
      setTimeLeft(60);
      setStep(2);
    } catch (err) {
      toast.error(err.data?.message || "Something went wrong");
    }
  };

  // Verify OTP
  const handleVerifyOtp = async (values) => {
    try {
      const res = await verifyOtp({
        user_id: userId,
        otp: values.otp,
      }).unwrap();
      toast.success(res.message);
      setStep(3);
    } catch (err) {
      toast.error(err.data?.message || "Invalid OTP");
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    try {
      const res = await resendOtp(email).unwrap();
      toast.success(res.message);
      setTimeLeft(60);
    } catch (err) {
      toast.error(err.data?.message || "Resend failed");
    }
  };

  // Reset Password
  const handleResetPassword = async (values) => {
    try {
      const otpValue = otpForm.getValues("otp");
      const res = await resetPassword({
        email,
        otp: otpValue,
        newPassword: values.newPassword,
      }).unwrap();
      toast.success(res.message);
      setStep(4);
      setRedirectTimer(5); // Start 5-second countdown
    } catch (err) {
      toast.error(err.data?.message || "Reset failed");
    }
  };

  const renderStepIndicator = () => (
    <div className="flex justify-center mb-6">
      <div className="flex items-center space-x-2">
        {[1, 2, 3].map((stepNumber) => (
          <React.Fragment key={stepNumber}>
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                stepNumber <= step
                  ? "bg-primary text-white"
                  : "bg-gray-200 text-gray-600"
              }`}
            >
              {stepNumber < step ? "✓" : stepNumber}
            </div>
            {stepNumber < 3 && (
              <div
                className={`w-8 h-1 ${
                  stepNumber < step ? "bg-primary" : "bg-gray-200"
                }`}
              />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md border border-accent-dark">
        {/* App Logo */}
        <div className="flex justify-center mb-2">
          <img src={logo} alt="App Logo" className="w-30 h-30" />
        </div>

        {/* Step Indicator */}
        {step < 4 && renderStepIndicator()}

        {/* Step 1: Email */}
        {step === 1 && (
          <>
            <div className="text-center mb-6">
              <Mail className="w-12 h-12 text-primary mx-auto mb-3" />
              <h2 className="text-2xl font-bold text-primary mb-2">
                Reset Password
              </h2>
              <p className="text-sm text-neutral-dark">
                Enter your email address to receive a reset code
              </p>
            </div>

            <Form {...emailForm}>
              <form
                onSubmit={emailForm.handleSubmit(handleForgotPassword)}
                className="space-y-4"
              >
                <FormField
                  control={emailForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="email"
                          placeholder="name@example.com"
                          className="text-center"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button className="w-full text-white" disabled={isEmailLoading}>
                  {isEmailLoading ? "Sending..." : "Send Reset Code"}
                </Button>
              </form>
            </Form>

            <div className="mt-4 text-center">
              <Link
                to="/login"
                className="text-sm text-primary hover:underline"
              >
                Back to Login
              </Link>
            </div>
          </>
        )}

        {/* Step 2: OTP Verification */}
        {step === 2 && (
          <>
            <div className="text-center mb-8">
              <KeyRound className="w-16 h-16 text-primary mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-primary mb-3">
                Enter Reset Code
              </h2>
              <p className="text-base text-neutral-dark leading-relaxed">
                We've sent a 6-digit code to
              </p>
              <p className="text-base font-semibold text-primary mt-1">
                {email}
              </p>
            </div>

            <Form {...otpForm}>
              <form
                onSubmit={otpForm.handleSubmit(handleVerifyOtp)}
                className="space-y-6"
              >
                <FormField
                  control={otpForm.control}
                  name="otp"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="block text-center text-lg font-medium text-gray-700 mb-4">
                        Reset Code
                      </FormLabel>
                      <FormControl>
                        <div className="flex justify-center">
                          <InputOTP
                            maxLength={6}
                            value={field.value}
                            onChange={field.onChange}
                            className="gap-3"
                          >
                            <InputOTPGroup className="gap-3">
                              {[...Array(6)].map((_, index) => (
                                <InputOTPSlot
                                  key={index}
                                  index={index}
                                  className="w-14 h-14 text-2xl font-bold border-2 border-primary/30 rounded-lg bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 hover:border-primary/50"
                                />
                              ))}
                            </InputOTPGroup>
                          </InputOTP>
                        </div>
                      </FormControl>
                      <FormMessage className="text-center mt-2" />
                    </FormItem>
                  )}
                />
                <Button
                  className="w-full text-white py-3 text-lg font-semibold"
                  disabled={isOtpLoading}
                  size="lg"
                >
                  {isOtpLoading ? "Verifying..." : "Verify Code"}
                </Button>
              </form>
            </Form>

            <div className="mt-6 text-center">
              {timeLeft > 0 ? (
                <div className="space-y-2">
                  <p className="text-sm text-neutral-dark">Code expires in</p>
                  <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
                    <span className="font-bold text-primary text-lg">
                      {timeLeft}s
                    </span>
                  </div>
                </div>
              ) : (
                <Button
                  variant="link"
                  onClick={handleResendOtp}
                  disabled={isResendLoading}
                  className="text-base font-medium"
                >
                  {isResendLoading ? "Resending..." : "Resend Code"}
                </Button>
              )}
            </div>
          </>
        )}

        {/* Step 3: New Password */}
        {step === 3 && (
          <>
            <div className="text-center mb-6">
              <Lock className="w-12 h-12 text-primary mx-auto mb-3" />
              <h2 className="text-2xl font-bold text-primary mb-2">
                Create New Password
              </h2>
              <p className="text-sm text-neutral-dark">
                Choose a strong password for your account
              </p>
            </div>

            <Form {...passwordForm}>
              <form
                onSubmit={passwordForm.handleSubmit(handleResetPassword)}
                className="space-y-4"
              >
                <FormField
                  control={passwordForm.control}
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            {...field}
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter new password"
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
                <div className="text-xs text-neutral-dark">
                  Password must contain at least 8 characters with uppercase,
                  lowercase, and numbers
                </div>
                <Button className="w-full text-white" disabled={isResetLoading}>
                  {isResetLoading ? "Updating..." : "Update Password"}
                </Button>
              </form>
            </Form>
          </>
        )}

        {/* Step 4: Success */}
        {step === 4 && (
          <div className="text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-primary mb-2">
              Password Reset Successful!
            </h2>
            <p className="text-sm text-neutral-dark mb-6">
              Your password has been successfully updated. You can now sign in
              with your new password.
            </p>
            <div className="mb-4">
              <p className="text-sm text-neutral-dark">
                Redirecting to login in{" "}
                <span className="font-bold text-primary text-lg">
                  {redirectTimer}
                </span>{" "}
                seconds...
              </p>
            </div>
            <Button
              className="w-full text-white"
              onClick={() => navigate("/login")}
            >
              Continue to Login Now
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
