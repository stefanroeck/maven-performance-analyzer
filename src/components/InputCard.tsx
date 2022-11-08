import { Button } from '@mui/material';
import { FunctionComponent, useState } from 'react';
import { ExpandableCard } from './ExpandableCard';
import { InputSelector } from './InputSelector';

interface Props {
    onAnalyze: (logContent: string) => void;
}

export const InputCard: FunctionComponent<Props> = ({ onAnalyze }) => {

    const [logContent, setLogContent] = useState("");

    return (
        <ExpandableCard title="Provide Maven Log" subheader="Make sure the log file contains timestamps. Click here for more information. The file can either be uploaded or pasted as text. All data will be processed on the client only, nothing will be uploaded to a server.">
            <InputSelector onSelected={setLogContent} />
            <Button
                disabled={logContent === ""}
                variant="contained"
                color="primary"
                sx={{ marginTop: "20px" }}
                onClick={() => onAnalyze(logContent)}
            >Analyze</Button>
        </ExpandableCard>
    );
}