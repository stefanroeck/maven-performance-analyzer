import { Typography, Link, Box, TextField, Button } from "@mui/material";
import { ChangeEvent, FunctionComponent, MouseEvent, useState } from "react";
import { fetchSampleFile } from "../../sample/fetchSampleFile";
import { InputProps } from "./inputProps";

export const InputText: FunctionComponent<InputProps> = ({
  onSelected,
  visible,
  disabled,
}) => {
  const [textFieldInput, setTextFieldInput] = useState("");
  const textFieldChange = (event: ChangeEvent<HTMLInputElement>) => {
    setTextFieldInput(event.target.value);
  };
  const loadSampleFile = (e: MouseEvent<HTMLElement>) => {
    e.preventDefault();
    fetchSampleFile().then((text) => {
      setTextFieldInput(text);
    });
  };

  return (
    <Box hidden={!visible}>
      <Typography
        component="span"
        sx={{ float: "right" }}
        variant={"subtitle2"}
      >
        Use&nbsp;
        <Link href="." onClick={loadSampleFile}>
          sample log file
        </Link>
      </Typography>
      <TextField
        variant="outlined"
        minRows={4}
        maxRows={6}
        multiline
        fullWidth
        label="Maven Log File Output"
        value={textFieldInput}
        onChange={textFieldChange}
        inputProps={{ style: { fontSize: "small", fontFamily: "monospace" } }}
      />
      <Button
        disabled={textFieldInput === "" || disabled}
        variant="contained"
        fullWidth
        color="primary"
        sx={{ marginTop: "20px" }}
        onClick={() => onSelected(textFieldInput)}
      >
        Analyze
      </Button>
    </Box>
  );
};
