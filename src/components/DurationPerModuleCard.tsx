import { Box, Card, CardActions, CardContent, CardHeader, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { FunctionComponent } from 'react';
import { BarDatum, ResponsiveBar } from '@nivo/bar';

interface Props {
    onClose: () => void;
}


export interface DataWithDuration extends BarDatum {
    module: string;
    [key: string]: number | string;
}

export const DurationPerModuleCard: FunctionComponent<Props> = ({ onClose }) => {
    const barData: DataWithDuration[] = [{
        module: "main",
        mavenCompiler: 65,
        surefire: 23,
        jasper: 43,
        jrebel: 4
    }, {
        module: "client",
        mavenCompiler: 43,
        surefire: 20,
        install: 13,
    }, {
        module: "shared",
        mavenCompiler: 140,
        surefire: 20,
        install: 33,
        jrebel: 4
    }
    ];

    // TODO remove duplicates
    const keys = barData.flatMap(f => Object.keys(f).filter(f => f !== "module"));
    return (
        <Card>
            <CardHeader title="Maven Goals per Module" subheader="Execution time per module and maven plugin" action={
                <IconButton onClick={onClose}><CloseIcon /></IconButton>
            } />
            <CardContent>
                <Box sx={{ height: "400px" }}>
                    <ResponsiveBar
                        data={barData}
                        keys={keys}
                        indexBy="module"
                        layout="vertical"
                        margin={{ top: 40, right: 40, bottom: 40, left: 120 }}
                        padding={0.3}
                        innerPadding={2}
                        colors={{ scheme: 'nivo' }}
                        colorBy="id"
                        enableGridX={false}
                        enableGridY={true}
                    />
                </Box>
            </CardContent>
            <CardActions >
            </CardActions>
        </Card>

    );
}