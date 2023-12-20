export class Parser {

    //Создание класса
    constructor(data) {
        this.data = data
        this.predicates = []
        this.binaryPredicates = []
        this.binaryPredicateTemplate =
            /^([A-Z]\d*)=\{(\(\([a-z]\d*,[a-z]\d*\),((0\.\d+)|(1\.0))\))(,\(\([a-z]\d*,[a-z]\d*\),((0\.\d+)|(1\.0))\))*}$/
        this.predicateTemplate =
            /^([A-Z]\d*)=(\{(\([a-z]\d*,((0\.\d+)|(1\.0))\))(,\([a-z]\d*,((0\.\d+)|(1\.0))\))*})|\{}$/
    }

    //Построчно выделяем посылки и предикаты
    splitByLinesExpression() {
        this.data = this.data.split('\r\n')
        return this.data
    }

    //Удаляем пробелы
    deleteSpaces() {
        this.data = this.data.map((item) => {
            return item.replace(/ /g, '')
        })
    }

    //Находим выражения, деля на предикаты и посылки
    findExpressions() {
        let type = 'binaryPredicate'
        for (let i = 0; i < this.data.length; i++) {
            if (this.binaryPredicateTemplate.test(this.data[i])) {
                type = 'binaryPredicate'
            } else if (this.predicateTemplate.test(this.data[i])){
                type = 'predicate'
            }
            switch (type) {
                case 'binaryPredicate' :
                    this.binaryPredicates.push(this.data[i])
                    break
                case 'predicate' :
                    this.predicates.push(this.data[i])
                    break
            }
        }
    }

    //Выделяем значащие выражения
    eraseWhetherExpression() {
        this.data = this.data.filter((item) => {
            if (item) return item
        })
        return this.data
    }

    //Проверяем на правильность составления предиката
    checkRightValuePredicates() {
        let test = this.predicates.filter((item) => {
            return this.predicateTemplate.test(item)
        })
        return test.length === this.predicates.length
    }

    //Проверяет на правильность составления бинарных предикатов
    checkRightValuesBinaryPredicates(){
        let test = this.binaryPredicates.filter((item) => {
            return this.binaryPredicateTemplate.test(item)
        })
        return test.length === this.binaryPredicates.length
    }

    //Парсим предикаты, разделяя на имя множества и значения
    parsePredicates() {
        this.predicates = this.predicates.map((el) => {
            el = el.split('=')
            el[1] = el[1].replace(/[}{]/g, '').split('),')
            for (let i = 0; i < el[1].length - 1; i++) {
                el[1][i] += ')'
            }
            return el[1]
        })
        return this.predicates
    }

    //Парсит один кортеж на ключ и значение
    parsePredicateElement(element) {
        return element.map((el) => {
            el = el.split('')
            el.shift()
            el.pop()
            el = el.join('')
            return [el.split(',')[0], Number(el.split(',')[1])]
        })
    }

    parseBinaryPredicate() {
        this.binaryPredicates = this.binaryPredicates.map((el) => {
            el = el.split('=')
            el[1] = el[1].replace(/[}{]/g, '').split('),(')
            el[1][0] = el[1][0].replace(/[(]/, '')
            for (let i = 0; i < el[1].length - 1; i++) {
                el[1][i] += ')'
            }
            return el[1]
        })
    }

    //Функция преобразующая множество в новое множество
    changePredicates() {
        this.predicates = this.predicates.map((item) => {
            return this.parsePredicateElement(item)
        })
    }

    parseBinaryPredicateElement(element) {
        return element.map((el) => {
            el = el.split('')
            el.shift()
            el.pop()
            el = el.join('').split('),')
            return [el[0].split(','), Number(el[1])]
        })
    }

    changeBinaryPredicates() {
        this.binaryPredicates = this.binaryPredicates.map((item) => {
            return this.parseBinaryPredicateElement(item)
        })
    }

    //Удаляет пустые строки до первой посылки
    eraseEmptyStringData() {
        let i = 0
        while (i < this.data.length) {
            if (!this.data[i]) {
                this.data.splice(i, 1)
                i--
            }
            i++
        }
    }

    checkExistenceBinaryPredicates(){
        return this.binaryPredicates.length !== 0
    }

    checkExistencePredicates(){
        return this.predicates.length !== 0
    }

    filterPredicates() {
        this.predicates = this.predicates.filter((item) => {
            if (item[0] && item[1]) return item
        })
    }

    fillRightFormBinaryPredicates() {
        this.binaryPredicates = this.binaryPredicates.map((item) => {
            return this.fillRightFormBinaryPredicate(item)
        })
    }

    fillRightFormBinaryPredicate(binaryPredicate) {
        let rows = {}
        for (let i = 0; i < binaryPredicate.length; i++) {
            if (binaryPredicate[i][0][0] in rows) {
                rows[binaryPredicate[i][0][0]].push(binaryPredicate[i])
            } else {
                rows[binaryPredicate[i][0][0]] = [binaryPredicate[i]]
            }
        }
        let rules = []
        for (let key in rows) {
            console.log(key)
            let row = []
            for (let i = 0; i < rows[key].length; i++) {
                row.push(rows[key][i])
            }
            rules.push(row)
        }
        return rules
    }

    checkBinaryPredicates(){
        this.binaryPredicates = this.binaryPredicates.filter((binaryPredicate) => {
            if (this.checkBinaryPredicate(binaryPredicate)) return binaryPredicate
        })
    }

    checkBinaryPredicate(binaryPredicate){
        let rowLength = binaryPredicate[0].length
        for (let i = 0; i < binaryPredicate.length; i++) {
            if (rowLength !== binaryPredicate[i].length) {
                return false
            }
        }
        return true
    }

    returnValues() {
        return {
            logicalConclusions: this.predicates,
            rules: this.binaryPredicates
        }
    }

    //Запускает работу парсера
    startParser(){
        this.splitByLinesExpression()
        this.deleteSpaces()
        this.eraseEmptyStringData()
        this.findExpressions()
        this.eraseWhetherExpression()
        if (!(this.checkRightValuePredicates()
            && this.checkRightValuesBinaryPredicates())) {
            process.exit(0)
        }
        if (!(this.checkExistenceBinaryPredicates()
            && this.checkExistencePredicates())) {
            process.exit(0)
        }
        this.parsePredicates()
        this.parseBinaryPredicate()
        this.changePredicates()
        this.changeBinaryPredicates()
        this.filterPredicates()
        this.fillRightFormBinaryPredicates()
        this.checkBinaryPredicates()
        let returnValues = this.returnValues()
        return returnValues
    }
}
