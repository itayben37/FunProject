import { Drone } from "./drone.interceptor";
import { DroneEntity } from "./drone.entity";
import { Vector3 } from "../../../Vector3";

export const DroneMapper = {
    toDomain(e : DroneEntity): Drone {
        return new Drone(new Vector3(e.startPosition.x, e.startPosition.y, e.startPosition.z), new Vector3(e.position.x, e.position.y, e.position.z),
         e.maxSpeed, e.maxAcceleration, e.battery, e.operationalRadius, e.cost, e.model, e.id);
    },

    toEntity(d : Drone) : Partial<DroneEntity> {
        return {
            startPosition : d.getStartPosition(),
            position : d.getPosition(),
            maxSpeed : d.getMaxSpeed(),
            maxAcceleration : d.getMaxAcceleration(),
            battery : d.getBattery(),
            operationalRadius : d.getOperationalRadius(),
            cost : d.getCost(),
            model : d.getModel(),
        };
    }
}