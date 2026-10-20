import {DroneMapper} from "./drone.mapper";
import { Repository } from 'typeorm';
import { DroneEntity } from "./drone.entity";
import { Drone } from "./drone.interceptor";

export class DroneRepository{
    private static instance : DroneRepository | undefined;

    private constructor(private readonly repo : Repository<DroneEntity>){}

    static getInstance(repo : Repository<DroneEntity>) : DroneRepository{
        if(!DroneRepository.instance) DroneRepository.instance = new DroneRepository(repo);
        return DroneRepository.instance;
    }

    async save(drone : Drone) : Promise<Drone>{
        const entity = DroneMapper.toEntity(drone);
        const savedEntity = await this.repo.save(entity);
        return DroneMapper.toDomain(savedEntity);
    }

    async findAll() : Promise<Drone[]>{
        const entities = await this.repo.find();
        return entities.map(DroneMapper.toDomain);
    }
}