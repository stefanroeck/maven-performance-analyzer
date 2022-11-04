import { Button, Card, CardActions, CardContent, CardHeader, Typography } from '@mui/material';
import { InputSelector } from './InputSelector';


export const InputCard = () => {
    return (
        <Card>
            <CardHeader title="Provide Maven Log" subheader="Make sure the log file contains timestamps. Click here for more information. The file can either be uploaded or pasted as text. All data will be processed on the client only, nothgin will be uploaded to a server." />
            <CardContent>
                <InputSelector />

            </CardContent>
            <CardActions>
                <Button variant="contained" color="primary" sx={{ marginLeft: "auto", marginRight: "10px" }}>Analyze</Button>
            </CardActions>
        </Card>

    );
}