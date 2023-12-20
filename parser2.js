export class Parser {

    /*Создание класса
    this.data - знания полученные с файла, this.logicalConclusions - логические заключения, this.rules - правила,
    this.logicalConclusionTemplate - шаблон логического заключения для регулярного выражения,
    this.rulesTemplate - шаблон правил для регулярного выражения
    */
    constructor(data) {
        this.data = data
        this.logicalConclusions = []
        this.rules = []
        this.logicalConclusionTemplate =
            /^([A-Z]\d*)=(\{(\([a-z]\d*,((0\.\d+)|(1\.0))\))(,\([a-z]\d*,((0\.\d+)|(1\.0))\))*})|\{}$/
        this.rulesTemplate =
            /^([A-Z]\d*)=\{(\(\([a-z]\d*,[a-z]\d*\),((0\.\d+)|(1\.0))\))(,\(\([a-z]\d*,[a-z]\d*\),((0\.\d+)|(1\.0))\))*}$/
    }

    //Построчно выделяем логические заключения и правила
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

    //Находим выражения, деля на логические заключения и правила
    findExpressions() {
        let type = 'rule'
        for (let i = 0; i < this.data.length; i++) {
            if (this.rulesTemplate.test(this.data[i])) {
                type = 'rule'
            } else if (this.logicalConclusionTemplate.test(this.data[i])){
                type = 'logicalConclusion'
            }
            switch (type) {
                case 'rule' :
                    this.rules.push(this.data[i])
                    break
                case 'logicalConclusion' :
                    this.logicalConclusions.push(this.data[i])
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

    //Проверяем на правильность составления логического заключения
    checkRightValueLogicalConclusions() {
        let test = this.logicalConclusions.filter((item) => {
            return this.logicalConclusionTemplate.test(item)
        })
        return test.length === this.logicalConclusions.length
    }

    //Проверяет на правильность составления правил
    checkRightValuesRules(){
        let test = this.rules.filter((item) => {
            return this.rulesTemplate.test(item)
        })
        return test.length === this.rules.length
    }

    //Парсим логические заключения, разделяя на имя и значения
    parseLogicalConclusions() {
        this.logicalConclusions = this.logicalConclusions.map((el) => {
            el = el.split('=')
            el[1] = el[1].replace(/[}{]/g, '').split('),')
            for (let i = 0; i < el[1].length - 1; i++) {
                el[1][i] += ')'
            }
            return {name: el[0], logicalConclusion: el[1]}
        })
        return this.logicalConclusions
    }

    //Парсит один кортеж на значение
    parseLogicalConclusionElement(element) {
        return element.map((el) => {
            el = el.split('')
            el.shift()
            el.pop()
            el = el.join('')
            let a = [el.split(',')[0], Number(el.split(',')[1])]
            return a
        })
    }

    //Парсим правила, разделяя на имя и значения
    parseRules() {
        this.rules = this.rules.map((el) => {
            el = el.split('=')
            el[1] = el[1].replace(/[}{]/g, '').split('),(')
            el[1][0] = el[1][0].replace(/[(]/, '')
            for (let i = 0; i < el[1].length - 1; i++) {
                el[1][i] += ')'
            }
            return {name: el[0], rule: el[1]}
        })
    }

    //Функция преобразующая логические заключения в удобный для обработки формат данных
    changeLogicalConclusions() {
        return this.logicalConclusions.map((item) => {
            return {
                name: item.name,
                logicalConclusion: this.parseLogicalConclusionElement(item.logicalConclusion)
            }
        })
    }

    //Парсит один кортеж на значение
    parseRulesElement(element) {
        return element.map((el) => {
            el = el.split('')
            el.shift()
            el.pop()
            el = el.join('').split('),')
            return [el[0].split(','), Number(el[1])]
        })
    }

    //Функция преобразующая правила в удобный для обработки формат данных
    changeRules() {
        return this.rules.map((item) => {
            return {name: item.name, rule: this.parseRulesElement(item.rule)}
        })
    }

    //Удаляет пустые строки в базе знаний
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

    //Проверяет существование правил в базе знаний
    checkExistenceRules(){
        return this.rules.length !== 0
    }

    //Проверяет существование логических заключений в базе знаний
    checkExistenceLogicalConclusions(){
        return this.logicalConclusions.length !== 0
    }

    //Проверяет наличие значений в правилах
    filterLogicalConclusions() {
        return this.logicalConclusions.filter((item) => {
            if (item.name && item.logicalConclusion[0][0] && item.logicalConclusion[0][1]) return item
        })
    }

    //Преобразует в удобный для обработки вид правила
    fillRightFormRules() {
        this.rules = this.rules.map((item) => {
            return {name: item.name, rule: this.fillRightFormRule(item.rule)}
        })
    }

    //Преобразует в удобный для обработки вид правило
    fillRightFormRule(binaryPredicate) {
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
            let row = []
            for (let i = 0; i < rows[key].length; i++) {
                row.push(rows[key][i])
            }
            rules.push(row)
        }
        return rules
    }

    //Проверяет правило на то, можно ли его обработать будет или нет
    checkRules(){
        this.rules = this.rules.filter((item) => {
            if (this.checkRule(item.rule))
                return {
                    name: item.name,
                    rule: item.rule
                }
        })
    }

    //Проверяет одно правило на то, чтобы в строках было одинаковое количество элементов
    checkRule(rule){
        let rowLength = rule[0].length
        for (let i = 0; i < rule.length; i++) {
            if (rowLength !== rule[i].length) {
                return false
            }
        }
        return true
    }

    //Возращает значения из парсера
    getValues() {
        return {
            logicalConclusions: this.logicalConclusions,
            rules: this.rules
        }
    }

    //Запускает работу парсера
    startParser(){
        this.splitByLinesExpression()
        this.deleteSpaces()
        this.eraseEmptyStringData()
        this.findExpressions()
        this.eraseWhetherExpression()
        if (!(this.checkRightValueLogicalConclusions()
            && this.checkRightValuesRules())) {
            process.exit(0)
        }
        if (!(this.checkExistenceRules()
            && this.checkExistenceLogicalConclusions())) {
            process.exit(0)
        }
        this.parseLogicalConclusions()
        this.parseRules()
        this.logicalConclusions = this.changeLogicalConclusions()
        this.rules = this.changeRules()
        this.logicalConclusions = this.filterLogicalConclusions()
        this.fillRightFormRules()
        this.checkRules()
        return this.getValues()
    }
}
