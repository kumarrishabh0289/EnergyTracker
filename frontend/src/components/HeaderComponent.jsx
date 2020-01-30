import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import AuthenticationForApiService from './AuthenticationForApiService.js'


class HeaderComponent extends Component {
    render() {
        const isUserLoggedIn = AuthenticationForApiService.isUserLoggedIn();
        

        return (
            <header>
                <nav className="navbar navbar-expand-md bg-light navbar-light ">
                    <div><img src="logo.png" height="50" width="120" alt="logo"></img> <a href="/" className="navbar-brand" >Energy Tracker</a></div>
                    <ul className="navbar-nav">
                        {isUserLoggedIn && <li><Link className="nav-link" to="/welcome/OpenHome">Home</Link></li>}
                        
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