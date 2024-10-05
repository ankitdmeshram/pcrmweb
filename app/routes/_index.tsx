import { Link, useNavigate } from "@remix-run/react";
import { useState } from "react";
import "~/styles/styles.css";
import Modal from "~/components/modal";
import { domainName, setCookie, validateEmail } from "~/utils/common";

const _index = () => {
  const [userData, setUserData] = useState({
    email: "",
    password: "",
  });

  const [showModal, setShowModal] = useState({
    display: false,
    message: "",
    type: "",
  });

  const handleChange = (e: any) => {
    setUserData({
      ...userData,
      [e.target.name]: e.target.value,
    });
  };

  const navigate = useNavigate()

  const signInHandler = async (e: any) => {
    try {
      e.preventDefault();
      if (!userData.email || !userData.password) {
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
      const response = await fetch(`${domainName()}/api/auth/signin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });
      const data: any = await response.json();
      console.log(data)
      if (data) {
        if (data.success) {
          setCookie("ud", data.token, 30)
          setCookie("uid", data.userId, 30)
          navigate("/dashboard")
          return
        }
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
    } catch (error: any) {
      console.log(error);
      setShowModal(prev => {
        return {
          ...prev,
          display: true,
          message: error.message,
          type: "error",
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
  }

  return (
    <>
      <Modal show={showModal.display} message={showModal.message} type={showModal.type} setModal={setShowModal} />
      <div className="container-fluid bg-back">
        <div className="row justify-content-center align-items-center h-100vh">
          <div className="col-xxl-4 col-xl-5 col-lg-6 col-md-7 col-sm-8">
            <form className="shadow gp-5 bg-white rounded-lg" onSubmit={(e) => signInHandler(e)}>
              <h2 className="text-center fw-bolder mb-2">PCRM</h2>
              <h4 className="text-center fw-bold mb-2">Welcome Back !</h4>
              <p className="text-center mb-4">Sign in to continue</p>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">
                  Email address
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="email"
                  aria-describedby="emailHelp"
                  name="email"
                  value={userData.email}
                  onChange={(e) => handleChange(e)}
                />
                {/* <div id="emailHelp" className="form-text">
                We'll never share your email with anyone else.
              </div> */}
              </div>
              <div className="mb-3">
                <label htmlFor="password" className="form-label">
                  Password
                </label>
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  name="password"
                  value={userData.password}
                  onChange={(e) => handleChange(e)}
                />
              </div>
              <div className="mb-3 form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="required"
                />
                <label className="form-check-label" htmlFor="required">
                  Remember Me
                </label>
              </div>
              <button type="submit" className="btn btn-primary w-100">
                Sign in
              </button>
              <p className="text-center mt-4">
                Don't have an account? <Link to={"/register"}>Register Now</Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default _index;
