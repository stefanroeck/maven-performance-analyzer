import { Box } from '@mui/material';
import { FunctionComponent } from 'react';
import { AnalyzerRow } from '../../analyzer/analyzer';
import { ExpandableCard } from './ExpandableCard';
import { diagramHeight } from './diagramUtils';
import { ResponsiveTreeMap } from '@nivo/treemap';
import { grey } from '@mui/material/colors';
import { labelForTreeMapNode, TreeMapNode } from './sourceCodeTreeMapLabel';
import { colorFor, defsForAllColors, fillsForAllColors } from './sourceCodeTreeMapColors';

interface Props {
    data: AnalyzerRow[];
}


export const SourceCodeTreeMapCard: FunctionComponent<Props> = ({ data }) => {

    const treeMapData: TreeMapNode = {
        id: "root",
        children: [
            {
                id: "module 1",
                moduleId: "m1",
                children: [
                    {
                        id: "mainSrc",
                        moduleId: "m1",
                        value: 431,
                    },
                    {
                        id: "testSrc",
                        moduleId: "m1",
                        value: 211,
                    },

                    {
                        id: "mainRes",
                        moduleId: "m1",
                        value: 21,
                    },
                    {
                        id: "testRes",
                        moduleId: "m1",
                        value: 90,
                    }
                ]
            },
            {
                id: "module 2",
                moduleId: "m2",
                children: [
                    {
                        id: "mainSrc",
                        moduleId: "m2",
                        value: 90,
                    },
                    {
                        id: "testSrc",
                        moduleId: "m2",
                        value: 67,
                    },
                    {
                        id: "mainRes",
                        moduleId: "m2",
                        value: 10,
                    },
                ]
            }
        ]
    };

    return (
        <ExpandableCard title="Source Code" subheader="Shows the number of source code files and copied resources">
            <Box sx={{ height: `${diagramHeight(10)}px` }}>
                <ResponsiveTreeMap
                    data={treeMapData}
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
