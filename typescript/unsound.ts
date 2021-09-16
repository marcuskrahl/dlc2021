const stringArray: Array<string> = [ 'foo' ];

const numberOrStringArray: Array<number | string> = stringArray;

numberOrStringArray.push(42);

console.log(stringArray);

stringArray.forEach(s => s.toLocaleLowerCase())