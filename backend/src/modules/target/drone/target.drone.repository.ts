import { TargetDroneMapper } from "./target.drone.mapper";
import { Repository } from 'typeorm';
import { TargetDroneEntity } from "./target.drone.entity";
import { TargetDrone } from "./target.drone";

export class TargetDroneRepository{
    private static instance : TargetDroneRepository | undefined;

    private constructor(private readonly repo : Repository<TargetDroneEntity>){}

    static getInstance(repo : Repository<TargetDroneEntity>) : TargetDroneRepository{
        if(!TargetDroneRepository.instance) TargetDroneRepository.instance = new TargetDroneRepository(repo);
        return TargetDroneRepository.instance;
    }

    async save(targetDrone : TargetDrone) : Promise<TargetDrone>{
        const entity = TargetDroneMapper.toEntity(targetDrone);
        const savedEntity = await this.repo.save(entity);
        return TargetDroneMapper.toDomain(savedEntity);
    }

    async findById(id : string) : Promise<TargetDrone | null> {
        const entity = await this.repo.findOneBy({ id });
        return entity ? TargetDroneMapper.toDomain(entity) : null;
    }

}
