import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useGetLeadByIdQuery, useUpdateLeadMutation, useUpdateLeadStatusMutation } from '@/features/api/leadApi';
import { useCreateCommentMutation, useDeleteCommentMutation, useEditCommentMutation, useGetCommentsByCourseQuery } from "@/features/api/commentApi";
import { toast } from "sonner";
import { format, formatDistanceToNow, formatRelative } from 'date-fns';
import { useDispatch, useSelector } from "react-redux";
import { Badge } from "@/components/ui/badge";
import { BadgeInfo, Edit, Trash } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@radix-ui/react-dialog";

const LeadDetail = () => {
    const dispatch = useDispatch();
    const { user } = useSelector(store => store.auth)
    const params = useParams();
    const leadId = params.leadId;
    const navigate = useNavigate();

    // Fetch lead data
    const { data, isLoading, isError } = useGetLeadByIdQuery(leadId);
    const [updateLeadStatusMutation, { isLoading: isUpdating, isError: isUpdatingError }] = useUpdateLeadStatusMutation(); // Mutation hook to update lead
    const [updateLead] = useUpdateLeadMutation();

    const [newStatus, setNewStatus] = useState(data?.lead?.status || "New");

    const [newComment, setNewComment] = useState("");
    const [createComment] = useCreateCommentMutation();
    const [deleteComment] = useDeleteCommentMutation();
    //Edit Comment
    const [isEditDialogOpen, setEditDialogOpen] = useState();
    const [editedComment, setEditedComment] = useState("");
    const [editComment] = useEditCommentMutation();


    const [currentPage, setCurrentPage] = useState(1);
    const [expandedComments, setExpandedComments] = useState([]);
    const commentsPerPage = 5;
    const { data: commentsData, isLoading: commentsLoading, isError: commentsError } = useGetCommentsByCourseQuery({ leadId, page: currentPage, limit: commentsPerPage });
    const totalComments = commentsData?.totalComments || 0;
    const totalPages = Math.ceil(totalComments / commentsPerPage);

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage((prev) => prev + 1);
        }
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage((prev) => prev - 1);
        }
    };

    const toggleExpandComment = (commentId) => {
        setExpandedComments(prevState =>
            prevState.includes(commentId)
                ? prevState.filter(id => id !== commentId)
                : [...prevState, commentId]
        );
    };


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

    const handleCommentUpdate = async (commentId) => {
        try {
            // Call the editComment mutation
            await editComment({ content: editedComment, commentId });

            // Clear the editedComment state
            setEditedComment("");

            // Close the edit dialog or handle any other UI updates needed
            setEditDialogOpen(false);

            // Show success message
            toast.success("Comment updated successfully");

        } catch (error) {
            console.error("Error updating comment:", error);
            toast.error("Failed to update comment");
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
                        <BadgeInfo size={16} />  {lead.createdAt ? format(new Date(lead.createdAt), 'dd/MM/yyyy') : "N/A"}
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
                            <div className="mt-6 space-y-4">
                                {commentsData.comments.map((comment) => (
                                    <div key={comment._id} className="border-b pb-4">
                                        <div className="flex items-start justify-between">
                                            <div className="flex gap-4">
                                                {/* Creator Image */}
                                                <div
                                                    style={{
                                                        height: "48px",
                                                        width: "48px",
                                                        borderRadius: "50%",
                                                        overflow: "hidden",
                                                    }}
                                                >
                                                    <img
                                                        src={comment.creator.photoUrl || "https://github.com/shadcn.png"}
                                                        alt="author"
                                                        style={{
                                                            width: "100%",
                                                            height: "100%",
                                                            objectFit: "cover",
                                                            borderRadius: "50%",
                                                        }}
                                                    />
                                                </div>
                                                {/* Name and Date */}
                                                <div className="flex items-center space-x-2 justify-center">
                                                    <span className="font-semibold text-white-400">{comment.creator.name}</span>
                                                    <Badge className='bg-gray-500 text-white-500'>{comment.creator.role}</Badge>

                                                    <span className="text-sm text-gray-500">
                                                        {comment.createdAt ?  `${formatDistanceToNow(new Date(comment.createdAt))} ago` : 'N/A'}
                                                    </span>
                                                </div>

                                            </div>
                                            {/* Delete Button */}
                                            {comment.creator._id === user?._id && (
                                                <>
                                                    <Button onClick={() => handleCommentDelete(comment._id)} className="text-red-600">
                                                        <Trash />
                                                    </Button>


                                                    {/* <Button onClick={() => setEditDialogOpen(true)} className="text-blue-600">
                                                        <Edit />
                                                    </Button> */}

                                                    {/* {isEditDialogOpen && (
                                                        <Dialog open={isEditDialogOpen} onOpenChange={setEditDialogOpen} maxWidth="sm" fullWidth>
                                                            <Dialog.Header>Edit Comment</Dialog.Header>
                                                            <Dialog.Content>
                                                                <Textarea
                                                                    value={editedComment}
                                                                    onChange={(e) => setEditedComment(e.target.value)}
                                                                    placeholder="Update your comment here"
                                                                    multiline
                                                                    fullWidth
                                                                />
                                                            </Dialog.Content>
                                                            <Dialog.Footer>
                                                                <Button variant="ghost" onClick={() => setEditDialogOpen(false)}>
                                                                    Cancel
                                                                </Button>
                                                                <Button
                                                                    onClick={() => {
                                                                        dispatch(updateComment({ id: comment._id, content: editedComment }));
                                                                        setEditDialogOpen(false);
                                                                    }}
                                                                >
                                                                    Update Comment
                                                                </Button>
                                                            </Dialog.Footer>
                                                        </Dialog>
                                                    )} */}
                                                </>
                                            )}


                                        </div>
                                        {/* Comment Content */}
                                        <p className="mt-2 text-white-400">

                                            {
                                                expandedComments.includes(comment._id)
                                                    ? comment.content
                                                    : `${comment.content.substring(0, 110)}`
                                            }
                                            {comment.content.length > 110 && (
                                                <Button
                                                    onClick={() => toggleExpandComment(comment._id)}
                                                    className="text-blue-600 text-sm ml-2 bg-gray-500 text-white-400"
                                                >
                                                    {expandedComments.includes(comment._id) ? 'Show Less' : 'Show More'}
                                                </Button>
                                            )}

                                        </p>

                                    </div>
                                ))}
                            </div>


                        ) : (
                            <p className="mt-4">No comments yet.</p>
                        )}

                        {totalPages > 1 && (
                            <div className="flex justify-between mt-4">
                                <Button
                                    onClick={handlePrevPage}
                                    disabled={currentPage === 1}
                                    className="bg-gray-300 text-black disabled:opacity-50"
                                >
                                    Previous
                                </Button>
                                <span className="text-sm text-gray-600">
                                    Page {currentPage} of {totalPages}
                                </span>
                                <Button
                                    onClick={handleNextPage}
                                    disabled={currentPage === totalPages}
                                    className="bg-gray-300 text-black disabled:opacity-50"
                                >
                                    Next
                                </Button>
                            </div>
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