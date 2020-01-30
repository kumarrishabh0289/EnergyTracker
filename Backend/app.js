const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
var cors = require('cors');
const productRoutes = require('./api/routes/products');
const userRoutes = require('./api/routes/user');
const profileRoutes = require('./api/routes/profile');
const courseRoutes = require('./api/routes/course');
const enrollRoutes = require('./api/routes/enroll');
const assignmentRoutes = require('./api/routes/assignment');
const quizRoutes = require('./api/routes/quiz');
const announcementRoutes = require('./api/routes/announcement');
const lectureRoutes = require('./api/routes/lecture');
const submissionRoutes = require('./api/routes/submission');
const permissionRoutes = require('./api/routes/permission');
const mailRoutes = require('./api/routes/mail');
var passport = require("passport");
var passportJWT = require("passport-jwt");



require('./api/auth/auth');



mongoose.connect('mongodb+srv://rishabh53:' +
process.env.MONGO_PASSWORD+ 
'@cluster0-dvu2r.mongodb.net/canvas?retryWrites=true',
{
    useNewUrlParser: true
}
);
mongoose.set('useCreateIndex', true)
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json());
//use cors to allow cross origin resource sharing
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));


app.use(passport.initialize());



var passport = require("passport");






app.post("/secret", passport.authenticate('jwt', { session : false }), function(req, res){

    console.log("success",req.body.data);
    
    res.json({'message': "Success"});
  });

app.use('/product', productRoutes);
app.use('/user', userRoutes);

app.use('/profile',  profileRoutes);
app.use('/course',  courseRoutes);
app.use('/enroll',  enrollRoutes);
app.use('/assignment',  assignmentRoutes);
app.use('/quiz',  quizRoutes);
app.use('/announcement',  announcementRoutes);
app.use('/lecture',  lectureRoutes);
app.use('/submission',  submissionRoutes);
app.use('/permission',  permissionRoutes);
app.use('/mail',  mailRoutes);


app.use((req, res, next) => {
    const error = new Error('Api not found');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error:{
            message: error.message
        }
    });
});

module.exports = app;