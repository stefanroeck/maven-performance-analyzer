import { ComputedNodeWithoutStyles } from "@nivo/treemap";

export interface TreeMapNode {
    id: string;
    moduleId?: string;
    value?: number;
    children?: TreeMapNode[];
}


const sourceCodeTypes = ["mainSrc", "testSrc", "mainRes", "testRes"];
export type SourceCodeType = typeof sourceCodeTypes[number];

const labels: Record<SourceCodeType, string> = {
    "mainSrc": "Source files",
    "testSrc": "Test sources",
    "mainRes": "Resources",
    "testRes": "Test resources",
}

const isNodeElement = (id: string): id is SourceCodeType => {
    return sourceCodeTypes.indexOf(id) > -1;
}


export const labelForTreeMapNode = (node: Omit<ComputedNodeWithoutStyles<TreeMapNode>, "label" | "parentLabel">): string => {
    if (isNodeElement(node.id)) {
        return node.width > 100 ? node.value + " " + labels[node.id] : node.value + "";
    }
    return node.id;
}
