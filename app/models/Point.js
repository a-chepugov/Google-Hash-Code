
class Point {
    constructor (r, c){
        this.r = r;
        this.c = c;
    }

    toString() {
        return `${this.r} ${this.c}`;
    }
}

module.exports = Point;