import { Typography, Link, Box, TextField } from "@mui/material";
import { ChangeEvent, FunctionComponent, MouseEvent, useState } from "react";
import { fetchSampleFile } from "../../sample/fetchSampleFile";

interface Props {
    visible: boolean;
    onSelected: (content: string) => void;
}

export const InputText: FunctionComponent<Props> = ({ onSelected, visible }) => {
    const [textFieldInput, setTextFieldInput] = useState("");
    const textFieldChange = (event: ChangeEvent<HTMLInputElement>) => {
        setTextFieldInput(event.target.value);
        onSelected(event.target.value);
    }
    const loadSampleFile = (e: MouseEvent<HTMLElement>) => {
        e.preventDefault();
        fetchSampleFile().then(text => {
            setTextFieldInput(text);
            onSelected(text);
        });
    };

    return (<>
        <Typography component="span" hidden={!visible} sx={{ float: "right" }} variant={"subtitle2"}>
            Use&nbsp;
            <Link href="." onClick={loadSampleFile}>
                sample log file
            </Link>
        </Typography>
        <Box hidden={!visible} >
            <TextField variant="outlined" minRows={4} maxRows={6} multiline fullWidth label="Maven Log File Output" value={textFieldInput} onChange={textFieldChange} inputProps={{ style: { fontSize: "small", fontFamily: "monospace" } }} />
        </Box>
    </>);

}