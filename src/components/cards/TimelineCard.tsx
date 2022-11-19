import { Box } from '@mui/material';
import { FunctionComponent } from 'react';
import { Bar, BarDatum } from '@nivo/bar';
import { AnalyzerRow } from '../../analyzer/analyzer';
import { ExpandableCard } from './ExpandableCard';
import { axisWithDuration, basicBarCharProps, diagramHeight, muiDistinctColors } from './diagramUtils';
import { dedup } from '../../utils/arrayUtils';

interface Props {
    data: AnalyzerRow[];
}

export interface DataWithDuration extends BarDatum {
    thread: string;
    [key: string]: number | string;
}

export const TimelineCard: FunctionComponent<Props> = ({ data }) => {

    const barData = data.reduce((arr, { thread, module, duration }) => {
        const existing = arr.find(e => e.thread === thread);
        if (existing) {
            if (existing[module]) {
                (existing[module] as number) += duration;
            } else {
                existing[module] = duration;
            }
        } else {
            arr.push({ thread, [module]: duration });
        }
        return arr;
    }, [] as DataWithDuration[]);

    const keys = dedup(data.flatMap(f => f.module));


    const width = Math.max(keys.length * 100, document.body.clientWidth - 80);

    return (
        <ExpandableCard initiallyExpanded={true} title="Timeline" subheader="Visualizes execution order and dependencies for multi-module builds. Each line represents one thread for multi-threaded builds. Make sure that the threadName is part of the log file.">
            <Box sx={{ overflowX: "auto" }}>
                <Bar
                    height={diagramHeight(barData.length, "large")}
                    width={width}
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