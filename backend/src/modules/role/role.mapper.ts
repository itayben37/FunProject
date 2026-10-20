import { RoleEntity } from "./role.entity";
import { Role } from "./role";

export const RoleMapper={
    toDomain(e : RoleEntity): Role {
        return new Role(e.name, e.age, e.rank, e.role, e.id);
    },

    toEntity(d : Role): Partial<RoleEntity> {
        return {
            name : d.name,
            age : d.age,
            rank : d.rank,
            role : d.role,
        };
    },
}