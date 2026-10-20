import { Interceptor } from "./interceptor";

// Anything that can give the interceptors of one type (drones today, missile batteries later).
export interface InterceptorProvider{
    findAll() : Promise<Interceptor[]>;
}

// The general service: all the interceptors, whatever their type.
export class InterceptorService{
    private static instance : InterceptorService | undefined;

    private constructor(private readonly providers : InterceptorProvider[]){}

    static getInstance(providers : InterceptorProvider[]) : InterceptorService{
        if(!InterceptorService.instance) InterceptorService.instance = new InterceptorService(providers);
        return InterceptorService.instance;
    }

    async findAll() : Promise<Interceptor[]>{
        const lists : Interceptor[][] = await Promise.all(this.providers.map(provider => provider.findAll()));
        return lists.flat();
    }
}
