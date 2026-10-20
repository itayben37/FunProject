import { InterceptorService } from "../interceptor/interceptor.service";
import { TargetService } from "../target/target.service";
import { Interceptor } from "../interceptor/interceptor";
import { QuadTree } from "../../core/quadtree";
import { QuadFuncs, Quad } from "../../core/quad";
import { main, AssignmentResult } from "../../core/main";
import { Target } from "../target/target";

export class AssignmentService{
    private static instance : AssignmentService | undefined;

    private constructor(private readonly interceptorService : InterceptorService,
         private readonly targetService : TargetService){}

    static getInstance(interceptorService : InterceptorService, targetService : TargetService) : AssignmentService{
        if(!AssignmentService.instance)
            AssignmentService.instance = new AssignmentService(interceptorService, targetService);
        return AssignmentService.instance;
    }

    // Loads every interceptor and every target and runs the engine on them.
    // maxCost is optional: it defaults to the price of the most expensive interceptor.
    // The values are checked by the engine.
    async assign(maxTime : number, maxCost : number | undefined, assetImportancy : number) : Promise<AssignmentResult>{
        const interceptors : Interceptor[] = await this.interceptorService.findAll();
        const targets : Target[] = await this.targetService.findAll();

        const tree : QuadTree = new QuadTree(this.boundsOf(interceptors));
        for(const interceptor of interceptors){
            const position = interceptor.getPosition();
            tree.addPoint({ x : position.getX(), y : position.getY(), id : interceptor.getId() });
        }

        const mostExpensive : number = interceptors.reduce((max, interceptor) => Math.max(max, interceptor.getCost()), 0);
        return main(interceptors, targets, tree, { maxTime, maxCost : maxCost ?? mostExpensive, assetImportancy });
    }

    // the smallest quad that holds all the interceptors, with a margin so none of them is on the edge
    private boundsOf(interceptors : Interceptor[]) : Quad{
        const margin : number = 1;
        if(interceptors.length === 0) return QuadFuncs.createQuad(-margin, margin, margin * 2, margin * 2);
        const xs : number[] = interceptors.map(interceptor => interceptor.getPosition().getX());
        const ys : number[] = interceptors.map(interceptor => interceptor.getPosition().getY());
        const minX : number = Math.min(...xs), maxX : number = Math.max(...xs);
        const minY : number = Math.min(...ys), maxY : number = Math.max(...ys);
        return QuadFuncs.createQuad(minX - margin, maxY + margin, maxX - minX + margin * 2, maxY - minY + margin * 2);
    }
}
