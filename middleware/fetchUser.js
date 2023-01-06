var jwt = require('jsonwebtoken');
const JWT_SECRET = "Ramisagood$oy"
const fetchUser=(req,res,next)=>{
    // Get the user from jwt token and add to req object
    const token = req.header('auth-token')
    if(!token){
        res.status(401).send({error : "Please enter a valid data to authenticate user"})
    }
   try {
    let data = jwt.verify(token ,JWT_SECRET)
    req.user = data.user
   next()
   } catch (error) {
    res.status(401).send({error : "Please enter a valid data to authenticate user"})
   }
}

module.exports = fetchUser