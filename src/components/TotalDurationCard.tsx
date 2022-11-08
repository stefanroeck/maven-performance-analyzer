import { Box } from '@mui/material';
import { FunctionComponent } from 'react';
import { BarDatum, ResponsiveBar } from '@nivo/bar';
import { AnalyzerRow } from '../analyzer/analyzer';
import { ExpandableCard } from './ExpandableCard';
import { axisWithDuration, basicBarCharProps, formatDuration, muiColorGradient } from './diagramUtils';

interface Props {
    data: AnalyzerRow[];
}

export interface DataWithDuration extends BarDatum {
    label: string;
    duration: number;
}

export const TotalDurationCard: FunctionComponent<Props> = ({ data }) => {

    const barData = data.reduce((arr, curr) => {
        const existing = arr.find(e => e.label === curr.plugin);
        if (existing) {
            existing.duration += curr.duration;
        } else {
            arr.push({ label: curr.plugin, duration: curr.duration });
        }
        return arr;
    }, [] as DataWithDuration[]);
    const height = barData.length * 60 + 100;

    return (
        <ExpandableCard title="Maven Goals" subheader="Total execution time per maven plugin">
            <Box sx={{ height: `${height}px` }}>
                <ResponsiveBar
                    {...basicBarCharProps}
                    data={barData.sort((a, b) => a.duration - b.duration)}
                    keys={[
                        "duration",
                    ]}
                    indexBy="label"
                    valueFormat={formatDuration}
                    layout="horizontal"
                    margin={{ top: 40, right: 40, bottom: 40, left: 120 }}
                    colors={muiColorGradient}
                    colorBy="indexValue"
                    enableGridX={true}
                    enableGridY={false}
                    axisBottom={axisWithDuration}
                />
            </Box>
        </ExpandableCard>
    );
}