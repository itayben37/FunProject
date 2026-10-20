import { AppDataSource } from "./data.source";

import { RoleEntity } from "./modules/role/role.entity";
import { RoleRepository } from "./modules/role/role.repository";
import { RoleService } from "./modules/role/role.service";
import { RoleController } from "./modules/role/role.controller";

import { DroneEntity } from "./modules/interceptor/drone/drone.entity";
import { DroneRepository } from "./modules/interceptor/drone/drone.repository";
import { DroneService } from "./modules/interceptor/drone/drone.service";
import { DroneController } from "./modules/interceptor/drone/drone.controller";

import { TargetDroneEntity } from "./modules/target/drone/target.drone.entity";
import { TargetDroneRepository } from "./modules/target/drone/target.drone.repository";
import { TargetDroneService } from "./modules/target/drone/target.drone.service";
import { TargetDroneController } from "./modules/target/drone/target.drone.controller";
import { InterceptorService } from "./modules/interceptor/interceptor.service";
import { TargetService } from "./modules/target/target.service";
import { AssignmentService } from "./modules/assignment/assignment.service";
import { AssignmentController } from "./modules/assignment/assignment.controller";
import { Vector3 } from "./Vector3";

// role
const roleRepository = RoleRepository.getInstance(AppDataSource.getRepository(RoleEntity));
const roleService = RoleService.getInstance(roleRepository);
export const roleController = RoleController.getInstance(roleService);

// drone
const droneRepository = DroneRepository.getInstance(AppDataSource.getRepository(DroneEntity));
const droneService = DroneService.getInstance(droneRepository, new Vector3(0,0,0));
export const droneController = DroneController.getInstance(droneService);

// target drone
const targetDroneRepository = TargetDroneRepository.getInstance(AppDataSource.getRepository(TargetDroneEntity));
const targetDroneService = TargetDroneService.getInstance(targetDroneRepository);
export const targetDroneController = TargetDroneController.getInstance(targetDroneService);

// general services: a new interceptor or target type is added here, as one more provider
const interceptorService = InterceptorService.getInstance([droneService]);
const targetService = TargetService.getInstance([targetDroneService]);

// assignment
const assignmentService = AssignmentService.getInstance(interceptorService, targetService);
export const assignmentController = AssignmentController.getInstance(assignmentService);




