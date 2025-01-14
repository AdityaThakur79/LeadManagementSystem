import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useVerifyOTPMutation } from "@/features/api/authApi";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

function VerifyOTP() {
    const { state } = useLocation();
    const [otp, setOtp] = useState("");
    const [verifyOTP, { isLoading }] = useVerifyOTPMutation();
    const navigate = useNavigate();

    const handleVerify = async () => {
        if (!state?.email) {
            toast.error("Email is missing. Please register again.");
            navigate("/login");
            return;
        }

        try {
            const response = await verifyOTP({ email: state.email, otp }).unwrap();

            if (response.success) {
                toast.success(response.message || "OTP Verified successfully.");
                navigate("/profile");
            }
        } catch (err) {
            toast.error(err?.data?.message || "OTP Verification Failed.");
        }
    };

    return (
        <div className="flex items-center w-full justify-center mt-24 p-4">
            <div className="w-[400px]">
                <h1 className="text-center text-3xl mb-4 font-bold">Verify OTP to Register</h1>
                <Label>Email</Label>
                <Input type="text" value={state?.email || ""} disabled className="mb-4" />
                <Label>OTP</Label>
                <Input
                    type="text"
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                />
                <Button
                    className="mt-4"
                    disabled={isLoading}
                    onClick={handleVerify}
                >
                    {isLoading ? (
                        <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                    ) : (
                        "Verify OTP"
                    )}
                </Button>
            </div>
        </div>
    );
}

export default VerifyOTP;
