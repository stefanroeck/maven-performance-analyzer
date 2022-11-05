import { FC, PropsWithChildren } from "react";
import { Card, CardContent, CardHeader, Collapse, IconButton } from '@mui/material';
import { useState } from 'react';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';


interface Props extends PropsWithChildren {
    title: string;
    subheader: string;
}

export const ExpandableCard: FC<Props> = ({ children, title, subheader }) => {

    const [expanded, setExpanded] = useState(true);

    return (
        <Card>
            <CardHeader title={title} subheader={subheader} action={
                <IconButton onClick={() => setExpanded(old => !old)}>{expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}</IconButton>
            } />
            <Collapse in={expanded}>
                <CardContent>
                    {children}
                </CardContent>
            </Collapse>
        </Card>
    )
}