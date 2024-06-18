import { FC, PropsWithChildren, ReactNode } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  Collapse,
  IconButton,
} from "@mui/material";
import { useState } from "react";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useEffect } from "react";

interface Props extends PropsWithChildren {
  title: string;
  subheader: ReactNode;
  expanded?: boolean;
  onExpanded?: (expanded: boolean) => void;
}

export const ExpandableCard: FC<Props> = ({
  children,
  title,
  subheader,
  expanded: initiallyExpanded = false,
  onExpanded = () => {},
}) => {
  const [expanded, setExpanded] = useState(initiallyExpanded);
  const [rendered, setRendered] = useState(false);
  useEffect(() => setExpanded(initiallyExpanded), [initiallyExpanded]);
  const handleOnExpandIconClick = () => {
    setExpanded((old) => {
      onExpanded(!old);
      return !old;
    });
    setRendered(true);
  };

  return (
    <Card sx={{ margin: "20px 0" }}>
      <CardHeader
        title={title}
        subheader={subheader}
        action={
          <IconButton onClick={handleOnExpandIconClick}>
            {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
        }
      />
      <Collapse in={expanded}>
        <CardContent>{(expanded || rendered) && children}</CardContent>
      </Collapse>
    </Card>
  );
};
