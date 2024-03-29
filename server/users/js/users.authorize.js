const jwt = require("jsonwebtoken");
const jwtSecret = "4715aed3c946f7b0a38e6b534a9583628d84e96d10fbc04700770d572af3dce43625dd";

// generic auth function not as middleware
// takes only the token and allowed roles as arguments
// returns {success:true/false, user: null/decodedtoken, message: "error message"}



async function authorizeToken (token, allowedRoles = ["admin", "basic"]) {
  if (token) {
    try {
      const decodedToken = jwt.verify(token, jwtSecret);
      console.log("decoded token:",decodedToken);
      if (allowedRoles.includes(decodedToken.role)) {
        return {success: true, user: decodedToken};
      } else {
        return {success: false, user: null, message: "Not authorized, must be one of " + allowedRoles};
      }
    } catch (err) {
      return {success: false, user: null, message: "Not authorized, decoding error"};
    }
  } else {
    return {success: false, user: null, message: "Not authorized, token not available"};
  }
}




// generic auth function as middleware
function auth (req, res, next) {
  const token = req.cookies.jwt;
  

  if (token) {
    jwt.verify(token, jwtSecret, (err, decodedToken) => {
      if (err) {
        req.body.authorized = false;
        req.body.user = null;
        // this middlewear function only checks if token is valid, and adds verified user to req.body or adds to req.authorized = false
        // it does not send a response, so that the route handler can send a response
        console.log("401 - decoded token:",decodedToken);
        next();
        return;

      } else {
        // is role in array of authorized roles?
        if (req.authorizedRoles.includes(decodedToken.role)) {
          req.body.user = decodedToken;
          req.body.authorized = true;
          console.log("ok - decoded token:",decodedToken);
          next();
          return;
        } else {
          console.log("401 - decoded token:",decodedToken);
          // return res.status(401).json({ message: "Not authorized, must be one of " + req.authorizedRoles });
          // instead, add to req.body and let route handler send response
          req.body.authorized = false;
          req.body.user = null;
          next();
          return;
        }
      }
    });
  } else {
    req.body.authorized = false;
    req.body.user = null;
    next()
    return;
  }
};

// admin auth function

function authorizeAdmin (req, res, next) {
  req.authorizedRoles = ["admin"];
  auth(req, res, next);
}

// basic auth function

function authorizeBasic (req, res, next) {
  req.authorizedRoles = ["admin", "basic"];
  auth(req, res, next);
}


// export as single object
module.exports = { authorizeToken, authorizeAdmin, authorizeBasic };