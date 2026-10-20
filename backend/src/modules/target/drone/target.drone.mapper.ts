import { TargetDrone } from "./target.drone";
import { TargetDroneEntity } from "./target.drone.entity";
import { Vector3 } from "../../../Vector3";

export const TargetDroneMapper = {
    toDomain(e : TargetDroneEntity): TargetDrone {
        return new TargetDrone(Vector3.fromData(e.position), e.speed, Vector3.fromData(e.acceleration),
         Vector3.fromData(e.goal), e.danger, e.id);
    },

    toEntity(d : TargetDrone) : Partial<TargetDroneEntity> {
        return {
            position : d.getPosition().toData(),
            speed : d.getSpeed(),
            acceleration : d.getAcceleration().toData(),
            goal : d.getGoal().toData(),
            danger : d.getDanger(),
        };
    }
}
