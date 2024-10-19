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
import { useNavigate, useParams } from '@remix-run/react';

const addTask = () => {
    const { id } = useParams();

    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [newTask, setNewTask] = useState<any>({
        taskName: '',
        projectId: id,
        description: '',
        startDate: '',
        endDate: '',
        dueDate: '',
        status: '',
        priority: '',
    })
    const [modal, setModal] = useState({ show: false, message: "" })

    useEffect(() => {
        setIsLoading(false)
    }, [])

    useEffect(() => {
        console.log(newTask)
    }, [newTask])

    const navigate = useNavigate()

    const handleAddTask = async () => {
        try {
            if (newTask?.taskName == "") {
                alert('Please enter task name')
                return
            }
            setIsLoading(true)
            const token = await getCookie("ud").then(res => res)

            const data: any = await fetch(`${domainName()}/api/task/create-task`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-auth-token": `${token}`,
                },
                body: JSON.stringify(newTask),
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

                            <div className="row mb-3">
                                <div className="col">
                                    <span className='me-4 pointer-cursor' onClick={() => navigate(`/project/${id}/dashboard`)}>Dashboard</span>
                                    <span className='me-4 pointer-cursor' onClick={() => navigate(`/project/${id}/tasks`)}>Tasks</span>
                                    <span className='me-4 pointer-cursor' onClick={() => navigate(`/project/${id}/add-task`)}>Add Task</span>
                                </div>
                            </div>
                            <hr />

                            <div className="add-project-section">
                                <div className="row">
                                    <div className="col-8">
                                        <h5 className='font-weight-bold'>Add Task</h5>
                                    </div>
                                    <div className="col text-end">
                                        <button className='btn btn-black mb-2' onClick={() => window.history.back()}> <i className="fa fa-arrow-left" aria-hidden="true"></i> Back</button>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="form-group mt-3">
                                        <label htmlFor="taskName">Task Name</label>
                                        <input type="text"
                                            onChange={(e) => setNewTask({ ...newTask, taskName: e.target.value })}
                                            className="form-control mt-1" id="taskName" aria-describedby="emailHelp" placeholder="Enter Task Name" />
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="form-group mt-3">
                                        <label htmlFor="taskName">Description</label>
                                        <Editor className='mt-1'
                                            onTextChange={(e) => setNewTask({ ...newTask, description: e.htmlValue })}
                                            style={{ height: '240px' }} />
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="form-group mt-3 col-sm-4 col-12">
                                        <label htmlFor="startDate">Start Date</label>
                                        <input type="date"
                                            onChange={(e) => setNewTask({ ...newTask, startDate: e.target.value })}
                                            className="form-control mt-1" id="startDate" aria-describedby="emailHelp" />
                                    </div>
                                    <div className="form-group mt-3 col-sm-4 col-12">
                                        <label htmlFor="endDate">End Date</label>
                                        <input type="date"
                                            onChange={(e) => setNewTask({ ...newTask, endDate: e.target.value })}
                                            className="form-control mt-1" id="endDate" aria-describedby="emailHelp" />
                                    </div>
                                    <div className="form-group mt-3 col-sm-4 col-12">
                                        <label htmlFor="dueDate">Due Date</label>
                                        <input type="date"
                                            onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                                            className="form-control mt-1" id="dueDate" aria-describedby="emailHelp" placeholder="Enter Project Name" />
                                    </div>
                                </div>
                                <div className="row">

                                    <div className="form-group mt-3 col-sm-6 col-12">
                                        <label htmlFor="status">Task Status</label>
                                        <select name="" id="" className="form-control mt-1"
                                            onChange={(e) => setNewTask({ ...newTask, status: e.target.value })}
                                        >
                                            <option value="">Select Task Status</option>
                                            <option value="Not Started">Not Started</option>
                                            <option value="In Progress">In Progress</option>
                                            <option value="On Hold">On Hold</option>
                                            <option value="Completed">Completed</option>
                                        </select>
                                    </div>
                                    <div className="form-group mt-3 col-sm-6 col-12">
                                        <label htmlFor="status">Task Priority</label>
                                        <select name="" id="" className="form-control mt-1"
                                            onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                                        >
                                            <option value="">Select Task Priority</option>
                                            <option value="Low">Low</option>
                                            <option value="Medium">Medium</option>
                                            <option value="High">High</option>
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
                                 */}
                                <div className="row">
                                    <div className="form-group mt-3">
                                        <button className='btn btn-black' onClick={() => handleAddTask()}>Add Task</button>
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

export default addTask;