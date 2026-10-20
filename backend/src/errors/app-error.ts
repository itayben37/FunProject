export class AppError extends Error{
    constructor(public statusCode : number, public msg : string){
        super(msg);
    }
}

export class NotFoundError extends AppError{
    constructor(msg : string = "Not found"){
        super(404, msg);
    }
}

export class BadRequestError extends AppError{
    constructor(msg : string = "Bad request"){
        super(400, msg);
    }
}