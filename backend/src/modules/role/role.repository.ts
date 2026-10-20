import { Repository } from 'typeorm';
import { RoleEntity } from './role.entity';
import { RoleMapper } from './role.mapper';
import { Role } from './role';

export class RoleRepository {
    private static instance : RoleRepository | undefined;
    private constructor(private readonly repo : Repository<RoleEntity>) {
    }

    static getInstance(repo : Repository<RoleEntity>) : RoleRepository{
        if(!RoleRepository.instance) RoleRepository.instance = new RoleRepository(repo);
        return RoleRepository.instance;
    }

    async save(role : Role) : Promise<Role>{
        const entity = RoleMapper.toEntity(role);
        const savedEntity = await this.repo.save(entity);
        return RoleMapper.toDomain(savedEntity);
    }

}

