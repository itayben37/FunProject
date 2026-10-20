import { RoleRepository } from "./role.repository";
import { Role } from "./role";
import { ERole } from "./ERole";

export class RoleService{
    private static instance : RoleService | undefined;

    private constructor(private readonly roleRepository : RoleRepository){}

    static getInstance(roleRepository : RoleRepository) : RoleService{
        if(!RoleService.instance) RoleService.instance = new RoleService(roleRepository);
        return RoleService.instance;
    }

    async createRole(name : string, age : number, rank : string, role : ERole) : Promise<Role>{ 
        return await this.roleRepository.save(new Role(name, age, rank, role));
    }
}