// wait for x milliseconds
export const delay = ms => new Promise(res => setTimeout(res, ms));

// generate a unique id. credit to some dude on stack overflow.
export function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

export function distanceBetweenTwoPoints(x1, y1, x2, y2){
    return Math.sqrt(Math.pow((x2 - x1), 2) + Math.pow((y2 - y1), 2));
}

export function angleRadians(x1, y1, x2, y2){
    return Math.atan2(y2-y1, x2-x1);
}

export function angleDegrees(x1, y1, x2, y2){
    return Math.atan2(y2-y1, x2-x1) * 180 / Math.PI;
}


export class Coord{
    constructor(x=0, y=0){
        this.x = parseInt(x);
        this.y = parseInt(y);
    }

    toString(){
        return `${this.x},${this.y}`;
    }
}