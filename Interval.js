/*
Лабораторная работа №2 по дисциплине ЛОИС
Выполнена студентами группы 121702 БГУИР Летко Александр, Голушко Даниил, Нагла Никита
Вариант 6: Разработать программу для выполнения обратного нечеткого логического вывода, используя нечеткую композицию (max{{min{{xi}⋃{yi}}|i})
*/
export class CompositionEquation {
    constructor(expression, result) {
        this.expression = expression
        this.result = result

        this.repeat = false
        let valuesSet = new Set()
        for (let key in this.expression) {
            valuesSet.add(this.expression[key])
        }

        this.repeat = Array.from(valuesSet).length !== Object.keys(this.expression).length
    }



    solveEquation() {
        let solutions = []

        let varNames = Object.keys(this.expression)

        for(let key in this.expression) {
            let solution = {}

            if(this.expression[key] === this.result) {
                solution = {
                    [key]: new Interval(this.expression[key], 1.0)
                }
            } else if(this.expression[key] < this.result) {
                continue
            } else if(this.expression[key] > this.result) {
                solution = {
                    [key]: new Interval(this.result, this.result)
                }
            }

            for(let key2 in this.expression) {
                if(key2 === key) {
                    continue
                }

                if(this.expression[key2] > this.result) {
                    solution[key2] = new Interval(0.0, this.result)
                } else {
                    solution[key2] = new Interval(0.0, 1.0)
                }
            }

            solutions.push(this.sortKeys(solution))
        }
        return solutions
    }

    sortKeys(obj) {
        const sortedKeys = Object.keys(obj).sort();
        const sortedObj = {};
        sortedKeys.forEach(key => {
            sortedObj[key] = obj[key];
        });

        return sortedObj
    }

    getSolutionsList() {
        let possibleFixedVars = Object.keys(this.expression).filter(varName => this.expression[varName] >= this.result)
        if (possibleFixedVars.length <= 0) {
            return []
        }

        let noSolutionInRow = Object.keys(this.expression).filter(varName => this.expression[varName] > this.result)
        if(noSolutionInRow.length === Object.keys(this.expression).length) {
            return []
        }

        let solutionsList = []

        for (let fixedVar of possibleFixedVars) {
            let solution = {};

            for (let varName in this.expression) {

                if (varName !== fixedVar) {
                    if(this.expression[varName] === this.result) {
                        solution[varName] = new Interval(
                            Math.max(
                                this.expression[varName],
                                this.result
                            ),
                            1.0
                        );
                    } else if(this.expression[varName] > this.result) {
                        solution[varName] = new Interval(this.result, this.result)
                    }
                    else {
                        solution[varName] = new Interval(
                           0,
                            1.0
                        );
                    }
                }
                else {
                    if(this.expression[varName] > this.result) {
                        solution[varName] = new Interval(this.result, this.result)
                    } else {
                        solution[varName] = new Interval(0, 1)
                    }
                }
            }

            solutionsList.push(solution);
        }

        return solutionsList
    }
}

export class Interval {
    constructor(left, right) {
        this.left = left;
        this.right = right
        // this.strictLeft = false
        // this.strictRight = false
    }
}
