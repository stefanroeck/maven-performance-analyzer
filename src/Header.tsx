import { Typography } from "@mui/material";
import Box from "@mui/material/Box";


export const Header = () => {
    return <Box sx={{ color: "#111", borderBottom: "1px solid gray", padding: "0 20px" }}>
        <img alt="Logo" src="./logo.png" height="120px" />
        <Box sx={{ display: "inline-block", verticalAlign: "top", marginLeft: "20px" }}>
            <Typography variant="h2" >Maven Performance Analyzer</Typography>
            <Typography variant={"subtitle1"}>Analyze Maven Logs to identify bottlenecks and speed up your build.</Typography>

        </Box>
    </Box>
};