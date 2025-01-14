import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Edit, Trash } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { useGetAllUsersQuery } from '@/features/api/authApi';

const ITEMS_PER_PAGE = 10; // Number of users per page

const CourseTable = () => {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const { data, isLoading, error } = useGetAllUsersQuery({ page: currentPage, limit: ITEMS_PER_PAGE });

  if (isLoading) return <h1>Loading...</h1>;
  if (error) return <h1>Error fetching users: {error.message || 'Unknown error'}</h1>;

  const handleRoleChange = (role) => {
    setSelectedRole(role);
    setCurrentPage(1); // Reset to the first page when the filter changes
  };

  // Filter users based on role selection
  const filteredUsers =
    selectedRole && selectedRole !== 'all'
      ? data?.users.filter((user) => user.role === selectedRole)
      : data?.users;

  // Pagination logic
  const totalItems = filteredUsers?.length || 0;
  const totalPages = Math.ceil(data.totalUsers / ITEMS_PER_PAGE);


  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div>
      {/* Action Buttons and Filter */}
      <div className="flex flex-wrap gap-4 mb-4 justify-between items-center">
        <Button onClick={() => navigate('/admin/course/create')}>Create a New User</Button>
        <Select onValueChange={handleRoleChange} defaultValue="all" className="w-full sm:w-auto">
          <SelectTrigger>
            <SelectValue placeholder="Filter by Role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="subAdmin">Sub Admin</SelectItem>
            <SelectItem value="supportAgent">Support Agent</SelectItem>
            {/* Add more roles if needed */}
          </SelectContent>
        </Select>
      </div>

      {/* User Table */}
      <div className="overflow-x-auto">
        <Table className="mt-5 min-w-full">
          <TableCaption>A list of your recent users.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.users?.length > 0 ? (
              data.users.map((user) => (
                <TableRow key={user._id}>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge>{user.role}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => navigate(`/admin/user/${user._id}`)}
                      >
                        <Edit />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center">
                  No users found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center p-4">
          <Button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <Button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>

      )}
    </div>
  );
};

export default CourseTable;