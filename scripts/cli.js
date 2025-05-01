const arg = require("arg");
const { SCTE35 } = require("../build/scte35");

const version = require("../package.json").version;
const scte35 = new SCTE35();

function parseArgumentsIntoOptions(rawArgs) {
    const args = arg(
        {
            "--help": Boolean,
            "--version": Boolean,
            "--no-annotations": Boolean,
            "-h": "--help",
            "-v": "--version",
        },
        {
            argv: rawArgs.slice(2),
        },
    );
    return {
        help: args["--help"] || false,
        input: args._[0],
        version: args["--version"] || false,
        noAnnotations: args["--no-annotations"] || false,
    };
}

async function promptForMissingOptions(options) {
    const questions = [];
    if (!options.input) {
        questions.push({
            type: "input",
            name: "input",
            message: "Please provide the SCTE-35 tag that you would like to parse",
        });
    }

    const inquirer = (await import("inquirer")).default;
    const answers = await inquirer.prompt(questions);
    return {
        input: options.input || answers.input,
    };
}

// Recursively remove annotation fields (ending with '_*')
function removeAnnotations(obj) {
    if (Array.isArray(obj)) {
        return obj.map(removeAnnotations);
    }
    if (obj !== null && typeof obj === 'object') {
        const newObj = {};
        for (const key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
                // Keep keys that DO NOT contain an underscore
                if (!/_/.test(key)) {
                    newObj[key] = removeAnnotations(obj[key]);
                }
            }
        }
        return newObj;
    }
    return obj;
}

// Function to detect input format
function detectInputFormat(inputString) {
    if (!inputString) {
        // Should ideally not happen due to prompt
        throw new Error("Input string is empty.");
    }

    // Remove optional '0x' prefix for hex check
    const normalizedInput = inputString.startsWith('0x') ? inputString.substring(2) : inputString;

    // Regex for valid Hex characters (case-insensitive)
    const hexRegex = /^[0-9a-fA-F]+$/;

    if (hexRegex.test(normalizedInput)) {
        return "Hexadecimal";
    }

    // Regex for Base64 characters (includes +, /, =)
    // This is a basic check; true Base64 validation is more complex
    // but for distinguishing from hex, this should suffice.
    const base64Regex = /^[A-Za-z0-9+/]*=?=?$/;
    if (base64Regex.test(inputString)) { // Test original string for Base64 chars
        // Further check: if it *only* contains hex chars but didn't match hexRegex
        // (e.g., empty string after removing 0x), it shouldn't be base64.
        // Also, pure hex strings can technically be valid base64, but we prioritize Hex.
        if (hexRegex.test(inputString)) return "Hexadecimal"; // Prioritize Hex if ambiguous
        return "Base64";
    }

    // Fallback or throw error if format is ambiguous/invalid
    // Let's be lenient and assume Base64 if it doesn't look like Hex
    // The parser will throw a specific error if it's truly invalid.
    return "Base64";
}

exports.cli = async function(args) {
    let options = parseArgumentsIntoOptions(args);
    if (options.help) {
        console.log("Usage: scte35 [options] [arguments]\n");
        console.log("Examples:\n");
        console.log(
            "\tscte35 --hex fc3046000113f09fa900fff00506fe000000000030022e4355454940012b817fbf091f5349474e414c3a386953773965516946567741414141414141414242413d3d370303689e9165\n",
        );
        console.log(
            "\tscte35 /DBGAAET8J+pAP/wBQb+AAAAAAAwAi5DVUVJQAErgX+/CR9TSUdOQUw6OGlTdzllUWlGVndBQUFBQUFBQUJCQT09NwMDaJ6RZQ==\n",
        );
        console.table([
            { Option: "--help, -h", Description: "print node command line options (currently set)" },
            { Option: "--version, -v", Description: "print SCTE35.js version" },
            { Option: "--no-annotations", Description: "strip added annotations (_name, _hex, etc.) from output" },
        ]);
        console.log("\nDocumentation can be found at https://github.com/Comcast/scte35-js");
        return;
    }
    if (options.version) {
        console.log(version);
        return;
    }

    // Get the original noAnnotations flag before potentially overwriting options
    const noAnnotations = options.noAnnotations;

    // Prompt if input is missing *before* parsing
    // Merge the prompt results back into the options object
    const promptResult = await promptForMissingOptions(options);
    options = { ...options, ...promptResult };

    let parsedResult;
    try {
        const format = detectInputFormat(options.input);
        let inputToParse = options.input;

        if (format === "Hexadecimal") {
            // Remove '0x' prefix if present before parsing
            if (inputToParse.startsWith('0x')) {
                inputToParse = inputToParse.substring(2);
            }
            // console.log("Detected format: Hexadecimal"); 
            parsedResult = scte35.parseFromHex(inputToParse);
        } else if (format === "Base64") {
            // console.log("Detected format: Base64"); 
            parsedResult = scte35.parseFromB64(options.input); 
        }
    } catch (e) {
        console.error("Error parsing SCTE-35 data:", e.message);
        process.exit(1);
    }

    // Conditionally remove annotations using the preserved flag value
    const finalResult = noAnnotations ? removeAnnotations(parsedResult) : parsedResult;

    const output = JSON.stringify(finalResult, null, 4);
    console.log(output);
}
