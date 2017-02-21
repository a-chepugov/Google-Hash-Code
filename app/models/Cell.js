const Point = require('./Point');
const State = require('./State');

class Cell extends Point {
    constructor(r, c, value) {
        super(r, c);
        this.value = value
    }

    toPoint() {
        return new Point(this.r, this.c)
    }

    valueOf() {
        return this.value;
    }

    toString() {
        return `${this.r} ${this.c} (${this.value})`;
    }
}

module.exports = Cell;