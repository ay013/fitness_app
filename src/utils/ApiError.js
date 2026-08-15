class ApiError extends Error {//it inherits from JavaScript's built-in Error clas
    constructor(
        statusCode,
        message = "Something went wrong ",
        errors = [],
        stack = ""

    ) {

        //         super refers to the Parent Class(the built -in Error class).
        // Since you extended Error, you must call super before using this.
        super(message)
        this.statusCode = statusCode
        this.data = null
        this.message = message
        this.success = false;
        this.errors = errors

        // "Capture the current location of the file where this error happened.
        if (stack) {
            this.stack = stack
        }
        else {
            Error.captureStackTrace(this, this.constructor)
        }
    }
}
export { ApiError }
// This is a custom error class for your API.Instead of using JavaScript's basic Error, you create your own special error with more information useful for APIs.


// Parameter	What It Is	         Example
// statuscode	HTTP status code	404, 500, 401
// message	Error description	   "User not found"
// error	Additional error details  ["Field required"]
// statck	Stack trace(debug info)	  File names, line numbers