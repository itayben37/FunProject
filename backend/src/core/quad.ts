import { BadRequestError } from "../errors/app-error";

export type Point = {x : number, y : number, id? : string}; //id is the id of the interceptor that stands at this point
export type Quad = {p1 : Point; p2 : Point; p3 : Point; p4 : Point;}; //p1 is top left, p2 is top right, p3 is left down, right, down

export const QuadFuncs = {
    createQuad(topLeftX: number, topLeftY: number, width: number, height: number): Quad {
        return {
            p1: { x: topLeftX, y: topLeftY },                  
            p2: { x: topLeftX + width, y: topLeftY },          
            p3: { x: topLeftX, y: topLeftY - height },          
            p4: { x: topLeftX + width, y: topLeftY - height }  
        };
    },

    isPoint(p: unknown): p is Point {
        return typeof p === "object" && p !== null &&
            Number.isFinite((p as Point).x) && Number.isFinite((p as Point).y);
    },

    isQuad(q: unknown): q is Quad {
        return typeof q === "object" && q !== null &&
            QuadFuncs.isPoint((q as Quad).p1) && QuadFuncs.isPoint((q as Quad).p2) &&
            QuadFuncs.isPoint((q as Quad).p3) && QuadFuncs.isPoint((q as Quad).p4);
    },

    calculateArea(q : Quad) : number{
        if (!QuadFuncs.isQuad(q)) throw new BadRequestError("calculateArea: q must be a valid Quad");
        return (q.p2.x - q.p1.x) * (q.p1.y - q.p3.y);
    },

    isOverlap(q1: Quad, q2 : Quad) : boolean{
        const overlapX = q1.p1.x < q2.p2.x && q2.p1.x < q1.p2.x;
        const overlapY = q1.p3.y < q2.p1.y && q2.p3.y < q1.p1.y;
        return overlapX && overlapY;
    },

    insideQuad(q : Quad, p : Point) : boolean{
        if (!QuadFuncs.isQuad(q)) throw new BadRequestError("insideRectangle: q must be a valid Quad");
        if (!QuadFuncs.isPoint(p)) throw new BadRequestError("insideRectangle: p must be a valid Point");
        return (p.x >= q.p1.x && p.x <= q.p2.x && p.y >= q.p3.y && p.y <= q.p1.y) ? true : false;
    }
}