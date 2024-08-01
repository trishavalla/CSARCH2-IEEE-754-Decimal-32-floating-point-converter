/**
 * Processes the number based on the selected operation and displays results.
 */
function processNumber() {
    // Get the base number and exponent from the inputs
    const baseNumberInput = document.getElementById('baseInput').value.trim();
    const exponentInput = document.getElementById('exponentInput').value.trim();

    const baseNumber = new Decimal(baseNumberInput);
    const exponent = new Decimal(exponentInput);

    const number = baseNumber.times(Decimal.pow(10, exponent)); // Calculate the full number using decimal.js

    // Get the selected operation
    const operation = document.getElementById('operation').value;

    let result;

    if (operation === 'none') {
        result = number.toString();
    } else if (operation === 'truncate') {
        // Convert the number to a string
        let numberStr = number.toFixed(); // Use toFixed to avoid scientific notation issues

        // Check if the number has a decimal part
        if (numberStr.includes('.')) {
            // Split the number into integer and decimal parts
            let [integerPart, decimalPart] = numberStr.split('.');

            // If the decimal part is not empty, remove the last digit
            if (decimalPart.length > 0) {
                decimalPart = decimalPart.slice(0, -1);
            }

            // Handle case where truncated decimal part becomes empty
            result = integerPart + (decimalPart.length > 0 ? '.' + decimalPart : '');
        } else {
            result = numberStr;
        }

        // Ensure the result is a valid number string
        result = new Decimal(result).toString();
    } else if (operation === 'roundUp') {
        // Round up
        const numberStr = number.toString();
        const isFloat = numberStr.includes('.');

        // Find significant figures
        let significantFigures = 0;
        if (isFloat) {
            const [integerPart, fractionalPart] = numberStr.split('.');
            significantFigures = integerPart.replace(/^0+/, '').length + fractionalPart.replace(/0+$/, '').length;
            if (integerPart === '0') {
                significantFigures = fractionalPart.replace(/^0+/, '').length;
            }
        } else {
            significantFigures = numberStr.replace(/^0+/, '').length;
        }

        if (significantFigures === 0) {
            result = Math.ceil(number).toFixed(0);
        } else {
            // Determine rounding precision
            const decimalPlaces = numberStr.includes('.') ? numberStr.split('.')[1].length : 0;
            const roundingPrecision = decimalPlaces - 1;
            const factor = Math.pow(10, roundingPrecision);

            // Round up and format the result
            const roundedNumber = Math.ceil(number * factor) / factor;
            result = roundedNumber.toFixed(roundingPrecision).replace(/(\.\d*?[1-9])0+$/, '$1').replace(/\.$/, '');
        }
    } else if (operation === 'roundDown') {
        // Round down
        const numberStr = number.toString();
        const isFloat = numberStr.includes('.');

        // Find significant figures
        let significantFigures = 0;
        if (isFloat) {
            const [integerPart, fractionalPart] = numberStr.split('.');
            significantFigures = integerPart.replace(/^0+/, '').length + fractionalPart.replace(/0+$/, '').length;
            if (integerPart === '0') {
                significantFigures = fractionalPart.replace(/^0+/, '').length;
            }
        } else {
            significantFigures = numberStr.replace(/^0+/, '').length;
        }

        if (significantFigures === 0) {
            result = Math.floor(number).toFixed(0);
        } else {
            // Determine rounding precision
            const decimalPlaces = numberStr.includes('.') ? numberStr.split('.')[1].length : 0;
            const roundingPrecision = decimalPlaces - 1;
            const factor = Math.pow(10, roundingPrecision);

            // Round down and format the result
            const roundedNumber = Math.floor(number * factor) / factor;
            result = roundedNumber.toFixed(roundingPrecision).replace(/(\.\d*?[1-9])0+$/, '$1').replace(/\.$/, '');
        }
    } else if (operation === 'roundEven') {
        // Round to nearest even
        const numberStr = number.toString();
        const decimalPlaces = numberStr.includes('.') ? numberStr.split('.')[1].length : 0;

        // Calculate rounding precision
        const factor = Math.pow(10, decimalPlaces);
        const roundedNumber = Math.round(number * factor) / factor;

        // Determine rounding behavior
        const integerPart = Math.floor(number);
        const fractionPart = number - integerPart;

        if (fractionPart === 0.5) {
            // Exactly halfway, round to nearest even integer
            result = (Math.floor(integerPart) % 2 === 0) ? integerPart : integerPart + 1;
        } else {
            result = roundedNumber;
        }

        result = result.toFixed(decimalPlaces).replace(/(\.\d*?[1-9])0+$/, '$1').replace(/\.$/, '');
    }

    // Display the result
    document.getElementById('result').innerText = `Result: ${result}`;

    // Convert to IEEE-754 format and display
    const ieee754Converter = extIeee754();
    const ieee754Hex = ieee754Converter.to('hex32', parseFloat(result));
    const ieee754Bin = ieee754Converter.to('bin32', parseFloat(result));
    document.getElementById('ieee754Result').innerText = `IEEE-754 (Hex): ${ieee754Hex}, IEEE-754 (Binary): ${ieee754Bin}`;
    
    // Update the output boxes
    document.getElementById('decimal-output').innerText = result;
    document.getElementById('binary-output').innerText = ieee754Bin;
    document.getElementById('hex-output').innerText = ieee754Hex;
}

