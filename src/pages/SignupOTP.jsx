import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useVerifyOTPMutation } from "../app/authApi";
import { useState } from "react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useNavigate } from "react-router-dom";

const SignupOTP = () => {
  const navigate = useNavigate();
  const [OTPCode, setOTPCode] = useState();
  const { OTPVerification } = useVerifyOTPMutation();
  return (
    <AlertDialog className="w-fit!">
      <AlertDialogTrigger asChild>
        <Button>SignUp-OTP</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader className="flex flex-col items-center">
          <AlertDialogTitle>Email Verification </AlertDialogTitle>
          <AlertDialogDescription>
            Enter the One-Time Password sent to your email
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="flex justify-center py-4">
          <InputOTP maxLength={6}>
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
        </div>
        <AlertDialogFooter>
          <div className="w-full flex justify-between items-center">
            <p className="text-sm">Resend OTP</p>
            <div className="space-x-2">
              <AlertDialogCancel onClick={() => navigate("/dashboard")}>
                Verify Later
              </AlertDialogCancel>
              <AlertDialogAction>Submit</AlertDialogAction>
            </div>
          </div>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default SignupOTP;
