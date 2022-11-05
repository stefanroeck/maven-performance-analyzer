import { Box } from '@mui/material';
import { FunctionComponent } from 'react';
import { BarDatum, ResponsiveBar } from '@nivo/bar';
import { AnalyzerRow } from '../analyzer/analyzer';
import { ExpandableCard } from './ExpandableCard';

interface Props {
    data: AnalyzerRow[];
}

export interface DataWithDuration extends BarDatum {
    thread: string;
    [key: string]: number | string;
}

export const TimelineCard: FunctionComponent<Props> = ({ data }) => {

    const barData = data.reduce((arr, curr) => {
        const existing = arr.find(e => e.thread === curr.thread || curr.thread === undefined);
        if (existing) {
            if (existing[curr.module] && typeof existing[curr.module] === "number") {
                (existing[curr.module] as number) += curr.duration;
            } else {
                existing[curr.module] = curr.duration;
            }
        } else {
            arr.push({ thread: "main", [curr.module]: curr.duration });
        }
        return arr;
    }, [] as DataWithDuration[]);

    // map to strings (except "module" and remove duplicates
    const keys = barData.flatMap(f => Object.keys(f).filter(f => f !== "module" && f !== "thread"))
        .filter((f, idx, arr) => arr.indexOf(f) === idx);

    const height = barData.length * 150;

    return (
        <ExpandableCard title="Timeline" subheader="Visualizes execution order and dependencies for multi-threaded builds">
            <Box sx={{ height: `${height}px` }}>
                <ResponsiveBar
                    data={barData}
                    keys={keys}
                    label="id"
                    indexBy="thread"
                    layout="horizontal"
                    margin={{ top: 40, right: 40, bottom: 40, left: 120 }}
                    padding={0.3}
                    innerPadding={2}
                    colors={{ scheme: 'pastel1' }}
                    colorBy="id"
                    enableGridX={true}
                    enableGridY={false}
                />
            </Box>
        </ExpandableCard>

    );
}