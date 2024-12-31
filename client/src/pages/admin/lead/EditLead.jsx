import React from 'react'
import LeadTab from './LeadTab'
import {Link } from "react-router-dom"
import { Button } from "@/components/ui/button";
import { ArrowLeft } from 'lucide-react';
const EditLead = () => {
  return (
    <div className="flex-1">
      <div className="flex items-center justify-between mb-5">
        <h1 className="font-bold text-xl">
          <Link to={`/admin/lead`}>
            <Button size="icon" variant="outline" className="rounded-full mr-2">
              <ArrowLeft size={16} />
            </Button>
          </Link>
          Add detail information regarding Lead
        </h1>

      </div>
      <LeadTab />
    </div>
  )
}

export default EditLead
