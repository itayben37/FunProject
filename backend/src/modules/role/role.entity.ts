import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";

@Entity("Role")
export class RoleEntity {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column('varchar')
    name!: string;

    @Column('int')
    age!: number;

    @Column('varchar')
    rank!: string;

    @Column('int')
    role!: number;
}
