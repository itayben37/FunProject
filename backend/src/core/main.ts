import { QuadTree } from "./quadtree";
import {QuadFuncs, Quad, Point} from "./quad";
import { Interceptor } from "../modules/interceptor/interceptor";
import { Target } from "../modules/target/target";
import { BadRequestError } from "../errors/app-error";
import { calculateTargetThreatScore } from "../modules/target/threat.score";
import { cost, CostScale, UNREACHABLE_COST, MAX_PAIR_COST } from "./cost";
import { hungarianAlgo } from "./hungarian.algo";

// maxTime and maxCost are the scale of cost(): timeNorm = time the interceptor needs / maxTime,
// costNorm = price of the interceptor / maxCost. The weights are in cost.ts, and Pk is a field of every interceptor.
export type CostParams = CostScale & {
    assetImportancy : number; // input of the threat score, 1 (low) to 3 (high)
};

export type CostMatrix = {
    interceptorIds : string[]; // row i of costs is the interceptor interceptorIds[i]
    targetIds : string[];      // column j of costs is the target targetIds[j]
    costs : number[][];        // costs[i][j], UNREACHABLE_COST when interceptor i can't reach target j
    unpairedCosts : number[];  // unpairedCosts[j] is the cost of leaving target j without an interceptor
};

export type Pairing = {
    interceptorId : string;
    targetId : string;
    cost : number;             // the cost of this pair, from the formula
};

export type AssignmentResult = {
    pairs : Pairing[];
    unpairedTargetIds : string[]; // targets without an interceptor: nobody can reach them, or the ones that can are worth more elsewhere
    totalCost : number;           // the cost of all the pairs added up. The penalty for the unpaired targets is not in it
};

// Pairs the interceptors with the targets, so the total cost is the lowest.
// An interceptor gets at most one target and a target at most one interceptor. A target is not in the result
// if nobody can reach it, or if the interceptors that can reach it are worth more on other targets.
// The quad tree holds the position of every interceptor (with its id), it is only used to skip the ones that are far away.
export function main(interceptors : Interceptor[], targets : Target[],
     quadInterceptorTeers : QuadTree, params : CostParams) : AssignmentResult{
    const matrix : CostMatrix = buildCostMatrix(interceptors, targets, quadInterceptorTeers, params);
    return assignInterceptors(matrix);
}

// Builds the cost matrix of the interceptors against the targets.
// Rows are only the interceptors that can reach at least one target.
export function buildCostMatrix(interceptors : Interceptor[], targets : Target[],
     quadInterceptorTeers : QuadTree, params : CostParams) : CostMatrix{
    validate(params);

    const interceptorById : Map<string, Interceptor> = new Map();
    for(const interceptor of interceptors){
        const interceptorId = interceptor.getId();
        if(!interceptorId){throw new BadRequestError("Id was null or incorrect");}
        interceptorById.set(interceptorId, interceptor);
    }
    // the tree is searched with the biggest radius, cost() then decides for every pair if it can really happen
    const radius : number = interceptors.reduce((max, interceptor) => Math.max(max, interceptor.getOperationalRadius()), 0);

    const interceptorIds : string[] = [];
    const targetIds : string[] = [];
    const unpairedCosts : number[] = [];
    const rowOf : Map<string, number> = new Map();
    const costs : number[][] = [];

    for(let j = 0; j < targets.length; j++){
        const target = targets[j];
        const id = target.getId();
        if(!id){throw new BadRequestError("Id was null or incorrect");}
        targetIds.push(id);

        const threat : number = calculateTargetThreatScore(target, params.assetImportancy);
        if(!Number.isFinite(threat)) throw new BadRequestError("Threat score of target " + id + " is not a number");
        // the same as the worst pair this target can have: every part of the cost at its worst
        unpairedCosts.push(threat * MAX_PAIR_COST);

        const position = target.getPosition();
        const quad : Quad = QuadFuncs.createQuad(position.getX() - radius, position.getY() + radius, radius * 2, radius * 2);
        const points : Point[] = quadInterceptorTeers.allPointsInQuad(quad);

        for(const point of points){
            const distance : number = Math.hypot(point.x - position.getX(), point.y - position.getY());
            if(distance > radius) continue; // the quad is a square around the circle, so its corners are out of reach
            if(!point.id) throw new BadRequestError("Interceptor point (" + point.x + ", " + point.y + ") has no id");
            const interceptor = interceptorById.get(point.id);
            if(!interceptor) throw new BadRequestError("Interceptor " + point.id + " is in the tree but not in the interceptors list");

            const pair : number = cost(interceptor, target, params);
            if(pair >= UNREACHABLE_COST) continue; // it can't catch this target, so it gets no row because of it

            let row = rowOf.get(point.id);
            if(row === undefined){
                row = interceptorIds.length;
                rowOf.set(point.id, row);
                interceptorIds.push(point.id);
                costs.push(new Array(targets.length).fill(UNREACHABLE_COST));
            }
            // cost of a pair = threat of the target * cost(interceptor, target).
            // an interceptor must be in the tree only once, a second point of it would overwrite this cell
            costs[row][j] =threat * pair;
        }
    }
    return { interceptorIds, targetIds, costs, unpairedCosts };
}

// Finds the pairs with the lowest total cost.
// hungarianAlgo needs a square matrix and gives every row a column, so two kinds of dummies are added:
//  - a dummy interceptor for every target. It costs unpairedCosts[j] to give it target j, and then target j stays unpaired.
//  - a dummy target for every interceptor. It costs 0, and then the interceptor stays unused.
// Without the first kind, when there are not enough interceptors the targets with the highest threat would be
// the ones left unpaired, because their pairs have the highest costs.
export function assignInterceptors(matrix : CostMatrix) : AssignmentResult{
    const interceptorCount : number = matrix.interceptorIds.length;
    const targetCount : number = matrix.targetIds.length;
    if(interceptorCount === 0) return { pairs : [], unpairedTargetIds : [...matrix.targetIds], totalCost : 0 };

    const size : number = interceptorCount + targetCount;
    const padded : number[][] = [];
    for(let i = 0; i < size; i++){
        const line : number[] = new Array(size).fill(0); // the columns of the dummy targets stay 0
        for(let j = 0; j < targetCount; j++){
            line[j] = i < interceptorCount ? matrix.costs[i][j] : matrix.unpairedCosts[j];
        }
        padded.push(line);
    }

    const pairing : Pairing[] = [];
    const pairedTargets : Set<number> = new Set();
    for(const [i, j] of hungarianAlgo(padded).pairs){
        if(i >= interceptorCount || j >= targetCount) continue; // a dummy is not a real pair
        if(matrix.costs[i][j] >= UNREACHABLE_COST) continue;
        pairing.push({ interceptorId : matrix.interceptorIds[i], targetId : matrix.targetIds[j], cost : matrix.costs[i][j] });
        pairedTargets.add(j);
    }
    return {
        pairs : pairing,
        unpairedTargetIds : matrix.targetIds.filter((id, j) => !pairedTargets.has(j)),
        totalCost : pairing.reduce((sum, pair) => sum + pair.cost, 0),
    };
}

// cost() checks the interceptor and the target of every pair, this checks the rest
function validate(params : CostParams){
    if(!Number.isFinite(params.maxTime) || params.maxTime <= 0)
        throw new BadRequestError("maxTime must be a number > 0");
    if(!Number.isFinite(params.maxCost) || params.maxCost <= 0)
        throw new BadRequestError("maxCost must be a number > 0");
    if(!Number.isFinite(params.assetImportancy))
        throw new BadRequestError("assetImportancy must be a number");
}
