function extIeee754() {
    'use strict';


    var converter = this;

    /* 
     * Normalizes the input number by removing spaces, replacing commas with dots, 
     * and standardizing the format for NaN and Infinity.
     */
    function normalize(number) {
        return number
            .replace(/ /g, '')
            .replace(',', '.')
            .replace(/nan/i, 'NaN')
            .replace(/infinity/i, 'Infinity')
            .replace(/-infinity/i, '-Infinity');
    }

    /* 
     * Converts a number from a given base to a DataView.
     * /^0[bx]/i.test(number) checks if the number starts with '0b' (binary) or '0x' (hexadecimal).
     * If it does, the base prefix is removed.
     * The number is then split into bytes and parsed according to the specified base.
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

    /* 
     * Converts a number to a 32-bit IEEE-754 format and stores it in an ArrayBuffer.
     * The ArrayBuffer is then returned as a Uint8Array.
     */
    function numberToArr32(number) {
        var arr = new Uint8Array(4); 
        var view = new DataView(arr.buffer); 
        view.setFloat32(0, +number); 
        return arr; 
    }

    /* 
     * Converts an array of bytes to a string in the specified base (binary or hexadecimal).
     * The result string is returned in uppercase format.
     */
    function arrToBase(toBase, arr) {
        var result = '';
        for (var i = 0; i < arr.length; i++) {
            result += (256 + arr[i]).toString(toBase).substr(1).toUpperCase();
        }
        return result;
    }

    /* 
     * Validates the input number based on the specified base and number format.
     * Returns true if the number is valid, otherwise false.
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
                return /^(0x)?[0-9a-f]{8}$/i.test(number); 
            }
        }

        return false;
    }

    // Object containing methods for conversion and normalization
    return {
        /* 
         * Converts a number from the specified base to decimal.
         * Handles special cases for Infinity and NaN.
         * Uses parseToView for binary and hexadecimal conversions.
         */
        from: function (fromBase, number) {
            number = normalize(number);

            if (!valid(fromBase, number)) {
                return;
            }

            if (number === 'Infinity') { 
                return Infinity;
            } else if (number === '-Infinity') { 
                return -Infinity;
            }

            if (fromBase === 'dec') {
                return +number;
            } else if (fromBase === 'bin32') {
                return parseToView(8, 2, number).getFloat32(0); 
            } else if (fromBase === 'hex32') {
                return parseToView(2, 16, number).getFloat32(0);
            }
        },

        /* 
         * Converts a decimal number to the specified base.
         * Handles special cases for Infinity and NaN.
         * Uses numberToArr32 and arrToBase for binary and hexadecimal conversions.
         */
        to: function (toBase, number) {
            if (number === Infinity) {
                if (toBase === 'dec') return 'Infinity';
                if (toBase === 'bin32') return '0 11111111 00000000000000000000000'; 
                if (toBase === 'hex32') return '7F800000'; 
            } else if (number === -Infinity) {
                if (toBase === 'dec') return '-Infinity';
                if (toBase === 'bin32') return '1 11111111 00000000000000000000000'; 
                if (toBase === 'hex32') return 'FF800000';
            }

            number = +number;

            if (toBase === 'dec') { // Convert to decimal
                return '' + number;
            } else if (toBase === 'bin32') {
                return arrToBase(2, numberToArr32(number)).replace(/^(.)(.{8})(.+)$/, '$1 $2 $3'); 
            } else if (toBase === 'hex32') {
                return arrToBase(16, numberToArr32(number)); 
            }
        },

        valid: valid,

        /* 
         * Normalizes a number to IEEE-754 format.
         * Splits the number into mantissa and exponent, and returns the normalized form.
         */
        normalize: function (number) {
            if (number === 0) return '0'; 
            var exponent = Math.floor(Math.log2(Math.abs(number)));
            var mantissa = (number / Math.pow(2, exponent)).toString(2); 
            return `+${mantissa} x 2^${exponent}`; 
        }
    };
}
