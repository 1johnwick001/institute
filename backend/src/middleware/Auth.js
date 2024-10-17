import jwt from "jsonwebtoken"



const Auth = async (req,res,next) => {
    try {

        let token = req.headers.authorization;

        if (token) {
            token = token.split(" ")[1]
            let user = jwt.verify(token,process.env.JWT_SECRE_KEY)
            req.userId = user.id 
        } else {
            res.status(401).json({
                message:"XXX===XXX UNAUTHORIZED USER XXX===XXX"
            })
        }
        next()
        
    } catch (error) {
        console.log("error in token middleware",error);
        res.status(401).json({
            message:"Error while verifying user token"
        });
    };
}

export default Auth