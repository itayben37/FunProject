import { Drone } from "./drone.interceptor";
import { DroneEntity } from "./drone.entity";
import { Battery } from "../battery";
import { Vector3 } from "../../../Vector3";

export const DroneMapper = {
    toDomain(e : DroneEntity): Drone {
        return new Drone(Vector3.fromData(e.startPosition), Vector3.fromData(e.position),
         e.maxSpeed, e.maxAcceleration, new Battery(e.battery, e.batterySecondsPerPercent), e.operationalRadius,
         e.cost, e.pk, e.launchDelay, e.model, e.id);
    },

    toEntity(d : Drone) : Partial<DroneEntity> {
        return {
            startPosition : d.getStartPosition().toData(),
            position : d.getPosition().toData(),
            maxSpeed : d.getMaxSpeed(),
            maxAcceleration : d.getMaxAcceleration(),
            battery : d.getBattery().getLevel(),
            batterySecondsPerPercent : d.getBattery().getSecondsPerPercent(),
            operationalRadius : d.getOperationalRadius(),
            cost : d.getCost(),
            pk : d.getPk(),
            launchDelay : d.getLaunchDelay(),
            model : d.getModel(),
        };
    }
}
