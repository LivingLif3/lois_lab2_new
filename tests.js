import {main} from './lab2.js'

let filesWithTests = [
    'test1.txt',
    'test2.txt',
    'test3.txt',
    'test4.txt',
    'test5.txt',
]

for(let test of filesWithTests) {
    main(test)
}
