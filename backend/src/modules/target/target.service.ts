import { Target } from "./target";

// Anything that can give the targets of one type (target drones today, ballistic targets later).
export interface TargetProvider{
    findAll() : Promise<Target[]>;
}

// The general service: all the targets, whatever their type.
export class TargetService{
    private static instance : TargetService | undefined;

    private constructor(private readonly providers : TargetProvider[]){}

    static getInstance(providers : TargetProvider[]) : TargetService{
        if(!TargetService.instance) TargetService.instance = new TargetService(providers);
        return TargetService.instance;
    }

    async findAll() : Promise<Target[]>{
        const lists : Target[][] = await Promise.all(this.providers.map(provider => provider.findAll()));
        return lists.flat();
    }
}
