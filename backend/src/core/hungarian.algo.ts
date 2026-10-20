type Assignment = {
    pairs: [number, number][]; // [interceptorIndex, targetIndex]
    totalCost: number;
};

export function hungarianAlgo(matrix: number[][]): Assignment {
    const n = matrix.length;
    if (n === 0) return { pairs: [], totalCost: 0 };

    const reduced = matrix.map(row => [...row]);
    for (const row of matrix) {
        if (row.length !== n) throw new Error("Matrix must be square: pad it first");
        for (const v of row) {
            if (!Number.isFinite(v)) throw new Error("Costs must be finite: use a large number, not Infinity");
        }
    }

    // steps 1 + 2
    subEachRow(reduced);
    subEachColumn(reduced);

    // steps 3 + 4, repeated until everyone has a zero
    let matching = findMatching(reduced);
    while (matching.size < n) {
        const cover = findCover(reduced, matching);
        adjustMatrix(reduced, cover);
        matching = findMatching(reduced);
    }

    // step 5: read the pairs, and take the cost from the ORIGINAL matrix
    const pairs: [number, number][] = [];
    let totalCost = 0;
    for (let r = 0; r < n; r++) {
        const c = matching.rowToCol[r];
        pairs.push([r, c]);
        totalCost += matrix[r][c];
    }
    return { pairs, totalCost };
}

function subEachRow(matrix : number[][]){
    for(let i = 0; i < matrix.length; i++){
        let sub = findMin(matrix[i]);
        subtract(matrix[i], sub);
    }
}

function subEachColumn(matrix: number[][]) {
    const colCount = matrix[0].length;
    for (let c = 0; c < colCount; c++) {
        const min = findMin(matrix.map(row => row[c])); 
        for (let r = 0; r < matrix.length; r++) {
            matrix[r][c] -= min;                       
        }
    }
}

function findMin(arr : number []) : number {
    let min : number = Infinity;
    for(const a of arr){
        if(a < min) min = a; 
    }
    return min;
}

function subtract(arr : number[], sub : number) : number[] {
    for(let i = 0; i < arr.length; i++){
        arr[i] -= sub;
    }
    return arr;
}


type Matching = {
    rowToCol: number[]; // rowToCol[r] = column matched to row r, or -1
    colToRow: number[]; // colToRow[c] = row matched to column c, or -1
    size: number;       // how many rows got a zero
};

function findMatching(reduced: number[][]): Matching {
    const n = reduced.length;
    const rowToCol: number[] = new Array(n).fill(-1);
    const colToRow: number[] = new Array(n).fill(-1);
    let size = 0;

    for (let row = 0; row < n; row++) {
        // fresh "already tried" list for every row
        const visited: boolean[] = new Array(n).fill(false);
        if (tryAssign(row, reduced, rowToCol, colToRow, visited)) size++;
    }
    return { rowToCol, colToRow, size };
}

// Tries to give `row` a zero. Returns true if it succeeded.
function tryAssign(
    row: number,
    reduced: number[][],
    rowToCol: number[],
    colToRow: number[],
    visited: boolean[]
): boolean {
    for (let col = 0; col < reduced.length; col++) {
        if (reduced[row][col] !== 0 || visited[col]) continue;
        visited[col] = true;

        // the column is free, OR its current owner can move to another zero
        if (colToRow[col] === -1 ||
            tryAssign(colToRow[col], reduced, rowToCol, colToRow, visited)) {
            rowToCol[row] = col;
            colToRow[col] = row;
            return true;
        }
    }
    return false;
}


type Cover = {
    coveredRows: boolean[];
    coveredCols: boolean[];
};

function findCover(reduced: number[][], matching: Matching): Cover {
    const n = reduced.length;
    const markedRows: boolean[] = new Array(n).fill(false);
    const markedCols: boolean[] = new Array(n).fill(false);

    // 1. mark every row that has no matched zero
    for (let r = 0; r < n; r++) {
        if (matching.rowToCol[r] === -1) markedRows[r] = true;
    }

    // 2 + 3. repeat until nothing new gets marked
    let changed = true;
    while (changed) {
        changed = false;
        for (let r = 0; r < n; r++) {
            if (!markedRows[r]) continue;
            for (let c = 0; c < n; c++) {
                if (reduced[r][c] === 0 && !markedCols[c]) {
                    markedCols[c] = true;           // column with a zero in a marked row
                    changed = true;
                    const owner = matching.colToRow[c];
                    if (owner !== -1) markedRows[owner] = true; // its matched row
                }
            }
        }
    }

    return {
        coveredRows: markedRows.map(marked => !marked), // unmarked rows get a line
        coveredCols: markedCols,                        // marked columns get a line
    };
}


function adjustMatrix(reduced: number[][], cover: Cover): void {
    const n = reduced.length;

    // smallest value that no line touches
    let min = Infinity;
    for (let r = 0; r < n; r++) {
        for (let c = 0; c < n; c++) {
            if (!cover.coveredRows[r] && !cover.coveredCols[c]) {
                min = Math.min(min, reduced[r][c]);
            }
        }
    }

    for (let r = 0; r < n; r++) {
        for (let c = 0; c < n; c++) {
            const rowCovered = cover.coveredRows[r];
            const colCovered = cover.coveredCols[c];
            if (!rowCovered && !colCovered) reduced[r][c] -= min; // uncovered: subtract
            else if (rowCovered && colCovered) reduced[r][c] += min; // crossing: add
            // covered by one line: unchanged
        }
    }
}