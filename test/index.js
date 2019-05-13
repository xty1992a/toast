// console.log(process.argv);

const arr1 = [...Array(100000).map((n, i) => i)];
const arr2 = [...Array(100000).map((n, i) => i)].reverse();

console.time('concat');
arr1.concat(arr2);
console.timeEnd('concat');

console.time('push');
arr1.push(...arr2);
console.timeEnd('push');

console.time('sharpe');
const arr3 = [...arr1, ...arr2];
console.timeEnd('sharpe');