/**
 * Converts numbers to and from IEEE-754 format.
 */
function extIeee754() {
    'use strict';

    var converter = this;

    /**
     * Normalizes the number by replacing certain strings and characters.
     * @param {string} number - The number to normalize.
     * @returns {string} - The normalized number.
     */
    function normalize(number) {
        return number
            .replace(/ /g, '')
            .replace(',', '.')
            .replace(/nan/i, 'NaN')
            .replace(/infinity/i, 'Infinity')
            .replace(/-infinity/i, '-Infinity');
    }

    /**
     * Parses a number to a DataView based on the base and digit length.
     * @param {number} digitsPerByte - The number of digits per byte.
     * @param {number} fromBase - The base of the number.
     * @param {string} number - The number to parse.
     * @returns {DataView} - The DataView representation of the number.
     */
    function parseToView(digitsPerByte, fromBase, number) {
        if (/^0[bx]/i.test(number)) {
            number = number.substr(2);
        }

        var arr = new Uint8Array(number.length / digitsPerByte);

        for (var i = 0; i < arr.length; i++) {
            arr[i] = parseInt(
                number.substr(i * digitsPerByte, digitsPerByte),
                fromBase
            );
        }

        return new DataView(arr.buffer);
    }

    /**
     * Converts a number to a 32-bit array.
     * @param {number} number - The number to convert.
     * @returns {Uint8Array} - The 32-bit array representation of the number.
     */
    function numberToArr32(number) {
        var arr = new Uint8Array(4);
        var view = new DataView(arr.buffer);
        view.setFloat32(0, +number);
        return arr;
    }

    /**
     * Converts an array to a base representation.
     * @param {number} toBase - The base to convert to.
     * @param {Uint8Array} arr - The array to convert.
     * @returns {string} - The base representation of the array.
     */
    function arrToBase(toBase, arr) {
        var result = '';
        for (var i = 0; i < arr.length; i++) {
            var part = (256 + arr[i]).toString(toBase).substr(1).toUpperCase();
            if (toBase === 2) {
                part = part.padStart(8, '0'); // Ensure each byte is represented as 8 bits
            }
            result += part;
            if (toBase === 2 && i < arr.length - 1) {
                result += ' '; // Add space between bytes for binary output
            }
        }
        return result;
    }
    /**
     * Validates the number based on the base and format.
     * @param {string} base - The base of the number.
     * @param {string} [number] - The number to validate.
     * @returns {boolean} - Whether the number is valid.
     */
    function valid(base, number) {
        if (number === undefined) {
            return base === 'dec' || /^(dec|bin|hex)32$/.test(base);
        }

        number = normalize(number);

        if (number) {
            if (base === 'dec') {
                return number === 'NaN' || number === 'Infinity' || number === '-Infinity' || !isNaN(+number);
            } else if (base === 'bin32') {
                return /^(0b)?[01]{32}$/i.test(number);
            } else if (base === 'hex32') {
                return /^(0x)?[0-9A-F]{8}$/i.test(number);
            }
        }
        return false;
    }

        /**
         * Converts a number to IEEE-754 format based on the target base.
         * @param {string} toBase - The base to convert to.
         * @param {number} number - The number to convert.
         * @returns {string} - The IEEE-754 format representation of the number.
         */
        function to(toBase, number) {
            number = +number;
            var arr;
        
            switch (toBase) {
                case 'hex32':
                    arr = numberToArr32(number);
                    return '0x' + arrToBase(16, arr);
                case 'bin32':
                    arr = numberToArr32(number);
                    var binaryString = arrToBase(2, arr).replace(/ /g, ''); // Remove spaces
                    // Extract IEEE-754 components
                    var sign = binaryString.charAt(0);
                    var exponent = binaryString.substring(1, 9);
                    var mantissa = binaryString.substring(9);
                    // Format output
                    return `0b${sign} ${exponent} ${mantissa}`;
            }
        }

/**
 * Converts a number from IEEE-754 format to a specified base.
 * @param {string} fromBase - The base to convert from.
 * @param {string} number - The number to convert.
 * @returns {number} - The number in decimal representation.
 */
function from(fromBase, number) {
    if (!valid(fromBase, number)) {
        return NaN;
    }

    number = normalize(number);

    var view;
    switch (fromBase) {
        case 'dec':
            return +number;
        case 'bin32':
            view = parseToView(1, 2, number.substr(2).replace(/ /g, '')); // Remove spaces
            break;
        case 'hex32':
            view = parseToView(2, 16, number.substr(2));
            break;
    }
    return view.getFloat32(0);
}

    // Return the API methods
    converter = {
        to: to,
        from: from,
        valid: valid,
        numberToArr32: numberToArr32,
        arrToBase: arrToBase,
        parseToView: parseToView,
        normalize: normalize
    };

    return converter;
}
