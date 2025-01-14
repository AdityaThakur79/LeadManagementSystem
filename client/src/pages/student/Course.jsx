import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from 'react-router-dom';

const Lead = ({ lead }) => {
  const leadId = lead._id;
    return (
        <Link to ={ `/lead-detail/${leadId}`} >
            <div className="bg-white shadow-md hover:shadow-lg transition-shadow rounded-lg overflow-hidden">
                <Card className="overflow-hidden rounded-lg dark:bg-gray-800 bg-white shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
                    <CardContent className="px-5 py-4 space-y-3">
                        <Badge className="bg-red-600 text-white px-2 py-1 text-xs rounded-full">
                            {lead.status}
                        </Badge>
                        {/* Lead Name */}
                        <h3 className="font-semibold text-xl">{lead.name}</h3>

                        {/* Lead Status with Badge */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Avatar className="h-8 w-8">
                                    <AvatarImage src={lead.creator?.photoUrl || "https://github.com/shadcn.png"} alt="@shadcn" />
                                    <AvatarFallback>CN</AvatarFallback>
                                </Avatar>
                                <h1 className="font-medium text-sm">{lead.creator?.name}</h1>
                            </div>

                            {/* Status Badge */}

                        </div>

                        {/* Lead Description */}
                        <Badge className="bg-blue-600 text-white px-2 py-1 text-xs rounded-full">
                            {lead.source}
                        </Badge>

                        {/* Lead Email */}
                        <div className="flex items-center gap-3">
                            <span className="text-sm font-medium">{lead.email}</span>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </Link>
    );
};

export default Lead;
