function myJSONParse(jsonString) {
    let index = 0;

    function parseValue() {
        skipWhitespace();
        const char = jsonString[index];

        if (char === '{') return parseObject();
        if (char === '[') return parseArray();
        if (char === '"') return parseString();
        if (/[-0-9]/.test(char)) return parseNumber();
        if (jsonString.startsWith('true', index)) return parseLiteral('true', true);
        if (jsonString.startsWith('false', index)) return parseLiteral('false', false);
        if (jsonString.startsWith('null', index)) return parseLiteral('null', null);

        throw new SyntaxError(`Unexpected character '${char}' at position ${index}`);
    }

    function parseObject() {
        index++; // skip '{'
        const obj = {};
        let first = true;

        while (jsonString[index] !== '}') {
            skipWhitespace();
            if (!first) {
                expect(',');
                skipWhitespace();
            } else {
                first = false;
            }

            const key = parseString();
            skipWhitespace();
            expect(':');
            skipWhitespace();
            const value = parseValue();
            obj[key] = value;
            skipWhitespace();
        }
        index++; // skip '}'
        return obj;
    }

    function parseArray() {
        index++; // skip '['
        const arr = [];
        let first = true;

        while (jsonString[index] !== ']') {
            skipWhitespace();
            if (!first) {
                expect(',');
                skipWhitespace();
            } else {
                first = false;
            }

            const value = parseValue();
            arr.push(value);
            skipWhitespace();
        }
        index++; // skip ']'
        return arr;
    }

    function parseString() {
        index++; // skip '"'
        let str = '';

        while (jsonString[index] !== '"') {
            if (jsonString[index] === '\\') {
                index++;
                const escapeChar = jsonString[index];
                if (escapeChar === '"' || escapeChar === '\\' || escapeChar === '/') {
                    str += escapeChar;
                } else if (escapeChar === 'b') {
                    str += '\b';
                } else if (escapeChar === 'f') {
                    str += '\f';
                } else if (escapeChar === 'n') {
                    str += '\n';
                } else if (escapeChar === 'r') {
                    str += '\r';
                } else if (escapeChar === 't') {
                    str += '\t';
                } else if (escapeChar === 'u') {
                    str += String.fromCharCode(parseInt(jsonString.slice(index + 1, index + 5), 16));
                    index += 4;
                } else {
                    throw new SyntaxError(`Unexpected escape character at position ${index}`);
                }
            } else {
                str += jsonString[index];
            }
            index++;
        }
        index++; // skip '"'
        return str;
    }

    function parseNumber() {
        const numberRegex = /-?\d+(\.\d+)?([eE][+-]?\d+)?/y;
        numberRegex.lastIndex = index;
        const match = numberRegex.exec(jsonString);

        if (!match) {
            throw new SyntaxError(`Invalid number at position ${index}`);
        }

        index = numberRegex.lastIndex;
        return parseFloat(match[0]);
    }

    function parseLiteral(literal, value) {
        if (jsonString.slice(index, index + literal.length) !== literal) {
            throw new SyntaxError(`Unexpected literal at position ${index}`);
        }
        index += literal.length;
        return value;
    }

    function expect(char) {
        if (jsonString[index] !== char) {
            throw new SyntaxError(`Expected '${char}' at position ${index}`);
        }
        index++;
    }

    function skipWhitespace() {
        const whitespace = /\s*/y;
        whitespace.lastIndex = index;
        const match = whitespace.exec(jsonString);
        index = whitespace.lastIndex;
    }

    const result = parseValue();
    skipWhitespace();

    if (index < jsonString.length) {
        throw new SyntaxError(`Unexpected character at position ${index}`);
    }

    return result;
}

// Testing the function
const jsonString = '{"name": "John", "age": 30, "city": "New York", "isStudent": false, "scores": [95, 85, 92]}';

const jsonObject = myJSONParse(jsonString);

console.log(jsonObject);

const jsonString1 = '{"name": "Alice", "age": 25, "city": "Wonderland"}';
const jsonObject1 = myJSONParse(jsonString1);
console.log(jsonObject1);

const jsonString2 = '{"person": {"name": "Bob", "age": 28}, "city": "New York"}';
const jsonObject2 = myJSONParse(jsonString2);
console.log(jsonObject2);
// Output: { person: { name: 'Bob', age: 28 }, city: 'New York' }

const jsonString3 = '[{"name": "Charlie", "age": 32}, {"name": "Dana", "age": 27}]';
const jsonObject3 = myJSONParse(jsonString3);
console.log(jsonObject3);
// Output: [ { name: 'Charlie', age: 32 }, { name: 'Dana', age: 27 } ]

const jsonString4 = '{"name": "Eve", "children": [{"name": "Frank", "age": 10}, {"name": "Grace", "age": 8}], "isStudent": false}';
const jsonObject4 = myJSONParse(jsonString4);
console.log(jsonObject4);
// Output: { name: 'Eve', children: [ { name: 'Frank', age: 10 }, { name: 'Grace', age: 8 } ], isStudent: false }

const jsonString5 = '{"booleanTrue": true, "booleanFalse": false, "nullValue": null, "number": 123.45, "string": "Hello, world!"}';
const jsonObject5 = myJSONParse(jsonString5);
console.log(jsonObject5);
// Output: { booleanTrue: true, booleanFalse: false, nullValue: null, number: 123.45, string: 'Hello, world!' }