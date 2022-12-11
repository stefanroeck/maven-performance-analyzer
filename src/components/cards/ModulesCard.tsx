import { Box } from '@mui/material';
import { FunctionComponent } from 'react';
import { BarDatum, ResponsiveBar } from '@nivo/bar';
import { MavenPluginStats } from '../../analyzer/analyzer';
import { ExpandableCard } from './ExpandableCard';
import { axisWithDuration, basicBarCharProps, defaultMargin, diagramHeight, muiDistinctColors } from './diagramUtils';
import { dedup } from '../../utils/arrayUtils';

interface Props {
    data: MavenPluginStats[];
}


interface DataWithDuration extends BarDatum {
    module: string;
    [key: string]: number | string;
    totalDuration: number;
}

const totalDuration = (data: MavenPluginStats[], module: string) => {
    return data.filter(d => d.module === module).reduce((sum, d) => sum + d.duration, 0);
}

export const ModulesCard: FunctionComponent<Props> = ({ data }) => {
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
            arr.push({ ...curr, totalDuration: totalDuration(data, curr.module) });
        }
        return arr;
    }, [] as DataWithDuration[]);

    // extract relevant keys and remove duplicates
    const keys = dedup(barData.flatMap(f => Object.keys(f).filter(f => f !== "module" && f !== "totalDuration")));
    const modules = dedup(barData.flatMap(f => f.module));
    barData.sort((a, b) => a.totalDuration - b.totalDuration);

    return (
        <ExpandableCard title="Modules" subheader="Execution time per module and maven build plugin">
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