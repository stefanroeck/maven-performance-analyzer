import { ComputedNode } from '@nivo/treemap';
import { linearGradientDef, patternLinesDef, SvgDefsAndFill } from '@nivo/core';
import { TreeMapNode } from './sourceCodeTreeMapLabel';
import { amber, blue, blueGrey, brown, deepOrange, grey, indigo, lightGreen, lime, orange, pink, purple, red, teal, yellow } from '@mui/material/colors';


const treeMapColors = [
    amber,
    blue,
    blueGrey,
    brown,
    deepOrange,
    indigo,
    lime,
    orange,
    pink,
    purple,
    lightGreen,
    red,
    teal,
    yellow,

];

const hashCode = (str: string): number => {
    let hash = 0
    for (let i = 0; i < str.length; ++i)
        hash = Math.imul(31, hash) + str.charCodeAt(i)

    return hash | 0
}

export const colorFor = (id: string, variant: 50 | 100 | 200): string => {
    const idx = colorIdx(id);
    return treeMapColors[idx][variant];
}

const colorIdx = (id: string): number => {
    return Math.abs(hashCode(id)) % treeMapColors.length;
}


export const defsForAllColors = treeMapColors.flatMap((color, idx) => {
    return [
        linearGradientDef(`${idx}_mainSrc`, [
            { offset: 0, color: color[200] },
            { offset: 100, color: color[200] },

        ]),
        patternLinesDef(`${idx}_testSrc`, {
            "spacing": 10,
            "rotation": 45,
            "lineWidth": 6,
            "background": color[200],
            "color": color[100],
        }),
        linearGradientDef(`${idx}_mainRes`, [
            { offset: 0, color: grey[300] },
            { offset: 100, color: grey[300] },

        ]),
        patternLinesDef(`${idx}_testRes`, {
            "spacing": 10,
            "rotation": 45,
            "lineWidth": 6,
            "background": grey[300],
            "color": grey[200],
        }),
    ];
});

export const fillsForAllColors: SvgDefsAndFill<ComputedNode<TreeMapNode>>["fill"] = treeMapColors.flatMap((color, idx) => {
    return [
        {
            match: (node): boolean => node.data.moduleId !== undefined && colorIdx(node.data.moduleId) === idx && node.id === "mainSrc",
            id: `${idx}_mainSrc`
        },
        {
            match: (node): boolean => node.data.moduleId !== undefined && colorIdx(node.data.moduleId) === idx && node.id === "testSrc",
            id: `${idx}_testSrc`
        },
        {
            match: (node): boolean => node.data.moduleId !== undefined && colorIdx(node.data.moduleId) === idx && node.id === "mainRes",
            id: `${idx}_mainRes`
        },
        {
            match: (node): boolean => node.data.moduleId !== undefined && colorIdx(node.data.moduleId) === idx && node.id === "testRes",
            id: `${idx}_testRes`
        },
    ];
});

