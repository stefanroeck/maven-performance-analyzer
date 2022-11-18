import { Alert, Button, Link, Typography } from '@mui/material';
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
    const subheader = <>
        <Typography component={"span"}>
            Make sure the log file contains timestamps. Click&nbsp;
            <Link href="https://www.baeldung.com/maven-logging#slf4j" target={"_new"}>
                here
            </Link>&nbsp;for more information
            The file can either be uploaded or pasted as text.
            All data will be processed on the client only, nothing will be uploaded to a server.
        </Typography>
    </>;
    return (
        <ExpandableCard title="Provide Maven Log" subheader={subheader} initiallyExpanded={true}>
            <InputSelector onSelected={setLogContent} />
            <Button
                disabled={logContent === ""}
                variant="contained"
                color="primary"
                sx={{ marginTop: "20px" }}
                onClick={() => onAnalyze(logContent)}
            >Analyze</Button>
            {errorText && <Alert severity="error" sx={{ marginTop: "20px" }}>{errorText}</Alert>}
            {infoText && <Alert severity="info" sx={{ marginTop: "20px" }}>{infoText}</Alert>}
        </ExpandableCard>
    );
}