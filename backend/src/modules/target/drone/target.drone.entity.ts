import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";
import {Vector3} from "../../../Vector3";
import { EDanger } from "./EDanger";

@Entity("TargetDrone")
export class TargetDroneEntity {

    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column('simple-json')
    position!: Vector3;

    @Column('float')
    speed!: number;

    @Column('simple-json')
    goal!: Vector3;

    @Column('int')
    danger!: EDanger;
}
