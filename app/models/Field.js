class Field {
    constructor (pizza, point) {
        let field = [];
        let {R, C, H, cells} = pizza;
        let {r, c} = point;
        let drMax = r + H < R? H : (R - r);

        for (let dr = 0; dr < drMax; dr++ ) {
            let rI = dr + r;

            let row = [];
            let dcH = Math.floor(H / (dr + 1));
            let dcMax = dcH + c < C? dcH : (C - c);

            for (let dc = 0; dc < dcMax; dc++ ) {
                let cI = dc + c;
                let cell = cells[rI][cI];
                row.push(cell)
            }
            field.push(row);
        }
        Object.assign(this, {point, cells:field})
    }

    valueOf () {
        return this.toString();
    }

    toString () {
        let string = '';
        for(let row of this.cells) {
            string += (row.join('') + '\n');
        }
        return string;
    }
}

module.exports = Field;