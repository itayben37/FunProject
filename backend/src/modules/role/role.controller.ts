import { RoleService } from "./role.service";
import {Request, Response, NextFunction} from 'express';

export class RoleController{
    private static instance : RoleController | undefined;

    private constructor(private readonly roleService : RoleService){}

    static getInstance(roleService : RoleService) : RoleController{
        if(!RoleController.instance) RoleController.instance = new RoleController(roleService);
        return RoleController.instance;
    }


    async createRole(req : Request, res : Response, next : NextFunction){
        try{
            const role = await this.roleService.createRole(req.body.name, req.body.age,
                 req.body.rank, req.body.role);
            res.status(201).json(role);
        }catch(err){
            next(err);
        }
    }

}