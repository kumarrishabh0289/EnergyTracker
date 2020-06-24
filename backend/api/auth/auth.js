
var passport = require("passport");
const JWTstrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;

//This verifies that the token sent by the user is valid
passport.use(new JWTstrategy({
  //secret we used to sign our JWT
  secretOrKey : 'greenninja',
  //we expect the user to send the token as a query paramater with the name 'secret_token'
  // jwtFromRequest : ExtractJWT.fromUrlQueryParameter('secret_token')
  jwtFromRequest : ExtractJWT.fromAuthHeaderAsBearerToken()
}, async (token, done) => {
  try {
    //Pass the user details to the next middleware
    console.log("JWT Authentication Done",token.user)
    return done(null, token.user);
  } catch (error) {
    done(error);
  }
}));