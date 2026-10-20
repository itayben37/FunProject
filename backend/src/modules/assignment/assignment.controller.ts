import { AssignmentService } from "./assignment.service";
import {Request, Response, NextFunction} from 'express';

export class AssignmentController{
    private static instance : AssignmentController | undefined;

    private constructor(private readonly assignmentService : AssignmentService){}

    static getInstance(assignmentService : AssignmentService) : AssignmentController{
        if(!AssignmentController.instance) AssignmentController.instance = new AssignmentController(assignmentService);
        return AssignmentController.instance;
    }

    async assign(req : Request, res : Response, next : NextFunction){
        try{
            const body = req.body ?? {};
            const result = await this.assignmentService.assign(body.maxTime, body.maxCost, body.assetImportancy);
            res.status(200).json(result);
        }catch(err){
            next(err);
        }
    }

}
