import { Box, FormControlLabel, Switch } from '@mui/material';
import { FunctionComponent, useState } from 'react';
import { ModuleStats } from '../../analyzer/analyzer';
import { ExpandableCard } from './ExpandableCard';
import { diagramHeight } from './diagramUtils';
import { ResponsiveTreeMap } from '@nivo/treemap';
import { grey } from '@mui/material/colors';
import { labelForTreeMapNode, SourceCodeType, TreeMapNode } from './sourceCodeTreeMapLabel';
import { colorFor, defsForAllColors, fillsForAllColors } from './sourceCodeTreeMapColors';

interface Props {
    data: ModuleStats[];
}

type ShowFilesType = "source" | "resource";

interface ShowFiles {
    type: ShowFilesType;
    label: string;
    value: (module: ModuleStats) => number;
    testValue: (module: ModuleStats) => number;
    valueId: SourceCodeType;
    testValueId: SourceCodeType;
}

const showSources: ShowFiles = {
    type: "source",
    label: "Compiled Source Files",
    value: m => m.compiledSources,
    testValue: m => m.compiledTestSources,
    valueId: "mainSrc",
    testValueId: "testSrc",
}

const showResources: ShowFiles = {
    type: "resource",
    label: "Copied Resource Files",
    value: m => m.copiedResources,
    testValue: m => m.copiedTestResources,
    valueId: "mainRes",
    testValueId: "testRes",
}


export const SourceCodeTreeMapCard: FunctionComponent<Props> = ({ data }) => {
    const [fileType, setFileType] = useState<ShowFiles>(showSources);

    const treeData: TreeMapNode = {
        id: "root",
        children: data.map((row) => {
            const moduleId = row.module;
            return {
                id: moduleId,
                moduleId,
                children: [
                    {
                        id: fileType.valueId,
                        moduleId,
                        value: fileType.value(row),
                    },
                    {
                        id: fileType.testValueId,
                        moduleId,
                        value: fileType.testValue(row),
                    },
                ],
            }
        }),
    }

    return (
        <ExpandableCard title="Source Code" subheader="Shows the number of compiled source code files and copied resources. Please note that if you build without clean, Maven only compiles files if something has changed.">
            <FormControlLabel control={<Switch onChange={() => setFileType(old => old === showSources ? showResources : showSources)} />} label={fileType.label} sx={{ marginBottom: "10px" }} />

            <Box sx={{ height: `${diagramHeight(10)}px` }}>
                <ResponsiveTreeMap
                    data={treeData}
                    identity="id"
                    value="value"
                    innerPadding={0}
                    label={labelForTreeMapNode}
                    orientLabel={false}
                    nodeOpacity={1}
                    borderColor={"white"}
                    colors={(node) => node.data.moduleId ? colorFor(node.data.moduleId, 200) : grey[100]}
                    borderWidth={2}
                    labelTextColor={"black"}
                    labelSkipSize={20}
                    parentLabelTextColor={"black"}
                    defs={defsForAllColors}
                    fill={fillsForAllColors}
                />
            </Box>
        </ExpandableCard>
    );
}
