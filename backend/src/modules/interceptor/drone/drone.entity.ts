import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";
import {Vector3Data} from "../../../Vector3";

@Entity("Drone")
export class DroneEntity {

    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column('varchar')
    model!: string;

    @Column('int')
    maxSpeed!: number;

    @Column('int')
    maxAcceleration!: number;

    // battery level, percent (0 to 100)
    @Column('float')
    battery!: number;

    // seconds of flight that 1 percent of the battery gives
    @Column('float', { default: 10 })
    batterySecondsPerPercent!: number;

    @Column('int')
    operationalRadius!: number;

    @Column('float', { default: 0 })
    cost!: number;

    // chance (0 to 1) that the drone hits its target
    @Column('float', { default: 0.5 })
    pk!: number;

    // seconds from the assignment until it takes off
    @Column('float', { default: 0 })
    launchDelay!: number;

    @Column('simple-json')
    startPosition!: Vector3Data;

    @Column('simple-json')
    position!: Vector3Data;
}
