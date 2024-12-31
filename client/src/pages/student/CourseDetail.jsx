import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { BadgeInfo } from "lucide-react";
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useGetLeadByIdQuery, useUpdateLeadMutation, useUpdateLeadStatusMutation } from '@/features/api/leadApi'; // Custom hook to fetch lead details and update
import { useCreateCommentMutation, useDeleteCommentMutation, useGetCommentsByCourseQuery } from "@/features/api/commentApi";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { toast } from "sonner";


const LeadDetail = () => {
    const params = useParams();
    const leadId = params.leadId;
    const navigate = useNavigate();


    // Fetch lead data
    const { data, isLoading, isError } = useGetLeadByIdQuery(leadId);
    const [updateLeadStatusMutation, { isLoading: isUpdating, isError: isUpdatingError }] = useUpdateLeadStatusMutation(); // Mutation hook to update lead

    const [newComment, setNewComment] = useState("");
    const [newStatus, setNewStatus] = useState(data?.lead?.status || "New");
    const { data: commentsData, isLoading: commentsLoading, isError: commentsError } = useGetCommentsByCourseQuery(leadId);
    const [createComment] = useCreateCommentMutation();
    const [deleteComment] = useDeleteCommentMutation();

    const [updateLead] = useUpdateLeadMutation();

    // Handle loading and error states
    if (isLoading) return <h1>Loading...</h1>;
    if (isError) return <h1>Failed to load lead details</h1>;
    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (newComment.trim()) {
            try {
                const response = await createComment({ content: newComment, leadId });
                setNewComment("");
            } catch (error) {
                console.error("Error adding comment:", error);
            }
        }
    };

    const handleCommentDelete = async (commentId) => {
        try {
            await deleteComment(commentId);
        } catch (error) {
            console.error("Error deleting comment:", error);
        }
    };
    // Safely access lead data
    const lead = data?.lead;

    if (!lead) return <h1>Lead not found</h1>;

    // Handle adding a comment
    const handleAddComment = async () => {
        if (newComment.trim()) {
            const updatedLead = { ...lead, comments: [...lead.comments, newComment] };
            await updateLead({ leadId, lead: updatedLead });
            setNewComment(""); // Clear the comment input after submitting
        }
    };

    // Handle updating lead status
    const handleStatusChange = async () => {
        try {
            await updateLeadStatusMutation({ leadId, status: newStatus }).unwrap();
            toast.success(`Status updated to: ${newStatus}`);
        } catch (error) {
            console.error('Failed to update status:', error);
            toast.error("Error Updating Status")
        }
    };

    return (
        <div className="space-y-5 mt-20">
            {/* Lead Header Section */}
            <div className="bg-[#2D2F31] text-white">
                <div className="max-w-7xl mx-auto py-8 px-4 md:px-8 flex flex-col gap-2">
                    <h1 className="font-bold text-2xl md:text-3xl">{lead?.name}</h1>
                    <p className="text-base md:text-lg">{lead?.email}</p>
                    <div className="flex items-center gap-2 text-sm">
                        <BadgeInfo size={16} />
                    </div>
                    <p>Status: {lead?.status}</p>
                    <p>Source: {lead?.source}</p>
                    <p>Phone: {lead?.phone}</p>
                </div>
            </div>

            {/* Lead Content Section */}
            <div className="max-w-7xl mx-auto my-5 px-4 md:px-8 flex flex-col lg:flex-row justify-between gap-10">
                <div className="w-full lg:w-1/2 space-y-5">
                    <h1 className="font-bold text-xl md:text-2xl">Lead Information</h1>
                    <Card>
                        <CardHeader>
                            <CardTitle>Lead Details</CardTitle>
                        </CardHeader>

                    </Card>

                    {/* Add a new comment */}
                    <div className="max-w-7xl mx-auto px-4 md:px-8 mt-3">
                        <h2 className="font-bold text-2xl">Comments</h2>
                        <form onSubmit={handleCommentSubmit} className="mt-4">
                            <textarea
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder="Add a comment..."
                                className="w-full p-3 border border-gray-300 rounded-md text-gray-900"
                                rows="1"
                            />
                            <Button
                                type="submit"
                                className="mt-2 w-full bg-blue-600 text-white"
                            >
                                Add Comment
                            </Button>
                        </form>

                        {/* Display Comments */}
                        {commentsLoading ? (
                            <p>Loading comments...</p>
                        ) : commentsData?.comments?.length > 0 ? (
                            <div className="mt-4 space-y-4">
                                {commentsData.comments.map((comment) => (
                                    <div key={comment._id} className="border-b pb-4">
                                        <div className="flex items-start gap-4">
                                            <Avatar className="h-12 w-12 rounded-full">
                                                <AvatarImage src={comment.creator.photoUrl || "https://github.com/shadcn.png"} alt="author" />
                                                <AvatarFallback>CN</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <span className="font-semibold text-gray-800">{comment.creator.name}</span>
                                                <p className="text-white">{comment.content}</p>
                                            </div>
                                            <Button onClick={() => handleCommentDelete(comment._id)} className="text-red-600">Delete</Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="mt-4">No comments yet.</p>
                        )}
                    </div>
                </div>

                {/* Lead Action and Status Section */}
                <div className="w-full lg:w-1/3">
                    <Card>
                        <CardContent className="p-4 flex flex-col">
                            <h1 className="text-lg md:text-xl font-semibold">Lead Status</h1>
                            <Separator className="my-2" />
                            <p className="text-sm">Assigned To: {lead?.assignedTo?.name}</p>
                            <p className="text-sm">Status: {lead?.status}</p>
                            <p className="text-sm">Phone: {lead?.phone}</p>

                            {/* Update Status */}
                            <div className="mt-4">
                                <label className="block text-sm font-semibold text-gray-700">Update Status</label>
                                <select
                                    className="w-full border text-gray-500 border-gray-300 p-2 mt-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={newStatus}
                                    onChange={(e) => setNewStatus(e.target.value)}
                                >
                                    <option value="New">New</option>
                                    <option value="Contacted">Contacted</option>
                                    <option value="Qualified">Qualified</option>
                                    <option value="Lost">Lost</option>
                                    <option value="Won">Won</option>
                                </select>
                                <Button
                                    className="mt-4 w-full bg-blue-600 text-white hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm py-2.5 px-5 focus:outline-none"
                                    onClick={handleStatusChange}
                                    disabled={isUpdating}
                                >
                                    {isUpdating ? 'Updating...' : 'Update Status'}
                                </Button>
                            </div>

                            {/* Tags Section */}
                            <h2 className="font-semibold mt-4">Tags</h2>
                            <div className="space-y-2">
                                {lead?.tags?.map((tag, idx) => (
                                    <p key={idx} className="text-sm text-gray-500">
                                        Tag: {tag.name}
                                    </p>
                                ))}
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-center p-4">
                            <Button className="w-full" onClick={() => navigate(`/update-lead/${leadId}`)}>
                                Update Lead
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default LeadDetail;
