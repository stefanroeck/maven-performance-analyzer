import { Box, Card, CardActions, CardContent, CardHeader, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { FunctionComponent } from 'react';
import { BarDatum, ResponsiveBar } from '@nivo/bar';

interface Props {
    onClose: () => void;
}


export interface DataWithDuration extends BarDatum {
    label: string;
    duration: number;
}

export const TotalDurationCard: FunctionComponent<Props> = ({ onClose }) => {
    const barData: DataWithDuration[] = [{
        label: "maven-compiler",
        duration: 40
    }, {
        label: "surefire",
        duration: 140
    }, {
        label: "jrebel",
        duration: 10
    }, {
        label: "maven-jar",
        duration: 133
    }];
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