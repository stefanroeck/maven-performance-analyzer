import { Button, Card, CardActions, CardContent, CardHeader } from '@mui/material';
import { FunctionComponent } from 'react';
import { InputSelector } from './InputSelector';

interface Props {
    onAnalyze: () => void;
}

export const InputCard: FunctionComponent<Props> = ({ onAnalyze }) => {
    return (
        <Card>
            <CardHeader title="Provide Maven Log" subheader="Make sure the log file contains timestamps. Click here for more information. The file can either be uploaded or pasted as text. All data will be processed on the client only, nothgin will be uploaded to a server." />
            <CardContent>
                <InputSelector />

            </CardContent>
            <CardActions>
                <Button variant="contained" color="primary" sx={{ marginLeft: "auto", marginRight: "10px" }} onClick={onAnalyze}>Analyze</Button>
            </CardActions>
        </Card>

    );
}