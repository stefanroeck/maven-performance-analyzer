import { Alert, Button } from '@mui/material';
import { FunctionComponent, useState } from 'react';
import { ExpandableCard } from '../cards/ExpandableCard';
import { InputSelector } from './InputSelector';

interface Props {
    onAnalyze: (logContent: string) => void;
    infoText: string | undefined;
    errorText: string | undefined;
}

export const InputCard: FunctionComponent<Props> = ({ onAnalyze, infoText, errorText }) => {

    const [logContent, setLogContent] = useState("");
    return (
        <ExpandableCard title="Provide Maven Log" subheader={"The file can either be uploaded or pasted as text. All data will be processed on the client only, nothing will be uploaded to a server."} expanded={true}>
            <InputSelector onSelected={setLogContent} />
            <Button
                disabled={logContent === ""}
                variant="contained"
                fullWidth
                color="primary"
                sx={{ marginTop: "20px" }}
                onClick={() => onAnalyze(logContent)}
            >Analyze</Button>
            {errorText && <Alert severity="error" sx={{ marginTop: "20px" }}>{errorText}</Alert>}
            {infoText && <Alert severity="info" sx={{ marginTop: "20px" }}>{infoText}</Alert>}
        </ExpandableCard>
    );
}