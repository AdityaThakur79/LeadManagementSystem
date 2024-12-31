import React, { useState, useEffect } from "react";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useCreateTagMutation } from "../../../features/api/tagApi"; // Assuming you have tagApi set up
import { toast } from "sonner";

const AddTag = () => {
    const [title, setTitle] = useState("");

    const [createTag, { data, isLoading, error, isSuccess }] = useCreateTagMutation();
    const navigate = useNavigate();

    const createTagHandler = async () => {
        await createTag({ name: title });
    };

    useEffect(() => {
        if (isSuccess) {
            toast.success(data?.message || "Tag Created Successfully");
            navigate("/admin/tag");
        } else if (error) {
            toast.error(error?.data?.message || "Failed to create tag");
        }
    }, [isSuccess, error]);

    return (
        <div className="flex-1 mx-10">
            <div className="mb-4">
                <h1 className="font-bold text-xl">Add a New Tag</h1>
                <p className="text-sm">
                    Provide a title for the tag you want to add.
                </p>
            </div>
            <div className="space-y-4">
                {/* Title Input */}
                <div>
                    <Label htmlFor="title">Title</Label>
                    <Input
                        id="title"
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Enter tag title"
                    />
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                    <Button variant="outline" onClick={() => navigate("/admin/tag")}>
                        Back
                    </Button>
                    <Button disabled={isLoading} onClick={createTagHandler}>
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

export default AddTag;
