const arg = require("arg");
const { SCTE35 } = require("../build/scte35");

const version = require("../package.json").version;
const scte35 = new SCTE35();

function parseArgumentsIntoOptions(rawArgs) {
    const args = arg(
        {
            "--help": Boolean,
            "--hex": Boolean,
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
        hex: args["--hex"] || false,
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
        format: options.hex ? "Hexadecimal" : "Base64",
        input: options.input || answers.input,
    };
}

// Recursively remove annotation fields (ending with _name, _hex, _ascii, _hms, _s)
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
            { Option: "--hex", Description: "evaluate using hexadecimal scte35 input" },
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
        if (options.format == "Base64") {
            parsedResult = scte35.parseFromB64(options.input);
        }
        if (options.format == "Hexadecimal") {
            parsedResult = scte35.parseFromHex(options.input);
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
