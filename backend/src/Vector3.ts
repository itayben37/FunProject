export class Vector3 {
  constructor(private x: number, private y: number, private z: number) {}
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