const Point = require('./Point');
const State = require('./State');

class Cell {
    constructor(r, c, value) {
        this.r = r;
        this.c = c;
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