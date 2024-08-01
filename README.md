# CSARCH2-IEEE-754-Decimal-32-floating-point-converter

1. [Installation](#installation)
2. [Opening on Local Machine](#opening-on-local-machine)
3. [Code Analysis](#code-analysis)
4. [Test Cases](#test-cases)

## Installation

### Steps
1. Clone the repository:
    ```bash
    git clone  https://github.com/trishavalla/CSARCH2-IEEE-754-Decimal-32-floating-point-converter.git
    ```
2. Navigate to the project directory:
    ```bash
    cd your-repo-name
    ```
3. Install dependencies:
    ```bash
    npm install
    ```
    
## Opening on Local Machine

1. Start the server:
    ```bash
    node server.js
    ```
2. Open a browser and go to `http://localhost:3000`.

## Code Analysis

### File Descriptions
- `server.js`: Sets up a basic HTTP server to serve static files (e.g., HTML, CSS, JavaScript) and handle HTTP requests.
- `scripts.js`: Contains functions for converting numbers to and from IEEE-754 Decimal-32 floating-point format. Handles conversion between decimal, binary, and hexadecimal representations.
- `html.html`: Provides a user interface for inputting a decimal number and selecting a rounding method. It triggers the conversion process and redirects to output.html.
- `styles.css`: The css code for the style of the html files.

### Important Functions/Methods
processNumber(): Gathers input values, applies the selected rounding method, performs the conversion to IEEE-754 format, and updates the displayed results.

downloadTxtFile(): Exports the displayed results as a text file for download.

numberToArr32(number): Converts a decimal number to a 32-bit IEEE-754 format stored in an ArrayBuffer.

arrToBase(toBase, arr): Converts an array of bytes to a string in the specified base.

valid(base, number): Validates the number format based on the specified base.

from(fromBase, number): Converts a number from the specified base to decimal.

to(toBase, number): Converts a decimal number to the specified base.

normalize(number): Normalizes a number to IEEE-754 format, ensuring the number is shown correctly with the proper representation of mantissa and exponent.

## Test Cases
Test Case 1

- Input: 2.5678 × 10^2

- Number: 256.78

- Round Up: 256.8

- Hexadecimal: 43806666

- Binary: 0 10000111 00000000110011001100110

Test Case 2

- Input: 3.678 × 10^-3

- Number: 0.003678

- Round Down: 0.00000367

- Hexadecimal: 36764A1F

- Binary: 0 01101100 11101100100101000011111

Test Case 3

- Input: 4.25× 10^1

- Number: 42.0

- Round Even: 42.0

- Hexadecimal: 42280000

- Binary: 0 10000100 01010000000000000000000

Test Case 4

- Input: 2 × 10^-45

- Number: 2e-45

- Do not round off: 2e-45

- Hexadecimal: 00000001

- Binary: 0 00000000 00000000000000000000001

Test Case 5

- Input: -0.4567 × 10^2

- Number: -45.67

- Round up: -45.6

- Hexadecimal: 0xC2380000

- Binary: 1 10000010 10111010010000000000000

Special Cases
Test Case 9 (Positive Infinity)

- Input: Infinity × 10^0

- Number: Infinity

- Hexadecimal: 7F800000

- Binary: 0 11111111 00000000000000000000000

Test Case 10 (NaN)

- Input: NaN × 10^0

- Number: NaN

- Hexadecimal: 7FC00000

- Binary: 0 11111111 10000000000000000000000
