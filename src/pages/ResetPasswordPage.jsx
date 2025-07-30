import React, { useState, useEffect } from "react";
import {
  useForgotPasswordMutation,
  useVerifyResetOtpMutation,
  useResendResetOtpMutation,
  useResetPasswordMutation,
} from "../app/authApi"; 
const ResetPasswordPage = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [userId, setUserId] = useState(null); 
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [timeLeft, setTimeLeft] = useState(60);

  const [forgotPassword] = useForgotPasswordMutation();
  const [verifyOtp] = useVerifyResetOtpMutation();
  const [resendOtp] = useResendResetOtpMutation();
  const [resetPassword] = useResetPasswordMutation();

  // Timer logic
  useEffect(() => {
    if (step !== 2 || timeLeft === 0) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [step, timeLeft]);

  //  Send Forgot Password
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    try {
      const res = await forgotPassword(email).unwrap();
      alert(res.message);
      setUserId(res.user_id); 
      setTimeLeft(60);
      setStep(2);
    } catch (err) {
      alert(err.data?.message || "Something went wrong");
    }
  };

  //  Verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    try {
      const res = await verifyOtp({ user_id: userId, otp }).unwrap();
      alert(res.message);
      setStep(3);
    } catch (err) {
      alert(err.data?.message || "Invalid OTP");
    }
  };

  //  Resend OTP
  const handleResendOtp = async () => {
    try {
      const res = await resendOtp(email).unwrap();
      alert(res.message);
      setTimeLeft(60);
    } catch (err) {
      alert(err.data?.message || "Resend failed");
    }
  };

  //  Reset Password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      const res = await resetPassword({
        email,
        otp,
        newPassword: password,
      }).unwrap();
      alert(res.message);
      setStep(4);
    } catch (err) {
      alert(err.data?.message || "Reset failed");
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "auto", padding: 20 }}>
      <h2>Reset Password</h2>

      {step === 1 && (
        <form onSubmit={handleForgotPassword}>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: "100%", padding: 8, marginBottom: 10 }}
          />
          <button type="submit" style={{ width: "100%" }}>
            Send OTP
          </button>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={handleVerifyOtp}>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            required
            onChange={(e) => setOtp(e.target.value)}
            style={{ width: "100%", padding: 8, marginBottom: 10 }}
          />
          <button type="submit" style={{ width: "100%", marginBottom: 10 }}>
            Verify OTP
          </button>
          <div style={{ textAlign: "center" }}>
            {timeLeft > 0 ? (
              <p>OTP expires in {timeLeft}s</p>
            ) : (
              <button type="button" onClick={handleResendOtp}>
                Resend OTP
              </button>
            )}
          </div>
        </form>
      )}

      {step === 3 && (
        <form onSubmit={handleResetPassword}>
          <input
            type="password"
            placeholder="New Password"
            value={password}
            required
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: "100%", padding: 8, marginBottom: 10 }}
          />
          <button type="submit" style={{ width: "100%" }}>
            Reset Password
          </button>
        </form>
      )}

      {step === 4 && (
        <div style={{ textAlign: "center" }}>
          <p>Password reset successful 🎉</p>
          <a href="/login">Go to Login</a>
        </div>
      )}
    </div>
  );
};

export default ResetPasswordPage;
