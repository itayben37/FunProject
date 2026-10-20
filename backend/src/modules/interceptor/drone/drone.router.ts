import {Router} from "express";
import { DroneController } from "./drone.controller";


export function buildDroneRoutes(controller : DroneController) : Router{
    const router = Router();
    router.post('/save', (req, res, next) => controller.createDrone(req, res, next))
    return router;
}
