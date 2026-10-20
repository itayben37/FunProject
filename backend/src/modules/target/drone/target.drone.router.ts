import {Router} from "express";
import { TargetDroneController } from "./target.drone.controller";


export function buildTargetDroneRoutes(controller : TargetDroneController) : Router{
    const router = Router();
    router.post('/create', (req, res, next) => controller.createTargetDrone(req, res, next));
    router.get('/:id', (req, res, next) => controller.getTargetDroneById(req, res, next));
    return router;
}
