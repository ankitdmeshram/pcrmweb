import React, { useEffect, useState } from 'react'
import { useNavigate } from "@remix-run/react";

import "~/styles/styles.css";
import "~/styles/dashboard.css";
import "primereact/resources/themes/lara-light-cyan/theme.css";

import Header from "../components/header";
import Sidebar from "../components/sidebar";
import Spinner from "../components/spinner";

import { domainName, getCookie } from '~/utils/common';

import moment from 'moment';
import Modal from '~/components/modal';

const projects = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [projectData, setProjectData] = useState<any>([])
    const [isLoading, setIsLoading] = useState(true)
    const [modal, setModal] = useState({ show: false, message: "" })

    const navigate = useNavigate()

    useEffect(() => {
        fetchProject()
    }, [])

    const fetchProject = async () => {
        try {
            setIsLoading(true)
            const token = await getCookie("ud").then(res => res)
            const data: any = await fetch(`${domainName()}/api/project/all-project`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-auth-token": `${token}`,
                },
                body: JSON.stringify({}),
            })
                .then((res: any) => {
                    if (res.status === 401) {
                        const url = new URL(window.location.href)
                        setModal({ show: true, message: "Something went wrong" })
                        navigate("/?redirect=" + url.pathname)
                    }
                    return res.json()
                })
                .catch(err => {
                    console.log("err")
                })

            if (data?.success) {
                setProjectData(() => {
                    return data?.projects.map((project: any) => {
                        return {
                            ...project,
                            startDate: project.startDate ? moment(project.startDate).format("DD-MM-YYYY HH:mm") : null,
                            endDate: project.endDate ? moment(project.endDate).format("DD-MM-YYYY HH:mm") : null,
                            updatedAt: project.updatedAt ? moment(project.updatedAt).format("DD-MM-YYYY HH:mm") : null,
                            createdAt: project.createdAt ? moment(project.createdAt).format("DD-MM-YYYY HH:mm") : null,
                        }
                    })
                })
            }
            setIsLoading(false)
        } catch (error) {
            console.log(error)
            setIsLoading(false)
        }
    }

    const deleteProject = async (id: any) => {
        try {
            const confirm = window.confirm("Are you sure you want to delete this project?")
            if (!confirm) return
            setIsLoading(true)

            const token = await getCookie("ud").then(res => res)
            const data: any = await fetch(`${domainName()}/api/project/delete-project`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-auth-token": `${token}`,
                },
                body: JSON.stringify({ _id: id }),
            })
                .then((res: any) => {
                    if (res.status === 401) {
                        const url = new URL(window.location.href)
                        // setModal({ show: true, message: "Something went wrong" })
                        navigate("/?redirect=" + url.pathname)
                        return
                    }
                    setModal({ show: true, message: "Project deleted successfully" })

                    setProjectData((prev: any) => {
                        return prev.filter((project: any) => project._id !== id)
                    })

                    setIsLoading(false)
                    return res.json()
                })
                .catch(err => {
                    setIsLoading(false)
                    console.log("err")
                })
        } catch (error) {
            setIsLoading(false)
            console.log(error)
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

                            <button className='btn btn-black mb-2' onClick={() => navigate("/add-project")}>New Project</button>

                            <div className=" table-main">

                                <div className="table-row thead">
                                    <div className="table-col table-index">Sr. No.</div>
                                    <div className="table-col table-title">Project Name</div>
                                    <div className="col table-col table-date">Status</div>
                                    <div className="col table-col table-date">Tags</div>
                                    <div className="col table-col table-date">Start Date</div>
                                    <div className="col table-col table-date">End Date</div>
                                    <div className="col table-col table-date">Updated At</div>
                                    <div className="col table-col table-date">Created At</div>
                                    <div className="col table-action">Action</div>
                                </div>

                                {
                                    projectData && projectData.length > 0 && projectData.map((project: any, i: number) => {
                                        return <div className="table-row">
                                            <div className="table-col table-index">{i + 1}</div>
                                            <div className="table-col table-title">{project.projectName}</div>
                                            <div className="col table-col table-date">{project.status}</div>
                                            <div className="col table-col table-date">{project.tags}</div>
                                            <div className="col table-col table-date">{project.startDate}</div>
                                            <div className="col table-col table-date">{project.endDate}</div>
                                            <div className="col table-col table-date">{project.updatedAt}</div>
                                            <div className="col table-col table-date">{project.createdAt}</div>
                                            <div className="col table-action">
                                                <button className="col btn btn-black me-1" onClick={() => navigate(`/update-project/${project?._id}`) }>Update</button><button className="col btn btn-danger" onClick={() => deleteProject(project._id)}>Delete</button>
                                            </div>
                                        </div>
                                    })
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default projects;