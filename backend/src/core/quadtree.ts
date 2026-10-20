import { BadRequestError } from "../errors/app-error";
import {QuadFuncs} from "./quad";
import {Quad} from "./quad";
import {Point} from "./quad";

export class QuadTree{
    constructor(private quad : Quad, private points : Point[] = [] , private quadTrees : QuadTree[] = [] , private maxToSplit : number = 4){
        if (!QuadFuncs.isQuad(quad)) throw new BadRequestError("QuadTree: area must be a valid Quad");
        if (!Number.isInteger(maxToSplit) || maxToSplit < 1)
            throw new BadRequestError("QuadTree: maxToSplit must be a positive integer");
    }

    addPoint(p : Point){
        if (!QuadFuncs.isPoint(p)) throw new BadRequestError("addPoint: p must be a Point with finite x and y");
        this.points.push(p);
        if(this.points.length > this.maxToSplit)
            this.split();
    }

    getPointsAmount() : number{
        return this.points.length > 0 ? this.points.length : 0;
    }

    isPoints() : boolean{
        return this.points.length > 0 ? true : false;
    }

    getPoints() : Point[]{
        return this.points;
    }

    split() {
        const halfWidth = (this.quad.p2.x - this.quad.p1.x) / 2;
        const halfHeight = (this.quad.p1.y - this.quad.p3.y) / 2;
        const q1 = QuadFuncs.createQuad(this.quad.p1.x, this.quad.p1.y, halfWidth, halfHeight);
        const q2 = QuadFuncs.createQuad(this.quad.p1.x + halfWidth, this.quad.p1.y, halfWidth, halfHeight);
        const q3 = QuadFuncs.createQuad(this.quad.p1.x, this.quad.p1.y - halfHeight, halfWidth, halfHeight);
        const q4 = QuadFuncs.createQuad(this.quad.p1.x + halfWidth, this.quad.p1.y - halfHeight, halfWidth, halfHeight);

        const qt1 = new QuadTree(q1);
        const qt2 = new QuadTree(q2);
        const qt3 = new QuadTree(q3);
        const qt4 = new QuadTree(q4);

        for (const p of this.points) {
            if (QuadFuncs.insideQuad(q1, p)) { qt1.addPoint(p); continue; }
            if (QuadFuncs.insideQuad(q2, p)) { qt2.addPoint(p); continue; }
            if (QuadFuncs.insideQuad(q3, p)) { qt3.addPoint(p); continue; }
            if (QuadFuncs.insideQuad(q4, p)) { qt4.addPoint(p); }
        }

        this.quadTrees = [qt1, qt2, qt3, qt4];
        this.points = [];
    }

    allPointsInQuad(q : Quad) : Point[]{
        if (!QuadFuncs.isQuad(q)) throw new BadRequestError("allPointsInQuad: q must be a valid Quad");
        const ps : Point[] = [];
        if (!QuadFuncs.isOverlap(this.quad, q)) return ps;

        for (const p of this.points) {
            if (QuadFuncs.insideQuad(q, p)) ps.push(p);
        }
        for (const child of this.quadTrees) {
            ps.push(...child.allPointsInQuad(q));
        }
        return ps;
    }

}




