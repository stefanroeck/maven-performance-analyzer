import { Box } from '@mui/material';
import { FunctionComponent } from 'react';
import { BarDatum, ResponsiveBar } from '@nivo/bar';
import { AnalyzerRow } from '../analyzer/analyzer';
import { ExpandableCard } from './ExpandableCard';

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

    return (
        <ExpandableCard title="Maven Goals" subheader="Total execution time per maven plugin">
            <Box sx={{ height: "400px" }}>
                <ResponsiveBar
                    data={barData.sort((a, b) => a.duration - b.duration)}
                    keys={[
                        "duration",
                    ]}
                    indexBy="label"
                    layout="horizontal"
                    margin={{ top: 40, right: 40, bottom: 40, left: 120 }}
                    padding={0.3}
                    labelSkipWidth={30}
                    colors={{ scheme: 'blues' }}
                    colorBy="indexValue"
                    enableGridX={true}
                    enableGridY={false}
                />
            </Box>
        </ExpandableCard>
    );
}