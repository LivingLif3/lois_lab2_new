// class SolverOfEqualities {
//     constructor(firstCoefficient, secondCoefficient, answer) {
//         this.firstCoefficient = firstCoefficient;
//         this.secondCoefficient = secondCoefficient;
//         this.answer = answer;
//     }
//
//     calculateFormula(x1, x2) {
//         return Math.max(Math.min(this.firstCoefficient, x1), Math.min(this.secondCoefficient, x2));
//     }
//
//     solve() {
//         for(let i = 0; i < 1; i += 0.01) {
//             for(let j = 0; j < 1; j += 0.01) {
//                 console.log(i, j)
//                 if(this.calculateFormula(i, j) === this.answer) {
//
//                 }
//             }
//         }
//     }
// }

let test = new SolverOfEqualities(0.7, 0.7, 0.7)
test.solve()
