import { Link } from "@remix-run/react";
import { useState } from "react";
import Modal from "~/components/modal";
import "~/styles/styles.css";
import { domainName, validateEmail } from "~/utils/common";

const register = () => {
  const [userData, setUserData] = useState({
    fname: "",
    lname: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [showModal, setShowModal] = useState({
    display: false,
    message: "",
    type: "",
  });

  const handleChange = (e: any) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: any) => {
    try {
      e.preventDefault();
      if (!userData.fname || !userData.lname || !userData.email || !userData.phone || !userData.password || !userData.confirmPassword) {
        setShowModal(prev => {
          return {
            ...prev,
            display: true,
            message: "All fields are required",
            type: "info",
          }
        });
        setTimeout(() => {
          setShowModal(prev => {
            return {
              ...prev,
              display: false,
              message: "",
              type: "",
            }
          });
        }, 100);
        return;
      }
      if (userData.password !== userData.confirmPassword) {
        setShowModal(prev => {
          return {
            ...prev,
            display: true,
            message: "Password do not match",
            type: "info",
          }
        });
        setTimeout(() => {
          setShowModal(prev => {
            return {
              ...prev,
              display: false,
              message: "",
              type: "",
            }
          });
        }, 100);
        return;
      }
      if (!validateEmail(userData.email)) {
        setShowModal(prev => {
          return {
            ...prev,
            display: true,
            message: "Invalid email",
            type: "info",
          }
        });
        setTimeout(() => {
          setShowModal(prev => {
            return {
              ...prev,
              display: false,
              message: "",
              type: "",
            }
          });
        }, 100);
        return;
      }
      fetch(`${domainName()}/api/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      })
        .then((res) => res.json())
        .then((data: any) => {
          console.log(data);
          if (data) {
            setShowModal(prev => {
              return {
                ...prev,
                display: true,
                message: data.message,
                type: data.type,
              }
            });
            setTimeout(() => {
              setShowModal(prev => {
                return {
                  ...prev,
                  display: false,
                  message: "",
                  type: "",
                }
              });
            }, 100);
          }
        });
    } catch (error: any) {
      console.log(error);
    }
  }

  return (
    <>
      <Modal show={showModal.display} message={showModal.message} type={showModal.type} setModal={setShowModal} />
      <div className="container-fluid bg-back">
        <div className="row justify-content-center align-items-center h-100vh">
          <div className="col-xxl-6 col-xl-6 col-lg-8 col-md-9 col-sm-11">
            <form className="shadow my-5 gp-5 bg-white rounded-lg" onSubmit={(e) => handleSubmit(e)}>
              <h2 className="text-center fw-bolder mb-2">PCRM</h2>
              <h4 className="text-center fw-bold mb-4">Create Your Account</h4>
              <div className="row">
                <div className="col-sm-6">
                  <div className="mb-3">
                    <label htmlFor="Name">First Name</label>
                    <input type="text" className="form-control" name="fname" onChange={handleChange} value={userData.fname} />
                  </div>
                </div>
                <div className="col-sm-6">
                  <div className="mb-3">
                    <label htmlFor="lname">Last Name</label>
                    <input type="text" className="form-control" name="lname" onChange={handleChange} value={userData.lname} />
                  </div>
                </div>
                <div className="col-sm-6">
                  <div className="mb-3">
                    <label htmlFor="exampleInputEmail1">Email address</label>
                    <input
                      type="text"
                      className="form-control"
                      id="exampleInputEmail1"
                      aria-describedby="emailHelp"
                      name="email"
                      onChange={handleChange}
                      value={userData.email}
                    />
                  </div>
                </div>
                <div className="col-sm-6">
                  <div className="mb-3">
                    <label htmlFor="Name">Phone</label>
                    <input type="text" className="form-control"
                      name="phone"
                      onChange={handleChange}
                      value={userData.phone}
                    />
                  </div>
                </div>
                <div className="col-sm-6">
                  <div className="mb-3">
                    <label htmlFor="exampleInputPassword1">Password</label>
                    <input
                      type="password"
                      className="form-control"
                      id="exampleInputPassword1"
                      name="password"
                      onChange={handleChange}
                      value={userData.password}
                    />
                  </div>
                </div>
                <div className="col-sm-6">
                  <div className="mb-3">
                    <label htmlFor="exampleInputPassword1">
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      id="exampleInputPassword1"
                      name="confirmPassword"
                      onChange={handleChange}
                      value={userData.confirmPassword}
                    />
                  </div>
                </div>
              </div>
              <div className="mb-3 form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="exampleCheck1"
                  required
                />
                <label className="form-check-label" htmlFor="exampleCheck1">
                  I agree to terms and conditions
                </label>
              </div>
              <button type="submit" className="btn btn-primary w-100">
                Sign Up
              </button>
              <p className="text-center mt-4">
                Already have an account? <Link to={"../"}>Login Now</Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default register;
