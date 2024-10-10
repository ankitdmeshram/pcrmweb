import React, { useEffect, useState } from 'react'

import "~/styles/styles.css";
import "~/styles/dashboard.css";
import Header from "../components/header";
import Sidebar from "../components/sidebar";
import Spinner from "../components/spinner";

import { domainName, getCookie } from '~/utils/common';
const dashboard = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [isInputDisabled, setisInputDisabled] = useState(true)
    const [isLoading, setIsLoading] = useState(true)
    const [profileData, setProfileData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        gender: "",
        country: "",
        profilePic: ""
    })

    useEffect(() => {
        fetchUserData()
    }, [])

    useEffect(() => {
        console.log(profileData)
    }, [profileData])

    const fetchUserData = async () => {
        try {
            const token = await getCookie("ud").then(res => res)
            const response: any = await fetch(`${domainName()}/api/auth/user-data`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-auth-token": `${token}`,
                },
            }).then(res => res.json())

            if (response?.success) {
                setProfileData(response?.user)
                console.log(response?.user)
            }
            setIsLoading(false)

        } catch (error) {
            setIsLoading(false)
            console.log(error)
        }
    }

    const updateUser = async () => {
        try {
            setIsLoading(true)
            const token = await getCookie("ud").then(res => res)
            const response: any = await fetch(`${domainName()}/api/auth/update-user`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-auth-token": `${token}`,
                },
                body: JSON.stringify(profileData)
            }).then(res => res.json())

            if (response?.success) {
                setisInputDisabled(true)
            }
            setIsLoading(false)

        }
        catch (error) {
            setIsLoading(false)
            console.log(error)
        }
    }
    const uploadProfile = (e: any) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const img: any = new Image();
                img.src = reader.result;

                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const maxSize = 200; // Max size of the image (200px)

                    let width = img.width;
                    let height = img.height;

                    // Calculate the new dimensions based on the max size
                    if (width > height && width > maxSize) {
                        height = (height * maxSize) / width;
                        width = maxSize;
                    } else if (height > width && height > maxSize) {
                        width = (width * maxSize) / height;
                        height = maxSize;
                    }

                    // Set the canvas dimensions to the new calculated size
                    canvas.width = width;
                    canvas.height = height;

                    const ctx: any = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, width, height);

                    // Get the resized image data URL
                    const resizedImage = canvas.toDataURL('image/jpeg');
                    setProfileData((prev: any) => {
                        return {
                            ...prev,
                            profilePic: resizedImage
                        }
                    })
                };

            };
            reader.readAsDataURL(file); // Read file as Data URL
        }

    }

    return (
        <div className="bg-back h-100vh">
            <Header setSidebarOpen={setSidebarOpen} sidebarOpen={sidebarOpen} />
            <Spinner display={isLoading} />

            <div className="main myAccountPage">
                <Sidebar sidebarOpen={sidebarOpen} />
                <div className="main-body">
                    <div className="box shadow-sm">
                        <div className="row">
                            <div className="col">
                                {
                                    isInputDisabled ?
                                        <button className='btn btn-dark px-5 editUpdateBtn' style={{ float: 'right' }} onClick={() => setisInputDisabled(!isInputDisabled)}>Edit</button>
                                        :
                                        <button className='btn btn-dark px-5 editUpdateBtn' style={{ float: 'right' }} onClick={() => { setisInputDisabled(!isInputDisabled); updateUser() }}>Update</button>
                                }
                            </div>
                        </div>
                        <div className="row mt-4">
                            <div className="col-12 user-profile-header">
                                <div className="user-img">
                                    <img src={profileData?.profilePic ? profileData?.profilePic : "/user.png"} alt="" className="" />
                                    {
                                        !isInputDisabled && <>
                                            <label htmlFor="profilePic"><i className="fa-solid fa-camera"></i></label>
                                            <input id='profilePic' type="file" style={{ display: "none" }} onChange={(e) => uploadProfile(e)} />
                                        </>
                                    }
                                </div>
                                <div>
                                    <h3>{profileData?.firstName} {profileData?.lastName}</h3>
                                    <h6>{profileData?.email}</h6>
                                </div>
                            </div>
                        </div>
                        <div className="row mt-2">
                            <div className="col-sm-4">
                                <div className="form-group mt-3">
                                    <label>First Name</label>
                                    <input type="text" value={profileData?.firstName} onChange={(e) => setProfileData(prev => {
                                        return {
                                            ...prev,
                                            firstName: e.target.value
                                        }
                                    })} className='form-control mt-2' disabled={isInputDisabled} />
                                </div>
                            </div>

                            <div className="col-sm-4">
                                <div className="form-group mt-3">
                                    <label>Last Name</label>
                                    <input type="text" value={profileData?.lastName} onChange={(e) => setProfileData(prev => {
                                        return {
                                            ...prev,
                                            lastName: e.target.value
                                        }
                                    })} className='form-control mt-2' disabled={isInputDisabled} />
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-sm-4">
                                <div className="form-group mt-3">
                                    <label>Email {!isInputDisabled && <sup><i className="fa-solid fa-circle-info" title='You cannot change the email address. If this account was created using this email ID by mistake, please contact the administrator or support team for further assistance'></i></sup>}</label>
                                    <input type="text" value={profileData?.email} onChange={(e) => setProfileData(prev => {
                                        return {
                                            ...prev,
                                            email: e.target.value
                                        }
                                    })} className='form-control mt-2' disabled />
                                </div>
                            </div>

                            <div className="col-sm-4">
                                <div className="form-group  mt-3">
                                    <label>Phone</label>
                                    <input type="text" value={profileData?.phone} onChange={(e) => setProfileData(prev => {
                                        return {
                                            ...prev,
                                            phone: e.target.value
                                        }
                                    })} className='form-control mt-2' disabled={isInputDisabled} />
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-sm-4">
                                <div className="form-group mt-3">
                                    <label>Gender</label>
                                    <select onChange={(e) => setProfileData(prev => {
                                        return {
                                            ...prev,
                                            gender: e.target.value
                                        }
                                    })} className='form-control mt-2' disabled={isInputDisabled} value={profileData?.gender}>
                                        <option></option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="Other">I'd prefer not to say</option>
                                    </select>
                                </div>
                            </div>

                            <div className="col-sm-4">
                                <div className="form-group  mt-3">
                                    <label>Country</label>
                                    <input type="text" value={profileData?.country} onChange={(e) => setProfileData(prev => {
                                        return {
                                            ...prev,
                                            country: e.target.value
                                        }
                                    })} className='form-control mt-2' disabled={isInputDisabled} />
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div >
    )
}

export default dashboard