import axios from 'axios'
import { API_URL } from '../Constants'

export const AUTHENTICATED_USER_SESSION = 'authenticatedUser'

class AuthenticationForApiService {

    

    authenticate(username, password) {
        const data = {
            username: username,
            password: password
           
        }
        return axios.post(`${API_URL}/user/greenninjalogin`, data)
    }

    registerSuccessfulLogin(username, token, name) {
        sessionStorage.setItem(AUTHENTICATED_USER_SESSION, username)
        sessionStorage.setItem("jwt", token)
        sessionStorage.setItem("name", name)
        
    }

    
    logout() {
        sessionStorage.removeItem(AUTHENTICATED_USER_SESSION);
        sessionStorage.removeItem("role");
        sessionStorage.removeItem("jwt");
        sessionStorage.removeItem("name");
    }

    isUserLoggedIn() {
        let user = sessionStorage.getItem(AUTHENTICATED_USER_SESSION)
        let role = sessionStorage.getItem("role")
        if (role === null){
            role = ""
        }
        console.log("isUserLoggedIn role",role.length >0 )
        console.log("isUserLoggedIn user",user != null)
        console.log("isUserLoggedIn condition",(user != null && role.length >0 ))
        if (user != null && role.length > 0) return true
        return false
    }

    getLoggedInUserName() {
        let user = sessionStorage.getItem(AUTHENTICATED_USER_SESSION)
        if (user === null) return ''
        return user
    }

  
}

export default new AuthenticationForApiService()