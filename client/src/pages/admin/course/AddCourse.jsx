import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useCreateUserMutation } from "@/features/api/authApi"; // Ensure this API hook exists
import { toast } from "sonner";

const AddCourse = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("supportAgent"); // Change initial role value to "supportAgent"
    const [answer, setAnswer] = useState("");

    const [createUser, { data, isLoading, error, isSuccess }] =
        useCreateUserMutation();

    const navigate = useNavigate();

    const createUserHandler = async () => {
        try {
            await createUser({ name, email, password, role, answer }).unwrap();
        } catch (err) {
            console.error(err);
        }
    };

    const roles = [
        { label: "Sub-Admin", value: "subAdmin" },
        { label: "Support Agent", value: "supportAgent" },
    ];

    useEffect(() => {
        if (isSuccess) {
            toast.success(data?.message || "User Created Successfully");
            navigate("/admin/course");
        }
        if (error) {
            toast.error(error?.data?.details[0]?.message || "Failed to create user");
        }
    }, [isSuccess, error]);

    return (
        <div className="flex-1 mx-10">
            <div className="mb-4">
                <h1 className="font-bold text-xl">Add User</h1>
                <p className="text-sm">
                    Create a new user by providing their details and assigning an appropriate role.
                </p>
            </div>
            <div className="space-y-4">
                {/* Name Field */}
                <div>
                    <Label>Name</Label>
                    <Input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Full Name"
                    />
                </div>

                {/* Email Field */}
                <div>
                    <Label>Email</Label>
                    <Input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email Address"
                    />
                </div>

                {/* Password Field */}
                <div>
                    <Label>Password</Label>
                    <Input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Secure Password"
                    />
                </div>

                {/* Role Field */}
                <div>
                    <Label>Role</Label>
                    <Select onValueChange={(value) => setRole(value)} value={role}> {/* Set value to role */}
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Role</SelectLabel>
                                {roles.map((role) => (
                                    <SelectItem key={role.value} value={role.value}>
                                        {role.label}
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>

                {/* Security Answer Field */}
                <div>
                    <Label>Security Answer</Label>
                    <Input
                        type="text"
                        value={answer}
                        onChange={(e) => setAnswer(e.target.value)}
                        placeholder="Security Answer"
                    />
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2">
                    <Button variant="outline" onClick={() => navigate("/admin/course")}>
                        Back
                    </Button>
                    <Button disabled={isLoading} onClick={createUserHandler}>
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Please Wait
                            </>
                        ) : (
                            "Create"
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default AddCourse;
