import { Box } from '@mui/material';
import { FunctionComponent } from 'react';
import { AnalyzedModule } from '../../analyzer/analyzer';
import { ExpandableCard } from './ExpandableCard';
import { diagramHeight } from './diagramUtils';
import { ResponsiveTreeMap } from '@nivo/treemap';
import { grey } from '@mui/material/colors';
import { labelForTreeMapNode, TreeMapNode } from './sourceCodeTreeMapLabel';
import { colorFor, defsForAllColors, fillsForAllColors } from './sourceCodeTreeMapColors';

interface Props {
    data: AnalyzedModule[];
}

export const SourceCodeTreeMapCard: FunctionComponent<Props> = ({ data }) => {

    const treeData: TreeMapNode = {
        id: "root",
        children: data.map(({ module: moduleId, compiledSources, compiledTestSources }) => {
            return {
                id: moduleId,
                moduleId,
                children: [
                    {
                        id: "mainSrc",
                        moduleId,
                        value: compiledSources,
                    },
                    {
                        id: "testSrc",
                        moduleId,
                        value: compiledTestSources,
                    },
                ],
            }
        }),
    }

    return (
        <ExpandableCard title="Source Code" subheader="Shows the number of source code files and copied resources">
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
