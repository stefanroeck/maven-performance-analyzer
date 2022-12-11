import { Alert } from '@mui/material';
import { FC, useContext } from 'react';
import { AnalyzerContext } from '../../analyzer/analyzerContext';
import { ExpandableCard } from '../cards/ExpandableCard';
import { InputSelector } from './InputSelector';


export const InputCard: FC = () => {
    const { analyzerResult } = useContext(AnalyzerContext);
    const infoText = analyzerResult?.messages.info;
    const errorText = analyzerResult?.messages.error;

    return (
        <ExpandableCard title="Provide Maven Log" subheader={"The file can either be pasted as text, selected from disk or read from a url. All data will be processed on the client only, nothing will be uploaded to a server."} expanded={true}>
            <InputSelector />
            {errorText && <Alert severity="error" sx={{ marginTop: "20px" }}>{errorText}</Alert>}
            {infoText && <Alert severity="info" sx={{ marginTop: "20px" }}>{infoText}</Alert>}
        </ExpandableCard>
    );
}