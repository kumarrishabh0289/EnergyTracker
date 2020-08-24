import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import AuthenticationForApiService from './AuthenticationForApiService.js'


class HeaderComponent extends Component {
    render() {
        const isUserLoggedIn = AuthenticationForApiService.isUserLoggedIn();
        var teacher = false
        var student = false
        if (isUserLoggedIn) {
            if (sessionStorage.role == "teacher") {
                teacher = true
            }
            if (sessionStorage.role == "student") {
                student = true
            }
        }


        return (
            <header>
                <nav className="navbar navbar-expand-md bg-light navbar-light ">
                    <div><img src="/logo.png" height="50" width="120" alt="logo"></img> <a className="navbar-brand" >Energy Tracker</a></div>
                    <ul className="navbar-nav">
                        {student && <li><Link className="nav-link" to="/studentdashboard">Student Dashboard</Link></li>}
                        {teacher && <li><Link className="nav-link" to="/teacherdashboard">Teacher Dashboard</Link></li>}

                    </ul>
                    <ul className="navbar-nav navbar-collapse justify-content-end">
                        {!isUserLoggedIn && <li><Link className="nav-link" to="">Login</Link></li>}
                        {isUserLoggedIn && <li><Link className="nav-link" to="/logout" onClick={AuthenticationForApiService.logout}>Logout</Link></li>}
                    </ul>
                </nav>
            </header>
        )
    }
}

export default HeaderComponent