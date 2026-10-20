import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";
import {Vector3} from "../../../Vector3";

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

    @Column('int')
    battery!: number;

    @Column('int')
    operationalRadius!: number;

    @Column('float', { default: 0 })
    cost!: number;

    @Column('simple-json')
    startPosition!: Vector3;

    @Column('simple-json')
    position!: Vector3;
}