import { Box } from '@mui/material';
import { FunctionComponent } from 'react';
import { BarDatum, ResponsiveBar } from '@nivo/bar';
import { AnalyzerRow } from '../analyzer/analyzer';
import { ExpandableCard } from './ExpandableCard';

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
    return (
        <ExpandableCard title="Maven Goals per Module" subheader="Execution time per module and maven plugin">
            <Box sx={{ height: "400px" }}>
                <ResponsiveBar
                    data={barData}
                    keys={keys}
                    indexBy="module"
                    layout="vertical"
                    margin={{ top: 40, right: 140, bottom: 40, left: 120 }}
                    padding={0.3}
                    innerPadding={2}
                    colors={{ scheme: 'pastel2' }}
                    colorBy="id"
                    borderRadius={2}
                    enableGridX={false}
                    enableGridY={true}
                    legends={[
                        {
                            dataFrom: 'keys',
                            anchor: 'bottom-right',
                            direction: 'column',
                            translateX: 120,
                            translateY: 0,
                            itemsSpacing: 2,
                            itemWidth: 100,
                            itemHeight: 20,
                        }
                    ]}
                />
            </Box>
        </ExpandableCard>

    );
}