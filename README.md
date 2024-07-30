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
2. Open a browser and go to `http://localhost:4000`.

## Code Analysis

### File Descriptions
- `server.js`: Sets up a basic HTTP server to serve static files (e.g., HTML, CSS, JavaScript) and handle HTTP requests.
- `ieee754-converter.js`: Contains functions for converting numbers to and from IEEE-754 Decimal-32 floating-point format. Handles conversion between decimal, binary, and hexadecimal representations.
- `decimal.html`: Provides a user interface for inputting a decimal number and selecting a rounding method. It triggers the conversion process and redirects to output.html.
- `output.html`: Displays the conversion results from decimal.html, showing the decimal, binary, and hexadecimal outputs. It also provides options to go back to decimal.html or export the results.
- `styles.css`: The css code for the style of the html files.

### Important Functions/Methods
- convert(): Gathers input values, applies the selected rounding method, performs the conversion using ieee754-converter.js, and redirects to output.html.
- exportToText(): Exports the displayed results as a text file for download.
- DOMContentLoaded: Retrieves and displays conversion results from localStorage.
- http.createServer: Creates the HTTP server to handle requests, read files from the server, and respond with appropriate content or error messages.
- numberToArr32(number): Converts a decimal number to a 32-bit IEEE-754 format stored in an ArrayBuffer.
- arrToBase(toBase, arr): Converts an array of bytes to a string in the specified base.
- valid(base, number): Validates the number format based on the specified base.
- from(fromBase, number): Converts a number from the specified base to decimal.
- to(toBase, number): Converts a decimal number to the specified base.
- normalize(number): Normalizes a number to IEEE-754 format, showing it in terms of mantissa and exponent

## Test Cases

### Test 1
- **Test 1**: Brief description of what this test checks.
- **Test 2**: Brief description of what this test checks.
- **Test 3**: Brief description of what this test checks.

### Test 2

