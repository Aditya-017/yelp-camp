class ExpressError extends Error{
    constructor(msg,statuscode){
        super();
        this.message=msg
        this.statusCode=statuscode
    }

}
module.exports=ExpressError;