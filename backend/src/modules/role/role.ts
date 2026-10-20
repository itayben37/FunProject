import { ERole } from "./ERole";

export class Role{
    constructor(
        public name : string, 
        public age : number,
        public rank : string,
        public role : ERole,
        public id? : string
    ){}

    
}