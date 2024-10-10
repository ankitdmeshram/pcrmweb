import { useNavigate } from "@remix-run/react"
import { signOut } from "../controllers/auth"

const sidebar = ({ sidebarOpen }) => {
    const navigate = useNavigate()

    const handleLogout = () => {
        try {
            if (signOut() == true) {
                navigate("/")
            } else {
                console.log("Error logging out")
            }
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className={sidebarOpen ? "sidebar bg-white shadow-sm sideBarOpen" : "sidebar bg-white shadow-sm"}>
            <div className="sidebar-links">
                <div className="sidebar-link" onClick={() => navigate("../dashboard")}><i className="fa-solid fa-house"></i> Home</div>
                <div className="sidebar-link" onClick={() => navigate("../projects")}><i className="fa-solid fa-briefcase"></i> Projects</div>
                <div className="sidebar-link" onClick={() => navigate("../my-account")}><i className="fa-solid fa-user"></i> My Account</div>
                <div className="sidebar-link" onClick={() => handleLogout()}><i class="fa fa-sign-out" aria-hidden="true"></i> Logout</div>
            </div>
        </div>
    )
}

export default sidebar