// A vector as plain data: what the request body and the database columns hold (no methods).
export type Vector3Data = { x: number; y: number; z: number };

export function isVector3Data(p: unknown): p is Vector3Data {
  return typeof p === "object" && p !== null &&
    [(p as Vector3Data).x, (p as Vector3Data).y, (p as Vector3Data).z].every(Number.isFinite);
}

export class Vector3 {
  constructor(private x: number, private y: number, private z: number) {}

  static fromData(d: Vector3Data): Vector3 { return new Vector3(d.x, d.y, d.z); }
  toData(): Vector3Data { return { x: this.x, y: this.y, z: this.z }; }

  add(o: Vector3): Vector3 { return new Vector3(this.x + o.x, this.y + o.y, this.z + o.z); }
  sub(o: Vector3): Vector3 { return new Vector3(this.x - o.x, this.y - o.y, this.z - o.z); }
  scale(k: number): Vector3 { return new Vector3(this.x * k, this.y * k, this.z * k); }
  dot(o: Vector3): number { return this.x * o.x + this.y * o.y + this.z * o.z; }
  magnitude(): number { return Math.sqrt(this.dot(this)); }
  normalize(): Vector3 { const m = this.magnitude(); return this.scale(1 / m); }
  distanceTo(o: Vector3): number { return this.sub(o).magnitude(); }

  getX() : number{
    return this.x;
  }
  getY() : number{
    return this.y;
  }
  getZ() : number{
    return this.z;
  }
}