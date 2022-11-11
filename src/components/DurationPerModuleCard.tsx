import { Box } from '@mui/material';
import { FunctionComponent } from 'react';
import { BarDatum, ResponsiveBar } from '@nivo/bar';
import { AnalyzerRow } from '../analyzer/analyzer';
import { ExpandableCard } from './ExpandableCard';
import { axisWithDuration, basicBarCharProps, defaultMargin, diagramHeight, muiColorGradient, muiDistinctColors } from './diagramUtils';

interface Props {
    data: AnalyzerRow[];
}


export interface DataWithDuration extends BarDatum {
    module: string;
    [key: string]: number | string;
}

export const DurationPerModuleCard: FunctionComponent<Props> = ({ data }) => {
    const barData: DataWithDuration[] = data.map(row => {
        return {
            module: row.module,
            [row.plugin]: row.duration,
        }
    }).reduce((arr, curr) => {
        const existing = arr.find(e => e.module === curr.module);
        if (existing) {
            Object.assign(existing, curr);
        } else {
            arr.push(curr);
        }
        return arr;
    }, [] as DataWithDuration[]);

    // map to strings (except "module" and remove duplicates
    const keys = barData.flatMap(f => Object.keys(f).filter(f => f !== "module")).filter((f, idx, arr) => arr.indexOf(f) === idx);
    const modules = barData.flatMap(f => f.module).filter((f, idx, arr) => arr.indexOf(f) === idx);

    return (
        <ExpandableCard title="Maven Goals per Module" subheader="Execution time per module and maven plugin">
            <Box sx={{ height: `${diagramHeight(modules.length)}px` }}>
                <ResponsiveBar
                    {...basicBarCharProps}
                    data={barData}
                    keys={keys.sort()}
                    indexBy="module"
                    layout="horizontal"
                    colors={muiDistinctColors}
                    colorBy="id"
                    margin={{ ...defaultMargin, right: 220 }}
                    enableGridX={false}
                    enableGridY={true}
                    axisBottom={axisWithDuration}
                    legends={[
                        {
                            dataFrom: 'keys',
                            anchor: 'top-right',
                            direction: 'column',
                            translateX: 120,
                            translateY: 0,
                            itemsSpacing: 2,
                            itemWidth: 100,
                            itemHeight: 20,
                            toggleSerie: true,
                        }
                    ]}
                />
            </Box>
        </ExpandableCard>

    );
}