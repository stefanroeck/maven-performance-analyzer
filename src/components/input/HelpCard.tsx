import { Typography, Link, TextField } from "@mui/material";
import { grey } from "@mui/material/colors";
import { MouseEvent, useState } from "react";
import { ExpandableCard } from "../cards/ExpandableCard";

const mavenConfigLines: string[] = [
  "org.slf4j.simpleLogger.showThreadName=true",
  "org.slf4j.simpleLogger.showDateTime=true",
  "org.slf4j.simpleLogger.dateTimeFormat=yyyy-MM-dd HH:mm:ss,SSS",
];

export const HelpCard = () => {
  const [expanded, setExpanded] = useState(false);
  const handleOnClick = (e: MouseEvent) => {
    e.preventDefault();
    setExpanded(true);
  };

  const subheader = (
    <>
      <Typography component={"span"}>
        Make sure the log file contains timestamps and (optionally) thread
        names. Click&nbsp;
        <Link href="#" onClick={handleOnClick}>
          here
        </Link>
        &nbsp;for more information
      </Typography>
    </>
  );
  return (
    <ExpandableCard
      title="Prepare Maven Log File"
      subheader={subheader}
      expanded={expanded}
      onExpanded={setExpanded}
    >
      <Typography variant="body2">
        Append the following JVM arguments to the maven build command line:
      </Typography>
      <TextField
        multiline
        fullWidth
        value={
          '-Dorg.slf4j.simpleLogger.showThreadName=true -Dorg.slf4j.simpleLogger.showDateTime=true -Dorg.slf4j.simpleLogger.dateTimeFormat="yyyy-MM-dd HH:mm:ss,SSS"'
        }
        InputProps={{ readOnly: true }}
        sx={{ backgroundColor: grey[100] }}
      />
      <Typography variant="body2" mt={2}>
        {
          "Alternatively, for global configuration adjust the maven logger config which is typically located in %MAVEN_HOME%/conf/logging/simplelogger.properties"
        }
      </Typography>
      <TextField
        multiline
        fullWidth
        value={mavenConfigLines.join("\n")}
        InputProps={{ readOnly: true }}
        sx={{ backgroundColor: grey[100] }}
      />
    </ExpandableCard>
  );
};
