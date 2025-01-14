import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";
import { Button } from "../../../components/ui/button";
import { useNavigate } from "react-router-dom";
import { useGetAllTagsQuery } from "../../../features/api/tagApi";
import { Edit } from "lucide-react";

const TagTable = () => {
  const navigate = useNavigate();

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const { data, isLoading } = useGetAllTagsQuery({ page: currentPage, limit: itemsPerPage });
  if (isLoading) return <h1>Loading...</h1>;

  // Calculate pagination details
  const tags = data?.tags || [];
  const totalPages = Math.ceil(data.totalTags / itemsPerPage);


  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <div>
      <Button onClick={() => navigate("/admin/tag/create")}>
        Create a New Tag
      </Button>
      <Table className="mt-5">
        <TableCaption>A list of your tags.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Sr.No</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.tags.map((tag, index) => (
            <TableRow key={tag._id}>
              <TableCell>{(currentPage - 1) * itemsPerPage + index + 1}</TableCell>
              <TableCell>{tag.name}</TableCell>
              <TableCell>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => navigate(`/admin/tag/${tag._id}`)}
                >
                  <Edit />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {/* Pagination */}
      <div className="pagination mt-4 flex justify-center items-center space-x-2">
        <Button onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}>Previous</Button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <Button onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}>
          Next
        </Button>
      </div>


    </div>
  );
};

export default TagTable;
