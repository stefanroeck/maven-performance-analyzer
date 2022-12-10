import { Alert } from '@mui/material';
import { FunctionComponent } from 'react';
import { ExpandableCard } from '../cards/ExpandableCard';
import { InputSelector } from './InputSelector';

interface Props {
    onLogContentChanged: (logContent: string) => void;
    infoText: string | undefined;
    errorText: string | undefined;
}

export const InputCard: FunctionComponent<Props> = ({ onLogContentChanged, infoText, errorText }) => {
    return (
        <ExpandableCard title="Provide Maven Log" subheader={"The file can either be pasted as text, selected from disk or read from a url. All data will be processed on the client only, nothing will be uploaded to a server."} expanded={true}>
            <InputSelector onSelected={onLogContentChanged} />
            {errorText && <Alert severity="error" sx={{ marginTop: "20px" }}>{errorText}</Alert>}
            {infoText && <Alert severity="info" sx={{ marginTop: "20px" }}>{infoText}</Alert>}
        </ExpandableCard>
    );
}