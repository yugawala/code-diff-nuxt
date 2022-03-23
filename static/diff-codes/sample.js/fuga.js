const fs = require('fs');
const Diff = require('diff');

const [one, two] = [1, 2].map(each=>fs.readFileSync(`diff-codes/sample.js/${each}.js`, 'utf8'));

const diff = Diff.diffLines(one, two);

console.log(diff)