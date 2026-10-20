import { TargetDroneService } from "./target.drone.service";
import {Request, Response, NextFunction} from 'express';

export class TargetDroneController{
    private static instance : TargetDroneController | undefined;

    private constructor(private readonly targetDroneService : TargetDroneService){}

    static getInstance(targetDroneService : TargetDroneService) : TargetDroneController{
        if(!TargetDroneController.instance) TargetDroneController.instance = new TargetDroneController(targetDroneService);
        return TargetDroneController.instance;
    }


    async createTargetDrone(req : Request, res : Response, next : NextFunction){
        try{
            const body = req.body ?? {};
            const targetDrone = await this.targetDroneService.createTargetDrone(body.position,
                 body.speed, body.goal, body.danger);
            res.status(201).json(targetDrone);
        }catch(err){
            next(err);
        }
    }

    async getTargetDroneById(req : Request, res : Response, next : NextFunction){
        try{
            const targetDrone = await this.targetDroneService.findById(req.body.id);
            res.status(201).json(targetDrone);
        }catch(err){
            next(err);
        }
    }
}
