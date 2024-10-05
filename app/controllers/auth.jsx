import { deleteCookie } from "../utils/common";

export const signOut = () => {
    try {
        deleteCookie("ud");
        deleteCookie("uid");
        return true
    } catch (e) {
        console.log(e);
        return false
    }
}
