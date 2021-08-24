// https://codemirror.net/demo/simplemode.html
import CodeMirror from 'codemirror';

const tag = {
    regex: /(\w+):/,
    sol: true,
    token: 'tag',
};

const number = {
    regex: /\b(?:\.\d+|\d+(?:\.\d*)?)(?:[eE]\d*)?\b/,
    token: 'number',
};

const register = {
    regex: /\br+(?:\d|1[0-7])\b/,
    token: 'definition',
};

const registerError = {
    regex: /\br+\d+\b/,
    token: 'error',
};

const device = {
    regex: /\b(?:d[0-5]|dr+(?:\d|1[0-7]))\b/,
    token: 'definition',
};

const deviceError = {
    regex: /\bdr*\d+\b/,
    token: 'error',
};

const comment = {
    regex: /#.*/,
    token: 'comment',
};

const keywordPatterns = [
    // Device branching:
    `br?d(?:ns|se)(?:al)?`,
    // Device loading: 
    `l[brs]?`,
    // Device setting: 
    `sb?`,
    // Absolute branches: 
    `b(?:ap|eq|g[et]|l[et]|n[ae])z?(?:al)?`,
    // Relative branches: 
    `br(?:ap|eq|g[et]|l[et]|n[ae])z?`,
    // Primative jumps: 
    `j(?:al|r)?`,
    // Variable selection: 
    `s(?:elect|(?:ap|d(?:ns|se)|eq|g[et]|l[et]|n[ae])z?)`,
    // Math functions: 
    `abs|acos|add|asin|atan|ceil|cos|div|exp|floor|log|max|min|mod|mul|rand|round|sin|sqrt|sub|tan|trunc`,
    // Logical functions: 
    `and|[nx]or`,
    // Stack functions: 
    `p(?:eek|op|ush)`,
    // Misc functions: 
    `alias|define|hcf|move|sleep|yield`,
];

import { logicTypes, batchModes, slotTypes, reagents, slots } from './stationeers-data.js';

const concatRule = (patterns) => {
    return new RegExp(String.raw`\b(?:${patterns.join('|')})\b`);
};

const keyword = {
    regex: concatRule(keywordPatterns),
    sol: true,
    token: 'keyword',
};

const batchMode = {
    regex: concatRule(batchModes),
    token: 'string',
};

const logicType = {
    regex: concatRule(logicTypes),
    token: 'string',
};

const slotType = {
    regex: concatRule(slotTypes),
    token: 'string',
};

const reagent = {
    regex: concatRule(reagents),
    token: 'string',
};

const slot = {
    regex: concatRule(slots),
    token: 'string',
};

CodeMirror.defineSimpleMode('mips', {
    start: [
        tag,
        number,
        register,
        registerError,
        device,
        deviceError,
        comment,
        keyword,
        batchMode,
        logicType,
        slotType,
        reagent,
        slot,
    ],
    meta: {
        lineComment: '#',
    },
});

// TODO: Going to need the full API to be able to highlight tag references to tags that are defined
// somehwere down in the code. Unsure how.
// CodeMirror.defineMode('mips', (_config, state) => {
//     const numberChar = /[
//     const number = /(?:\d+\.\d*|\d*\.\d+)(?:[eE]\d*)/;

//     const register = /r+d+/;
//     const device = /dr*\d+/;

//     console.log('create MIPS mode')

//     return {
//         startState() {
//             return {
//                 tags: []
//             }
//         },
//         token(stream, state) {
//             if (stream.eatSpace()) return null;

//             let style, cur, ch = stream.next();

//             if (/\d|\./.test(ch)) {
//                 stream.eat
//                 if (number.test(cur)) {
//                     console.debug(`number "{cur}"`);
//                     return 'number';
//                 }
//             }

//             if (/\w/.test(ch)) {
//                 stream.eatWhile(/\w/);
//                 if (stream.eat(':')) {
//                     return 'tag';
//                 }
//                 cur = stream.current();
//                 console.debug(`some kind of word "${cur}"`);

//                 if (register.test(cur)) {
//                     console.debug(`register "{cur}"`);
//                     return 'variable';
//                 }
//                 if (device.test(cur)) {
//                     console.debug(`device "{cur}"`);
//                     return 'variable-2';
//                 }
//                 // if (keyword.test(curr)) return 'keyword';
//             }
//         },
//         lineComment: '#',
//     };
// });
