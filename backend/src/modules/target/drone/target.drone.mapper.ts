import { TargetDrone } from "./target.drone";
import { TargetDroneEntity } from "./target.drone.entity";
import { Vector3 } from "../../../Vector3";

export const TargetDroneMapper = {
    toDomain(e : TargetDroneEntity): TargetDrone {
        return new TargetDrone(new Vector3(e.position.x, e.position.y, e.position.z), e.speed,
         new Vector3(e.goal.x, e.goal.y, e.goal.z), e.danger, e.id);
    },

    toEntity(d : TargetDrone) : Partial<TargetDroneEntity> {
        return {
            position : d.getPosition(),
            speed : d.getSpeed(),
            goal : d.getGoal(),
            danger : d.getDanger(),
        };
    }
}
