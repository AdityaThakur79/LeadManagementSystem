import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useFetchUserByIdQuery, useUpdateUserMutation, useDeleteUserMutation } from '@/features/api/authApi';

const EditCourse = () => {
    const { userId } = useParams();  // Get userId from URL params
    const navigate = useNavigate();
    const [input, setInput] = useState({
        name: "",
        email: "",
        role: "",
        answer: "",
    });

    // Fetch user data by ID using RTK Query
    const { data: userData, isLoading: isUserLoading, error: userError } = useFetchUserByIdQuery(userId);

    const [updateUser, { isLoading, isSuccess, error }] = useUpdateUserMutation();
    const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();

    // Update form fields with fetched user data
    useEffect(() => {
        if (userData) {
            setInput({
                name: userData.name,
                email: userData.email,
                role: userData.role,
                answer: userData.answer,
            });
        }
    }, [userData]);

    // Handler to update input fields when the user changes the data
    const changeEventHandler = (e) => {
        const { name, value } = e.target;
        setInput({ ...input, [name]: value });
    };

    // Update user handler
    const updateUserHandler = async () => {
        try {
            await updateUser({ id: userId, updates: input });
        } catch (error) {
            toast.error("Failed to update user");
        }
    };

    // Delete user handler
    const deleteUserHandler = async () => {
        try {
            await deleteUser(userId);
            toast.success("User deleted successfully");
            navigate("/admin/course"); // Redirect to user list page after deletion
        } catch (error) {
            toast.error("Failed to delete user");
        }
    };

    // Update success or failure handler
    useEffect(() => {
        if (isSuccess) {
            toast.success("User updated successfully.");
        }
        if (error) {
            toast.error(error.data.message || "Failed to update user");
        }
    }, [isSuccess, error]);

    return (
        <Card>
            <CardHeader className="flex flex-row justify-between">
                <div>
                    <CardTitle>Basic User Information</CardTitle>
                    <CardDescription>
                        Make changes to user details here. Click save when you're done.
                    </CardDescription>
                </div>

                <div className="space-x-2">
                    <Button onClick={deleteUserHandler} variant="outline" disabled={isDeleting}>
                        {isDeleting ? (
                            <Loader2 className="animate-spin mr-2 h-4 w-4" />
                        ) : (
                            "Remove User"
                        )}
                    </Button>
                </div>
            </CardHeader>

            <CardContent>
                <div className="space-y-4 mt-5">
                    {/* Name Field */}
                    <div>
                        <Label>Name</Label>
                        <Input
                            type="text"
                            name="name"
                            value={input.name}
                            onChange={changeEventHandler}
                            placeholder="Enter name"
                            disabled={isUserLoading}  
                        />
                    </div>

                    {/* Email Field */}
                    <div>
                        <Label>Email</Label>
                        <Input
                            type="email"
                            name="email"
                            value={input.email}
                            onChange={changeEventHandler}
                            placeholder="Enter email"
                            disabled={isUserLoading}
                        />
                    </div>

                    {/* Role Field */}
                    <div>
                        <Label>Role</Label>
                        <Input
                            type="text"
                            name="role"
                            value={input.role}
                            onChange={changeEventHandler}
                            placeholder="Enter role"
                            disabled={isUserLoading}
                        />
                    </div>

                    {/* Answer Field */}
                    <div>
                        <Label>Answer</Label>
                        <Input
                            type="text"
                            name="answer"
                            value={input.answer}
                            onChange={changeEventHandler}
                            placeholder="Enter answer"
                            disabled={isUserLoading}
                        />
                    </div>

                    {/* Buttons */}
                    <div className="flex space-x-2">
                        <Button onClick={() => navigate("/admin/users")} variant="outline">
                            Cancel
                        </Button>
                        <Button disabled={isLoading || isUserLoading} onClick={updateUserHandler}>
                            {isLoading ? (
                                <Loader2 className="animate-spin mr-2 h-4 w-4">Please Wait</Loader2>
                            ) : (
                                "Save"
                            )}
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default EditCourse;
