import { Typography } from "@mui/material";
import Box from "@mui/material/Box";


export const Header = () => {
    return <Box sx={{ color: "#111", borderBottom: "1px solid gray", padding: "0 20px", whiteSpace: "nowrap" }}>
        <img alt="Logo" src="./logo.png" height="120px" />
        <Box sx={{ display: "inline-block", verticalAlign: "top", marginLeft: "20px" }}>
            <Typography variant="h2" >Maven Performance Analyzer</Typography>
            <Typography variant={"subtitle1"}>Analyze Maven Logs to identify bottlenecks and speed up your build.</Typography>
            <a href="https://github.com/stefanroeck/maven-performance-analyzer">
                <img alt="Visit me at Github" src="GitHub-Mark-64px.png" style={{
                    height: "40px",
                    position: "absolute",
                    top: "20px",
                    right: "40px",
                }} /></a>
        </Box>
    </Box>
};