import React, { useState, useEffect } from "react";
import { Button } from "../../../components/ui/button";
import { Link, useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useGetTagByIdQuery, useUpdateTagMutation, useDeleteTagMutation } from "../../../features/api/tagApi"; // Assuming you have tagApi set up
import { toast } from "sonner";

const EditTag = () => {
    const { tagId } = useParams(); // Get tagId from URL params
    const navigate = useNavigate();

    // Fetch tag data
    const { data, error, isLoading } = useGetTagByIdQuery(tagId);

    const [title, setTitle] = useState("");

    const [updateTag] = useUpdateTagMutation();
    const [deleteTag] = useDeleteTagMutation();

    useEffect(() => {
        if (data) {
            setTitle(data.tag.name);
        }
    }, [data]);

    // Function to handle submitting the form
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Check if title is valid before submitting
        if (!title.trim()) {
            toast.error("Title cannot be empty.");
            return;
        }

        try {
            // Log title and tagId to check if they are being passed correctly
            console.log("Updating tag with ID:", tagId, "and title:", title);

            const response = await updateTag({
                tagId,
                tagData: { title }
            });

            // Log the response from the mutation
            console.log("Update response:", response);

            if (response.error) {
                throw new Error(response.error.message || "Failed to update tag.");
            }

            toast.success("Tag updated successfully!");
            navigate("/admin/tag");
        } catch (error) {
            console.error("Error updating tag:", error);
            toast.error("Failed to update tag.");
        }
    };

    // Function to handle deleting the tag
    const handleDelete = async () => {
        try {
            const response = await deleteTag(tagId);

            // Log the response for delete operation
            console.log("Delete response:", response);

            if (response.error) {
                throw new Error(response.error.message || "Failed to delete tag.");
            }

            toast.success("Tag deleted successfully!");
            navigate("/admin/tag");
        } catch (error) {
            console.error("Error deleting tag:", error);
            toast.error("Failed to delete tag.");
        }
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error fetching tag data</div>;
    }

    return (
        <div className="flex-1 bg-dark-800 text-white">
            <div className="flex items-center justify-between mb-5">
                <h1 className="font-bold text-xl">
                    <Link to={`/admin/tag`}>
                        <Button
                            size="icon"
                            variant="outline"
                            className="rounded-full mr-2 border-gray-600 text-white hover:bg-gray-700"
                        >
                            <ArrowLeft size={16} />
                        </Button>
                    </Link>
                    Edit Tag Information
                </h1>
                <Link to={`/admin/tag`}>
                    <Button
                        className="hover:text-blue-400 text-blue-300"
                        variant="link"
                    >
                        Back to Tags
                    </Button>
                </Link>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                    <label htmlFor="title" className="block font-semibold">
                        Title
                    </label>
                    <input
                        id="title"
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full p-2 border border-gray-600 rounded-md dark:bg-dark-700 light:bg-white dark:text-gray-600 light:text-gray-600"
                        placeholder="Enter tag title"
                        required
                    />
                </div>

                <div className="flex justify-between">
                    <Button
                        type="submit"
                        className="bg-blue-600 text-white hover:bg-blue-700"
                    >
                        Save Changes
                    </Button>
                    <Button
                        type="button"
                        className="bg-red-600 text-white hover:bg-red-700"
                        onClick={handleDelete}
                    >
                        Delete Tag
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default EditTag;
