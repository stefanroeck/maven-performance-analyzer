import { Box } from '@mui/material';
import { FunctionComponent } from 'react';
import { BarDatum, ResponsiveBar } from '@nivo/bar';
import { AnalyzerRow } from '../analyzer/analyzer';
import { ExpandableCard } from './ExpandableCard';
import { axisWithDuration, basicBarCharProps, diagramHeight, formatDuration, muiDistinctColors } from './diagramUtils';

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


    return (
        <ExpandableCard title="Timeline" subheader="Visualizes execution order and dependencies for multi-threaded builds">
            <Box sx={{ height: `${diagramHeight(barData.length, "large")}px` }}>
                <ResponsiveBar
                    {...basicBarCharProps}
                    data={barData}
                    keys={keys}
                    label={"id"}
                    indexBy="thread"
                    layout="horizontal"
                    labelSkipWidth={60}
                    colors={muiDistinctColors}
                    colorBy="id"
                    enableGridX={true}
                    enableGridY={false}
                    axisBottom={axisWithDuration}
                />
            </Box>
        </ExpandableCard>

    );
}