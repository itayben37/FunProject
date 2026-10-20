// data-source.ts
import { DataSource } from "typeorm";
import { RoleEntity } from "./modules/role/role.entity";
import { DroneEntity } from "./modules/interceptor/drone.entity";
import { TargetDroneEntity } from "./modules/target/drone/target.drone.entity";
import dotenv from "dotenv";
import path from "path";
dotenv.config({path : path.resolve(__dirname, "../../.env")});

export const AppDataSource = new DataSource({
    type: "postgres",          // or whichever DB you use
    host: "localhost",
    port: 5433,
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    entities: [RoleEntity, DroneEntity, TargetDroneEntity],
    synchronize: true,
});
