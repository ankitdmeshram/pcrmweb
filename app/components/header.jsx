import { useNavigate } from "@remix-run/react"
import { signOut } from "../controllers/auth"
const header = ({ setSidebarOpen, sidebarOpen }) => {
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
        <div className="header  bg-white shadow-sm">
            <div className="logo ps-5 pe-3">PCRM <i className="fa-solid fa-bars" onClick={() => setSidebarOpen(!sidebarOpen)}></i></div>
            <div className="pageName ps-4"></div>
        </div>
    )
}

export default header