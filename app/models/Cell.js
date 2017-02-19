class Cell {
    constructor(r, c, value) {
        this.r = r;
        this.c = c;
        this.value = value
    }

    valueOf() {
        return this.toString();
    }

    toString() {
        return this.value;
    }
}

module.exports = Cell;