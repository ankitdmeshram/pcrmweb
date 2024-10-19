import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from "@remix-run/react";

import "~/styles/styles.css";
import "~/styles/dashboard.css";
import "primereact/resources/themes/lara-light-cyan/theme.css";

import Header from "../components/header";
import Sidebar from "../components/sidebar";
import Spinner from "../components/spinner";

import { domainName, getCookie } from '~/utils/common';

import moment from "moment-timezone";
import Modal from '~/components/modal';

const Tasks = () => {
    const { id } = useParams();

    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [tasksData, setTasksData] = useState<any>([])
    const [isLoading, setIsLoading] = useState(true)
    const [modal, setModal] = useState({ show: false, message: "" })
    const [filterOption, setFilterOption] = useState({
        status: ["Completed", "In Progress", "On Hold", "Not Started", "Reset"],
        priority: ["High", "Medium", "Low", "Reset"],
        dueDate: ["Today", "Tomorrow", "This Week", "This Month", "Overdue", "Reset"],
    })

    const [filterData, setFilterData] = useState({
        status: "Reset",
        priority: "Reset",
        dueDate: "Reset",
        taskData: [],
    })

    const navigate = useNavigate()

    useEffect(() => {
        fetchTasks(id)
    }, [])

    useEffect(() => {
        console.log(filterData.dueDate)
        setFilterData((prev: any) => {
            return {
                ...prev,
                taskData: filterData.status == "Reset" && filterData.priority == "Reset" ? tasksData :
                    filterData.status == "Reset" && filterData.priority != "Reset" ? tasksData.filter((task: any) => task.priority === filterData.priority) :
                        filterData.status != "Reset" && filterData.priority == "Reset" ? tasksData.filter((task: any) => task.status === filterData.status) :
                            tasksData.filter((task: any) => task.status === filterData.status && task.priority === filterData.priority)
            }
        })
    }, [filterData.priority, filterData.status, filterData.dueDate])

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
                            updatedAt: task.updatedAt ? moment(task.updatedAt).tz("Asia/Kolkata").format("DD-MM-YYYY HH:mm") : null,
                            createdAt: task.createdAt ? moment(task.createdAt).tz("Asia/Kolkata").format("DD-MM-YYYY HH:mm") : null,
                        }
                    })
                })

                setFilterData((prev: any) => {
                    return {
                        ...prev,
                        taskData: data?.tasks.map((task: any) => {
                            return {
                                ...task,
                                startDate: task.startDate ? moment(task.startDate).format("DD-MM-YYYY") : null,
                                endDate: task.endDate ? moment(task.endDate).format("DD-MM-YYYY") : null,
                                dueDate: task.dueDate ? moment(task.dueDate).format("DD-MM-YYYY") : null,
                                updatedAt: task.updatedAt ? moment(task.updatedAt).tz("Asia/Kolkata").format("DD-MM-YYYY HH:mm") : null,
                                createdAt: task.createdAt ? moment(task.createdAt).tz("Asia/Kolkata").format("DD-MM-YYYY HH:mm") : null,
                            }
                        }
                        )
                    }
                })
            }
            setIsLoading(false)
        } catch (error) {
            console.log(error)
            setIsLoading(false)
        }
    }

    const deleteTask = async (task: any) => {
        try {
            const confirm = window.confirm(`Are you sure you want to delete this task ${task.taskName} ?`)
            if (!confirm) return
            setIsLoading(true)

            const token = await getCookie("ud").then(res => res)
            const data: any = await fetch(`${domainName()}/api/task/delete-task`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-auth-token": `${token}`,
                },
                body: JSON.stringify({ _id: task._id }),
            })
                .then((res: any) => {
                    if (res.status === 401) {
                        const url = new URL(window.location.href)
                        // setModal({ show: true, message: "Something went wrong" })
                        navigate("/?redirect=" + url.pathname)
                        return
                    }
                    setModal({ show: true, message: "Task deleted successfully" })

                    setTasksData((prev: any) => {
                        return prev.filter((taskId: any) => taskId._id != task._id)
                    })
                    setFilterData((prev: any) => {
                        return {
                            ...prev,
                            taskData: prev.taskData.filter((taskId: any) => taskId._id != task._id)
                        }
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

                            <div className="row mb-3">
                                <div className="col">
                                    <span className='me-4 pointer-cursor' onClick={() => navigate(`/project/${id}/dashboard`)}>Dashboard</span>
                                    <span className='me-4 pointer-cursor' onClick={() => navigate(`/project/${id}/tasks`)}>Tasks</span>
                                    <span className='me-4 pointer-cursor' onClick={() => navigate(`/project/${id}/add-task`)}>Add Task</span>
                                </div>
                            </div>
                            <hr />

                            <div className="row">
                                <div className="col">
                                    <button className='btn btn-black mb-2' onClick={() => navigate(`/project/${id}/add-task`)}>New Task</button>
                                </div>
                                <div className="col text-end">
                                    <button className='btn btn-black mb-2' onClick={() => window.history.back()}> <i className="fa fa-arrow-left" aria-hidden="true"></i> Back</button>
                                </div>
                            </div>

                            <div className=" table-main">

                                <div className="table-row thead">
                                    <div className="table-col table-index">Sr. No.</div>
                                    <div className="table-col table-title">Task</div>
                                    <div className="col table-col table-date pointer-cursor" data-bs-toggle="dropdown" aria-expanded="false">{filterData?.status == "Reset" ? "Status" : filterData?.status}</div>
                                    <ul className="dropdown-menu pointer-cursor" style={{ width: "177px" }}>
                                        {filterOption && filterOption.status && filterOption.status.length > 0 &&
                                            filterOption.status.map((filter, i) => {
                                                return <>
                                                    <li onClick={() => setFilterData(prev => {
                                                        return {
                                                            ...prev,
                                                            status: filter
                                                        }
                                                    })}><a className="dropdown-item pointer-cursor" href="#">{filter}</a></li>
                                                    {
                                                        filterData?.status.length != i + 1 && <li><hr className="dropdown-divider" /></li>
                                                    }
                                                </>
                                            })
                                        }
                                    </ul>
                                    <div className="col table-col table-date pointer-cursor" data-bs-toggle="dropdown" aria-expanded="false">{filterData?.priority == "Reset" ? "Priority" : filterData?.priority}</div>
                                    <ul className="dropdown-menu pointer-cursor" style={{ width: "177px" }}>
                                        {filterOption && filterOption.priority && filterOption.priority.length > 0 &&
                                            filterOption.priority.map((filter, i) => {
                                                return <>
                                                    <li onClick={() => setFilterData(prev => {
                                                        return {
                                                            ...prev,
                                                            priority: filter
                                                        }
                                                    })}><a className="dropdown-item pointer-cursor" href="#">{filter}</a></li>
                                                    {
                                                        filterData?.priority.length != i + 1 && <li><hr className="dropdown-divider" /></li>
                                                    }
                                                </>
                                            })
                                        }
                                    </ul>
                                    <div className="col table-col table-date">Start Date</div>
                                    <div className="col table-col table-date">Due Date</div>
                                    <div className="col table-col table-date">End Date</div>
                                    <div className="col table-col table-date">Updated At</div>
                                    <div className="col table-col table-date">Created At</div>
                                    <div className="col table-action">Action</div>
                                </div>

                                {
                                    // tasksData && tasksData.length > 0 && tasksData.map((task: any, i: number) => {
                                    filterData && filterData.taskData && filterData.taskData.length > 0 && filterData.taskData.map((task: any, i: number) => {
                                        return <div className="table-row" style={task.status == "Completed" ? { background: "#d4edda" } : (task.status != "Completed" && moment(task.dueDate).isBefore(moment())) ? { background: "#ff000040" } : task.status == "In Progress" ? { background: "#fff3cd" } : task.status == "On Hold" ? { background: "#f8d7da" } : {}}>
                                            <div className="table-col table-index">{tasksData.length - i}</div>
                                            <div className="table-col table-title pointer-cursor" onClick={() => navigate(`/project/${id}/view-task/${task?._id}`)}>{task.taskName}</div>
                                            <div className="col table-col table-date">{task.status}</div>
                                            <div className="col table-col table-date">{task.priority}</div>
                                            < div className="col table-col table-date" > {task.startDate}</div>
                                            <div className="col table-col table-date">{task.dueDate}</div>
                                            <div className="col table-col table-date">{task.endDate}</div>
                                            <div className="col table-col table-date">{task.updatedAt}</div>
                                            <div className="col table-col table-date">{task.createdAt}</div>
                                            <div className="col table-action">
                                                <button className="col btn btn-black me-1" onClick={() => navigate(`/project/${id}/update-task/${task?._id}`)}>Update</button><button className="col btn btn-danger" onClick={() => deleteTask(task)}>Delete</button>
                                            </div>
                                        </div>
                                    })
                                }
                            </div>
                        </div>
                    </div>
                </div >
            </div >
        </>
    )
}

export default Tasks;