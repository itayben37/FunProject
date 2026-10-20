import { RoleController } from "./role.controller";
import { Router } from "express";

export function buildRoleRoutes(roleController : RoleController) {
    const router = Router();
    router.post('/create', (req, res, next) => roleController.createRole(req, res, next));
    return router;
}

