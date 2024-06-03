Explanation and Reflection
Tokenization and Parsing: The function uses regular expressions 
and manual parsing to handle different JSON elements. 
It correctly identifies and processes objects, arrays, strings, numbers, booleans, and null.

Error Handling: 
The function throws syntax errors with informative messages when unexpected characters or invalid JSON structures are encountered.

Challenges: 
The main challenge was ensuring proper handling of escape characters within strings and nested structures. 
Regular expressions helped in identifying patterns, but manual parsing logic was necessary for proper nesting and error checking.

Explanation:
skipWhitespace: Skips any whitespace characters.

expect: Ensures the next character matches the expected character and advances the index.

parseValue: Determines the type of the next value (object, array, string, number, or literal) and parses it accordingly.
parseObject: Parses JSON objects, ensuring keys are strings and values are parsed correctly.
parseArray: Parses JSON arrays, ensuring values are parsed correctly.
parseString: Parses JSON strings, handling escape sequences correctly.
parseNumber: Parses JSON numbers using a regular expression.
parseLiteral: Parses JSON literals (true, false, null).