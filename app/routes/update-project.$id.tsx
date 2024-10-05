import { useNavigate, useParams } from '@remix-run/react';
import React, { useEffect, useState } from 'react'
import Modal from '~/components/modal';
import { domainName, getCookie } from '~/utils/common';
import moment from 'moment';

import "~/styles/styles.css";
import "~/styles/dashboard.css";
import "primereact/resources/themes/lara-light-cyan/theme.css";

import { Editor } from 'primereact/editor';

import Header from "../components/header";
import Sidebar from "../components/sidebar";
import Spinner from "../components/spinner";

const updateProject = () => {
    const { id } = useParams();
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [projectData, setProjectData] = useState<any>({
        projectName: '',
        description: '',
        startDate: '',
        endDate: '',
        dueDate: '',
        status: '',
    })
    const [modal, setModal] = useState({ show: false, message: "" })

    useEffect(() => {
        viewProject(id)
    }, [])

    const viewProject = async (_id: any) => {
        try {
            const token = await getCookie("ud").then(res => res)
            const response: any = await fetch(`${domainName()}/api/project/view-project`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-auth-token": `${token}`,
                },
                body: JSON.stringify({ _id }),
            }).then(res => res.json())

            if (response?.project && Object.keys(response?.project).length > 0) {
                setProjectData(response.project)
                setModal({ show: false, message: "Project found" })
                setIsLoading(false)
            } else {
                setModal({ show: true, message: "Project not found" })
                setIsLoading(false)
                setTimeout(() => {
                    navigate('/projects')
                }, 3000)
            }
        } catch (error) {
        }
    }

    const navigate = useNavigate()

    const handleUpdateProject = async () => {
        try {
            if (projectData?.projectName == "") {
                alert('Please enter project name')
                return
            }
            setIsLoading(true)
            const token = await getCookie("ud").then(res => res)

            const data: any = await fetch(`${domainName()}/api/project/update-project`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-auth-token": `${token}`,
                },
                body: JSON.stringify(projectData),
            }).then(res => {
                if (res.status === 401) {
                    const url = new URL(window.location.href)
                    setModal({ show: true, message: "Something went wrong" })
                    navigate("/?redirect=" + url.pathname)
                }
                return res.json()
            }
            )
            if (data?.success) {
                setModal({ show: true, message: data.message })
            }
            setIsLoading(false)
        } catch (error) {
            alert('An error occurred')
            setModal({ show: true, message: "Something went wrong! Please try again." })
        }
    }

    return (
        <>
            <Modal show={modal.show} message={modal.message} setModal={setModal} />
            <Spinner display={isLoading} />
            <div className="bg-back h-100vh">
                <Header setSidebarOpen={setSidebarOpen} sidebarOpen={sidebarOpen} />
                <div className="main">
                    <Sidebar sidebarOpen={sidebarOpen} />
                    <div className="main-body">
                        <div className="box shadow-sm">

                            <div className="add-project-section">
                                <h5 className='font-weight-bold'>Update Project</h5>
                                <div className="row">
                                    <div className="form-group mt-3">
                                        <label htmlFor="projectName">Project Name</label>
                                        <input type="text"
                                            onChange={(e) => setProjectData({ ...projectData, projectName: e.target.value })}
                                            value={projectData.projectName}
                                            className="form-control mt-1" id="projectName" aria-describedby="emailHelp" placeholder="Enter Project Name" />
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="form-group mt-3">
                                        <label htmlFor="projectName">Description</label>
                                        <Editor className='mt-1'
                                            onTextChange={(e) => setProjectData({ ...projectData, description: e.htmlValue })}
                                            style={{ height: '240px' }}
                                            value={projectData.description}
                                        />
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="form-group mt-3 col-sm-6 col-12">
                                        <label htmlFor="projectName">Start Date</label>
                                        <input type="date"
                                            onChange={(e) => setProjectData({ ...projectData, startDate: e.target.value })}
                                            value={moment(projectData.startDate).format('YYYY-MM-DD')}
                                            className="form-control mt-1" id="projectName" aria-describedby="emailHelp" />
                                    </div>
                                    <div className="form-group mt-3 col-sm-6 col-12">
                                        <label htmlFor="projectName">End Date</label>
                                        <input type="date"
                                            value={moment(projectData.endDate).format('YYYY-MM-DD')}
                                            onChange={(e) => setProjectData({ ...projectData, endDate: e.target.value })}
                                            className="form-control mt-1" id="projectName" aria-describedby="emailHelp" />
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="form-group mt-3 col-sm-6 col-12">
                                        <label htmlFor="projectName">Due Date</label>
                                        <input type="date"
                                            value={moment(projectData.dueDate).format('YYYY-MM-DD')}
                                            onChange={(e) => setProjectData({ ...projectData, dueDate: e.target.value })}
                                            className="form-control mt-1" id="projectName" aria-describedby="emailHelp" placeholder="Enter Project Name" />
                                    </div>
                                    <div className="form-group mt-3 col-sm-6 col-12">
                                        <label htmlFor="projectName">Project Status</label>
                                        <select name="" id="" className="form-control mt-1"
                                            onChange={(e) => setProjectData({ ...projectData, status: e.target.value })}
                                            value={projectData.status}
                                        >
                                            <option value="">Select Project Status</option>
                                            <option value="Not Started">Not Started</option>
                                            <option value="In Progress">In Progress</option>
                                            <option value="On Hold">On Hold</option>
                                            <option value="Completed">Completed</option>
                                        </select>
                                    </div>
                                </div>
                                {/* <div className="row">
                                    <div className="form-group mt-3">
                                        <label htmlFor="tags">Tags</label>
                                        <select name="tags" className="form-control mt-1" id="">
                                            <option value="Internal">Internal</option>
                                            <option value="External">External</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="form-group mt-3">
                                        <label htmlFor="tags">Member</label>
                                        <input type="text" className="form-control mt-1" id="projectName" aria-describedby="emailHelp" placeholder="Enter Member Name" />

                                    </div>
                                </div> */}
                                <div className="row">
                                    <div className="form-group mt-3">
                                        <button className='btn btn-black' onClick={() => handleUpdateProject()}>Update Project</button>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div >
        </>
    )
}

export default updateProject