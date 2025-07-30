import { useState, useEffect } from "react";
import {
  useForgotPasswordMutation,
  useVerifyResetOtpMutation,
  useResetPasswordMutation,
  useResendResetOtpMutation,
} from "../app/authApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

export default function ForgotPasswordPage() {
  const [step, setStep] = useState("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [timer, setTimer] = useState(60);

  const [forgotPassword, { isLoading: sendingOtp }] =
    useForgotPasswordMutation();
  const [verifyOtp, { isLoading: verifying }] = useVerifyResetOtpMutation();
  const [resetPassword, { isLoading: resetting }] = useResetPasswordMutation();
  const [resendOtp, { isLoading: resending }] = useResendResetOtpMutation();

  // Countdown timer logic
  useEffect(() => {
    let interval;
    if (step === "otp" && timer > 0) {
      interval = setInterval(() => setTimer((t) => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  const handleSendOtp = async () => {
    try {
      await forgotPassword({ email }).unwrap();
      setStep("otp");
      setTimer(60);
    } catch (err) {
      alert("Failed to send OTP");
    }
  };

  const handleVerifyOtp = async () => {
    try {
      await verifyOtp({ email, otp }).unwrap();
      setStep("password");
    } catch (err) {
      alert("Incorrect OTP");
    }
  };

  const handleResetPassword = async () => {
    try {
      await resetPassword({ email, password: newPassword }).unwrap();
      alert("Password reset successful!");
      // redirect to login if needed
    } catch (err) {
      alert("Failed to reset password");
    }
  };

  const handleResend = async () => {
    try {
      await resendOtp({ email }).unwrap();
      setTimer(60);
    } catch (err) {
      alert("Failed to resend OTP");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 px-8 py-10 bg-white border border-gray-200 rounded-2xl shadow-lg space-y-6">
      <h2 className="text-3xl font-semibold text-center text-primary tracking-tight">
        Forgot Password
      </h2>

      {step === "email" && (
        <>
          <Input
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button onClick={handleSendOtp} disabled={sendingOtp || !email}>
            {sendingOtp ? "Sending OTP..." : "Send OTP"}
          </Button>
        </>
      )}

      {step === "otp" && (
        <>
          <InputOTP
            maxLength={6}
            value={otp}
            onChange={(value) => setOtp(value)}
          >
            <InputOTPGroup>
              {[...Array(6)].map((_, index) => (
                <InputOTPSlot key={index} index={index} />
              ))}
            </InputOTPGroup>
          </InputOTP>

          <Button
            onClick={handleVerifyOtp}
            disabled={verifying || otp.length !== 6}
          >
            {verifying ? "Verifying..." : "Verify OTP"}
          </Button>

          <div className="text-sm text-gray-600 text-center">
            {timer > 0 ? (
              `Resend OTP in ${timer}s`
            ) : (
              <button
                onClick={handleResend}
                disabled={resending}
                className="text-blue-600 hover:underline"
              >
                Resend OTP
              </button>
            )}
          </div>
        </>
      )}

      {step === "password" && (
        <>
          <Input
            type="password"
            placeholder="Enter new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <Button
            onClick={handleResetPassword}
            disabled={resetting || newPassword.length < 6}
          >
            {resetting ? "Resetting..." : "Reset Password"}
          </Button>
        </>
      )}
    </div>
  );
}
