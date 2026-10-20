import "reflect-metadata";
import express from "express";
import { buildRoleRoutes } from "./modules/role/role.route";
import { buildDroneRoutes } from "./modules/interceptor/drone/drone.router";
import { buildTargetDroneRoutes } from "./modules/target/drone/target.drone.router";
import { AppDataSource } from "./data.source";
import { buildAssignmentRoutes } from "./modules/assignment/assignment.router";
import { roleController, droneController, targetDroneController, assignmentController } from "./container";
import { Request, Response, NextFunction } from "express";
import { AppError } from "./errors/app-error";

export function errorHandler(err: unknown, req: Request, res: Response, next: NextFunction) {
    if (res.headersSent) return next(err);

    if (err instanceof AppError) {
        return res.status(err.statusCode).json({error: err.msg});
    }
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
}

const app = express();
app.use(express.json());
app.use('/api/roles', buildRoleRoutes(roleController));
app.use('/api/drones', buildDroneRoutes(droneController));
app.use('/api/target-drones', buildTargetDroneRoutes(targetDroneController));
app.use('/api/assignments', buildAssignmentRoutes(assignmentController));
app.use(errorHandler);


AppDataSource.initialize().then(() => {
    app.listen(3000);
});