![ANSI/SCTE-35 JS](assets/scte35-logo.png)

<h2 align="center">ANSI/SCTE35 JS PARSER</h2>

Tool to parse SCTE35 hex and binary strings in the terminal, with NodeJS, or in a "modern" browser.

## SCTE35 Module

    // See ISCTE35 for methods & ISpliceInfoSection for results.

```typescript
    import { SCTE35 } from "scte35-annotated";
    const scte35: SCTE35 = new SCTE35();
    const result1 = scte35.parseFromB64("<base64 string>");
    const result2 = scte35.parseFromHex("<hex string>");
```

## CLI

The parser can be executed from the bin by first installing it globally and then executing the `scte35` command:

```bash
    npm i scte35-annotated -g
    scte35
    > ? Please provide the SCTE-35 tag that you would like to parse
```

```bash

    # base64
    scte35 /DBGAAET8J+pAP/wBQb+AAAAAAAwAi5DVUVJQAErgX+/CR9TSUdOQUw6OGlTdzllUWlGVndBQUFBQUFBQUJCQT09NwMDaJ6RZQ==

    # hexadecimal
    scte35 fc3046000113f09fa900fff00506fe000000000030022e4355454940012b817fbf091f5349474e414c3a386953773965516946567741414141414141414242413d3d370303689e9165

    # hexadecimal, from HLS
    scte35 0xFC305E00014D9BE71800FFF00506FEF293ED90004802144355454900065E0F7FFF00002932F10000300E10021F4355454900065EFF7FBF0C10414446520133F10134B04F065E060220020000020F4355454900065E0E7FBF0000310D1019BD26AB

    # all will output a formatted JSON
    > {
        "tableId": 252,
        "selectionSyntaxIndicator": false,
        "privateIndicator": false,
        ...
        "spliceCommandType": 6,
        "spliceCommandType_name": "time_signal",
        ...
    }
```

### Piping

The parser output can be piped into other tools, such as a JSON display utility like `jq` in order to syntax highlight the JSON object and interact with it.

```bash
    scte35 /DBGAAET8J+pAP/wBQb+AAAAAAAwAi5DVUVJQAErgX+/CR9TSUdOQUw6OGlTdzllUWlGVndBQUFBQUFBQUJCQT09NwMDaJ6RZQ== | jq
```


## Origin

This is a fork of the original [Comcast scte35-js](https://github.com/Comcast/scte35-js) code, with a few changes:

- CLI modified to automatically detect input format (hex or base64), rather than requiring the user to specify.
- Human-readable annotations added to the output JSON, for common fields (spliceCommandType, segmentationUpidType, etc.)

By convention, and to remain compatible with the original project, I will use the same major and minor version as the original project, and increment the patch version for each release.