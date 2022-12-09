import { Divider, SvgIconTypeMap, Typography } from "@mui/material";
import { green, grey, red } from "@mui/material/colors";
import { styled } from "@mui/system";
import { FunctionComponent } from "react";
import { OverridableComponent } from "@mui/types";
import { Stats } from "../../analyzer/analyzer";
import { ExpandableCard } from "./ExpandableCard";
import SuccessIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorIcon from '@mui/icons-material/ErrorOutline';
import UnknownIcon from '@mui/icons-material/HelpOutline';
import SingleThreadIcon from '@mui/icons-material/Filter1';
import MultiThreadIcon from '@mui/icons-material/FilterNone';

interface Props {
    data: Stats;
}

const StatsContainer = styled('div')({
    display: "flex",
});

const StatsBox = styled('div')({
    flex: "auto",
    textAlign: "center",
    padding: "10px",
});

const StatsLabel = styled(Typography)({
    fontSize: 12,
    color: grey[500],
    fontWeight: 500,
});

const StatsValue = styled(Typography)({
    fontSize: 20,
    fontWeight: 'bold',
    letterSpacing: '1px',
});

const aligned = (icon: OverridableComponent<SvgIconTypeMap>, additionalStyles = {}) => styled(icon)({
    verticalAlign: "text-top",
    marginRight: "5px",
    ...additionalStyles,
});

const AlignedFailedIcon = aligned(ErrorIcon, {
    color: red[500],
});

const AlignedSuccessIcon = aligned(SuccessIcon, {
    color: green[500],
});

const AlignedUnkownIcon = aligned(UnknownIcon, {
    color: grey[500],
});

const AlignedSingleThreadIcon = aligned(SingleThreadIcon);
const AlignedMultiThreadIcon = aligned(MultiThreadIcon);

const capitalize = (s: string): string => {
    return s.length > 1 ? s.substring(0, 1).toUpperCase() + s.substring(1) : s;
}

export const StatisticsCard: FunctionComponent<Props> = ({ data: { totalBuildTime: totalDuration, multiThreaded, threads, status } }) => {
    return (
        <ExpandableCard title="Statistics" subheader="" expanded={true}>
            <Divider />
            <StatsContainer>
                <StatsBox>
                    <StatsLabel>Build Status</StatsLabel>
                    <StatsValue>
                        {status === "success" ? <AlignedSuccessIcon /> : status === "failed" ? <AlignedFailedIcon /> : <AlignedUnkownIcon />}
                        {capitalize(status)}
                    </StatsValue>
                </StatsBox>
                <Divider orientation="vertical" variant="middle" flexItem />
                <StatsBox>
                    <StatsLabel>Total Time</StatsLabel>
                    <StatsValue>{totalDuration}</StatsValue>
                </StatsBox>
                <Divider orientation="vertical" variant="middle" flexItem />
                <StatsBox>
                    <StatsLabel>Parallelism</StatsLabel>
                    <StatsValue><>
                        {multiThreaded ? <AlignedMultiThreadIcon /> : <AlignedSingleThreadIcon />}
                        {multiThreaded ? `${threads} Threads` : "Single Threaded"}</>
                    </StatsValue>
                </StatsBox>
            </StatsContainer>
        </ExpandableCard>
    );
}