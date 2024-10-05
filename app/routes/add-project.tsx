import { useEffect, useState } from 'react'

import "~/styles/styles.css";
import "~/styles/dashboard.css";
import "primereact/resources/themes/lara-light-cyan/theme.css";

import { Editor } from 'primereact/editor';

import Header from "../components/header";
import Sidebar from "../components/sidebar";
import Spinner from "../components/spinner";
import { domainName, getCookie } from '~/utils/common';
import Modal from '~/components/modal';
import { useNavigate } from '@remix-run/react';

const projects = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [newProject, setNewProject] = useState<any>({
        projectName: '',
        description: '',
        startDate: '',
        endDate: '',
        dueDate: '',
        status: '',
    })
    const [modal, setModal] = useState({ show: false, message: "" })

    useEffect(() => {
        setIsLoading(false)
    }, [])

    const navigate = useNavigate()

    const handleAddProject = async () => {
        try {
            if (newProject?.projectName == "") {
                alert('Please enter project name')
                return
            }
            setIsLoading(true)
            const token = await getCookie("ud").then(res => res)

            const data: any = await fetch(`${domainName()}/api/project/create-project`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-auth-token": `${token}`,
                },
                body: JSON.stringify(newProject),
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
            console.log(error)
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
                                <h5 className='font-weight-bold'>Add Project</h5>
                                <div className="row">
                                    <div className="form-group mt-3">
                                        <label htmlFor="projectName">Project Name</label>
                                        <input type="text"
                                            onChange={(e) => setNewProject({ ...newProject, projectName: e.target.value })}
                                            className="form-control mt-1" id="projectName" aria-describedby="emailHelp" placeholder="Enter Project Name" />
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="form-group mt-3">
                                        <label htmlFor="projectName">Description</label>
                                        <Editor className='mt-1'
                                            onTextChange={(e) => setNewProject({ ...newProject, description: e.htmlValue })}
                                            style={{ height: '240px' }} />
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="form-group mt-3 col-sm-6 col-12">
                                        <label htmlFor="projectName">Start Date</label>
                                        <input type="date"
                                            onChange={(e) => setNewProject({ ...newProject, startDate: e.target.value })}
                                            className="form-control mt-1" id="projectName" aria-describedby="emailHelp" placeholder="Enter Project Name" />
                                    </div>
                                    <div className="form-group mt-3 col-sm-6 col-12">
                                        <label htmlFor="projectName">End Date</label>
                                        <input type="date"
                                            onChange={(e) => setNewProject({ ...newProject, endDate: e.target.value })}
                                            className="form-control mt-1" id="projectName" aria-describedby="emailHelp" placeholder="Enter Project Name" />
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="form-group mt-3 col-sm-6 col-12">
                                        <label htmlFor="projectName">Due Date</label>
                                        <input type="date"
                                            onChange={(e) => setNewProject({ ...newProject, dueDate: e.target.value })}
                                            className="form-control mt-1" id="projectName" aria-describedby="emailHelp" placeholder="Enter Project Name" />
                                    </div>
                                    <div className="form-group mt-3 col-sm-6 col-12">
                                        <label htmlFor="projectName">Project Status</label>
                                        <select name="" id="" className="form-control mt-1"
                                            onChange={(e) => setNewProject({ ...newProject, status: e.target.value })}
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
                                        <button className='btn btn-black' onClick={() => handleAddProject()}>Add Project</button>
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

export default projects;