import { BadRequestError } from "../../errors/app-error";

export class Battery{
    constructor(private level : number, private secondsPerPercent : number){
        if(!Number.isFinite(level) || level < 0 || level > 100)
            throw new BadRequestError("battery level must be a number from 0 to 100");
        if(!Number.isFinite(secondsPerPercent) || secondsPerPercent <= 0)
            throw new BadRequestError("battery secondsPerPercent must be a number > 0");
    }

    // percent that is left, 0 to 100
    getLevel() : number{
        return this.level;
    }

    // how many seconds of flight 1 percent of the battery gives
    getSecondsPerPercent() : number{
        return this.secondsPerPercent;
    }

    // seconds the interceptor can fly and still keep reservePercent in the battery
    getUsableSeconds(reservePercent : number) : number{
        return Math.max(this.level - reservePercent, 0) * this.secondsPerPercent;
    }
}
