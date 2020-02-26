import React, {Component} from 'react'
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'
import AuthenticatedRoute from './AuthenticatedRoute.jsx'
import LoginComponent from './LoginComponent.jsx'
import ErrorComponent from './ErrorComponent.jsx'
import HeaderComponent from './HeaderComponent.jsx'
import FooterComponent from './FooterComponent.jsx'
import LogoutComponent from './LogoutComponent.jsx'
import WelcomeComponent from './WelcomeComponent.jsx'
import FrontPage from './FrontPage.jsx'
import SignUp from './SignUp'
import StudentDashboard from './StudentDashboard'
import TeacherDashboard from './TeacherDashboard'
import AddCourse from './AddCourse'
import CourseDetail from './CourseDetail'


class EnergyTracker extends Component {
    render() {
        return (
            <div className="AgCloudApp">
                <Router>
                    <>
                        <HeaderComponent/>
                        <Switch>
                            <Route path="/" exact component={FrontPage}/>
                            <Route path="/login" component={FrontPage}/>
                            <AuthenticatedRoute path="/welcome/:name" component={WelcomeComponent}/>
                            <Route path="/signup" component={SignUp}/>
                            <AuthenticatedRoute path="/logout" component={LogoutComponent}/>
                            <AuthenticatedRoute path="/studentdashboard" component={StudentDashboard}/>
                            <AuthenticatedRoute path="/teacherdashboard" component={TeacherDashboard}/>
                            <AuthenticatedRoute path="/addcourse" component={AddCourse}/>
                            <AuthenticatedRoute path="/coursedetail" component={CourseDetail}/>
                            <Route component={ErrorComponent}/>
                        </Switch>
                       
                    </>
                </Router>
               
            </div>
        )
    }
}

export default EnergyTracker