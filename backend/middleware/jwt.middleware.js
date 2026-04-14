import { StatusCodes,ReasonPhrases } from "http-status-codes";
import jwtHelper  from "../helpers/jwt.helper.js";

const verifyToken = (req, res, next) => {
    const bearerHeader = req.headers["authorization"]

    console.log("Incoming Authorization Header:", bearerHeader);
    
    if (!bearerHeader) {
        console.log("No authorization header found!");
        return res.status(StatusCodes.FORBIDDEN).json({
            message:ReasonPhrases.FORBIDDEN,
        });
    }
    else {
        // Remove "Bearer " prefix and then remove any accidental spaces/newlines from the token itself
        let token = bearerHeader.startsWith("Bearer ") 
            ? bearerHeader.slice(7) 
            : bearerHeader;
        
        token = token.replace(/\s/g, ""); // Remove all whitespace
        
        // Remove accidental quotes if the user copied them from the JSON response
        if (token.startsWith('"') && token.endsWith('"')) {
            token = token.slice(1, -1);
        }

        const {error, payload} = jwtHelper.verifyToken(token);

        if (error) {
            console.log("JWT Verification Error:", error.message);
            return res.status(StatusCodes.FORBIDDEN).json({
                message: "Token is invalid",
                reason: error.message
            });
        } 
        else {
            req.user = payload
            next()
        }
    }
    
};

export default verifyToken