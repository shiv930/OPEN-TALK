class ApiError extends Error{
    constructor(
        statusCode,
        message="something went wrong",
        errors=[],
        stack=""
    ){
        super(message)
        this.statusCode= statusCode,
        this.errors=errors
        if(stack){
            this.stack=stack
        }else{
            Error.captureStackTrace(this, this.constructor)
        }
    }
}

export default ApiError


///ApiError = error create karna.

//errorMiddleware = error ko pakad kar client ko bhejna.
//ApiResponse = success ke liye ek ready‑made template.