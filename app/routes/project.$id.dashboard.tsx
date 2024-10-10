import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from "@remix-run/react";

import "~/styles/styles.css";
import "~/styles/dashboard.css";
import "primereact/resources/themes/lara-light-cyan/theme.css";

import Header from "../components/header";
import Sidebar from "../components/sidebar";
import Spinner from "../components/spinner";

import { domainName, getCookie } from '~/utils/common';

import moment from 'moment';
import Modal from '~/components/modal';

const Tasks = () => {
    const { id } = useParams();

    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [tasksData, setTasksData] = useState<any>([])
    const [isLoading, setIsLoading] = useState(true)
    const [modal, setModal] = useState({ show: false, message: "" })

    const navigate = useNavigate()

    useEffect(() => {
        fetchTasks(id)
    }, [])

    const fetchTasks = async (_id: any) => {
        try {
            setIsLoading(true)
            const token = await getCookie("ud").then(res => res)
            const data: any = await fetch(`${domainName()}/api/task/all-tasks`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-auth-token": `${token}`,
                },
                body: JSON.stringify({ projectId: _id }),
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
                setTasksData(() => {
                    return data?.tasks.map((task: any) => {
                        return {
                            ...task,
                            startDate: task.startDate ? moment(task.startDate).format("DD-MM-YYYY") : null,
                            endDate: task.endDate ? moment(task.endDate).format("DD-MM-YYYY") : null,
                            dueDate: task.dueDate ? moment(task.dueDate).format("DD-MM-YYYY") : null,
                            updatedAt: task.updatedAt ? moment(task.updatedAt).format("DD-MM-YYYY") : null,
                            createdAt: task.createdAt ? moment(task.createdAt).format("DD-MM-YYYY") : null,
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

    const completeTasks = useMemo(() => {
        return tasksData.filter((task: any) => task.status === "Completed").length
    }, [tasksData])

    const inCompleteTasks = useMemo(() => {
        return tasksData.filter((task: any) => task.status !== "Completed").length
    }, [tasksData])

    const overdueTasks = useMemo(() => {
        return tasksData.filter((task: any) => task.status != "Completed" && moment(task.dueDate).isBefore(moment())).length
    }, [tasksData])

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
                            <div className="row mb-3">
                                <div className="col">
                                    <span className='me-4' onClick={() => navigate(`/project/${id}/dashboard`)}>Dashboard</span>
                                    <span className='me-4' onClick={() => navigate(`/project/${id}/tasks`)}>Tasks</span>
                                    <span className='me-4' onClick={() => navigate(`/project/${id}/add-task`)}>Add Task</span>
                                </div>
                            </div>
                            <hr />

                            <div className="row mt-4">
                                <div className="col-sm-3 text-center">
                                    <div className="card mb-4">
                                        <div className="card-body pt-5 pb-2 shadow rounded-3">
                                            <h2 className='fw-bolder'>{completeTasks}</h2>
                                            <p className='fw-bolder fs-5 pb-3'>Completed Tasks</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-sm-3 text-center">
                                    <div className="card mb-4">
                                        <div className="card-body pt-5 pb-2 shadow rounded-3">
                                            <h2 className='fw-bolder'>{inCompleteTasks}</h2>
                                            <p className='fw-bolder fs-5 pb-3'>Incompleted Tasks</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-sm-3 text-center">
                                    <div className="card mb-4">
                                        <div className="card-body pt-5 pb-2 shadow rounded-3">
                                            <h2 className='fw-bolder'>{overdueTasks}</h2>
                                            <p className='fw-bolder fs-5 pb-3'>Overdue Tasks</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-sm-3 text-center">
                                    <div className="card mb-4">
                                        <div className="card-body pt-5 pb-2 shadow rounded-3">
                                            <h2 className='fw-bolder'>{tasksData.length}</h2>
                                            <p className='fw-bolder fs-5 pb-3'>Tasks Tasks</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div >
            </div >
        </>
    )
}

export default Tasks;