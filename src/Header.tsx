import { Typography } from "@mui/material";
import Box from "@mui/material/Box";


export const Header = () => {
    return <Box sx={{ color: "lightgray", borderBottom: "1px solid gray", paddingBottom: "20px", marginBottom: "20px" }}>
        <Typography variant="h1">Maven Performance Analyzer</Typography>
        <Typography variant={"subtitle1"}>Analyze Maven Logs to identify bottlenecks and speed up your build.</Typography>
    </Box>
};