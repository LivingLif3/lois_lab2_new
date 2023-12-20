import fs from 'fs';

export class ReadFile {

    constructor(filename) {
        this.filename = filename
    }

    readFile(){
        return fs.readFileSync(this.filename, 'utf-8')
    }

}
