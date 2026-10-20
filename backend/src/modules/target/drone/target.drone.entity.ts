import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";
import {Vector3Data} from "../../../Vector3";
import { EDanger } from "./EDanger";

@Entity("TargetDrone")
export class TargetDroneEntity {

    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column('simple-json')
    position!: Vector3Data;

    @Column('float')
    speed!: number;

    @Column('simple-json', { default: '{"x":0,"y":0,"z":0}' })
    acceleration!: Vector3Data;

    @Column('simple-json')
    goal!: Vector3Data;

    @Column('int')
    danger!: EDanger;
}
