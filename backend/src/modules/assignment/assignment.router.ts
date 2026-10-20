import {Router} from "express";
import { AssignmentController } from "./assignment.controller";


export function buildAssignmentRoutes(controller : AssignmentController) : Router{
    const router = Router();
    router.post('/', (req, res, next) => controller.assign(req, res, next));
    return router;
}
