import { Box, Card, CardActions, CardContent, CardHeader, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { FunctionComponent } from 'react';
import { BarDatum, ResponsiveBar } from '@nivo/bar';
import { AnalyzerRow } from '../analyzer/analyzer';

interface Props {
    onClose: () => void;
    data: AnalyzerRow[];
}

export interface DataWithDuration extends BarDatum {
    label: string;
    duration: number;
}

export const TotalDurationCard: FunctionComponent<Props> = ({ data, onClose }) => {

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
        <Card>
            <CardHeader title="Maven Goals" subheader="Total execution time per maven plugin" action={
                <IconButton onClick={onClose}><CloseIcon /></IconButton>
            } />
            <CardContent>
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
                        colors={{ scheme: 'blues' }}
                        colorBy="indexValue"
                        enableGridX={true}
                        enableGridY={false}
                    />
                </Box>
            </CardContent>
            <CardActions >
            </CardActions>
        </Card>

    );
}