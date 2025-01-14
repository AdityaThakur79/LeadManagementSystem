import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import React, { useState } from 'react'
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';


const Herosection = () => {
    const { user } = useSelector(store => store.auth)
    const navigate = useNavigate();
     


    return (
        <>
            <div className="relative bg-gradient-to-r from-blue-500 to bg-indigo-600 dark:from-gray-800 dark:to-gray-900 py-24 px-4 text-center">
                <div className="max-w-3xl mx-auto">
                    <h1 className="text-white text-4xl font-bold mb-4">
                        Assigned Lead
                    </h1>
                    <p className="text-gray-200 dark:text-gray-400 mb-8">
                        Manage, Track, and Enhance Leads with Our Comprehensive Lead Management System                    </p>
                    {/* {user.role == "superAdmin" && (
                        <>
                            <h1>You are a {user.role}
                            </h1>
                            <Link to="allleads">
                                <Button className="mt-4">See All Leads</Button>
                            </Link>
                        </>
                    )} */}
                </div>
            </div>


        </>
    )
}

export default Herosection
