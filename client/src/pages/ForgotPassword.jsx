import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { toast } from 'sonner';
import { useForgotPasswordMutation } from "@/features/api/authApi";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        answer: "",
        newpassword: "",
    });

    const [forgotPassword, { isLoading, isSuccess, isError, error }] = useForgotPasswordMutation();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await forgotPassword(formData).unwrap();
            toast.success("Password changed successfully!");
            setFormData({ email: "", answer: "", newpassword: "" });
            navigate(`/login`)
        } catch (err) {
            console.error(err);
            toast.error("An error occurred while resetting the password.");
        }
    };
    return (
        <div className="flex items-center w-full justify-center mt-24">
            <Card className="w-[400px]">
                <CardHeader>
                    <CardTitle>Forgot Password</CardTitle>

                </CardHeader>
                <CardContent className="space-y-2">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-1">
                            <Label>Email</Label>
                            <Input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Enter your registered email"
                                required
                            />
                        </div>
                        <div className="space-y-1">
                            <Label>Security Answer</Label>
                            <Input
                                type="text"
                                name="answer"
                                value={formData.answer}
                                onChange={handleChange}
                                placeholder="Your favorite food"
                                required
                            />
                        </div>
                        <div className="space-y-1">
                            <Label>New Password</Label>
                            <Input
                                type="password"
                                name="newpassword"
                                value={formData.newpassword}
                                onChange={handleChange}
                                placeholder="Enter your new password"
                                required
                            />
                        </div>
                    </form>
                </CardContent>
                <CardFooter>
                    <Button type="submit" disabled={isLoading} onClick={handleSubmit}>
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 w-4 h-4 animate-spin"></Loader2>
                                Resetting...
                            </>
                        ) : (
                            "Reset Password"
                        )}
                    </Button>
                </CardFooter>

            </Card>
        </div>
    )
}

export default ForgotPassword
