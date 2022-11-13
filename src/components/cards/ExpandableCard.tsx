import { FC, PropsWithChildren, ReactNode } from "react";
import { Card, CardContent, CardHeader, Collapse, IconButton } from '@mui/material';
import { useState } from 'react';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';


interface Props extends PropsWithChildren {
    title: string;
    subheader: ReactNode;
    initiallyExpanded?: boolean;
}

export const ExpandableCard: FC<Props> = ({ children, title, subheader, initiallyExpanded = false }) => {

    const [expanded, setExpanded] = useState(initiallyExpanded);
    const [rendered, setRendered] = useState(false);
    const onExpand = () => {
        setExpanded(old => !old);
        setRendered(true);
    }

    return (
        <Card sx={{ margin: "20px 0" }}>
            <CardHeader title={title} subheader={subheader} action={
                <IconButton onClick={onExpand}>{expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}</IconButton>
            } />
            <Collapse in={expanded}>
                <CardContent>
                    {(expanded || rendered) && children}
                </CardContent>
            </Collapse>
        </Card>
    )
}