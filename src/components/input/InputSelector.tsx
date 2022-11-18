import { Box, Button, Chip, FormControlLabel, Link, Switch, TextField, Typography } from "@mui/material";
import { ChangeEvent, FC, useState, MouseEvent } from "react";
import { fetchSampleFile } from "../../sample/fetchSampleFile";

type InputType = "file" | "text";

interface Props {
    onSelected: (content: string) => void;
}

export const InputSelector: FC<Props> = ({ onSelected }) => {
    const [inputType, setInputType] = useState<InputType>("text");

    const loadSampleFile = (e: MouseEvent) => {
        e.preventDefault();
        fetchSampleFile().then(text => {
            setTextFieldInput(text);
            onSelected(text);
        });
    };

    const [selectedFile, setSelectedFile] = useState<File | undefined>(undefined);
    const [textFieldInput, setTextFieldInput] = useState("");

    const switchComp = <Switch defaultChecked onChange={() => setInputType((old) => old === "file" ? "text" : "file")} />
    const handleSelectedFile = (event: ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files && files.length > 0) {
            setSelectedFile(files[0]);
            const reader = new FileReader();
            reader.onload = (e) => {
                if (typeof reader.result === "string" && reader.result !== null) {
                    onSelected(reader.result);
                }
            }
            reader.readAsText(files[0]);
        } else {
            onSelected("");
        }
    }

    const textFieldChange = (event: ChangeEvent<HTMLInputElement>) => {
        setTextFieldInput(event.target.value);
        onSelected(event.target.value);
    }

    return (<>
        <FormControlLabel control={switchComp} label={inputType === "file" ? "Select Log File" : "Enter as text"} sx={{ marginBottom: "10px" }} />
        <Typography component="span" hidden={inputType !== "text"} sx={{ float: "right", marginTop: "20px" }} variant={"subtitle2"}>
            Use&nbsp;
            <Link href="." onClick={loadSampleFile}>
                sample log file
            </Link>
        </Typography>
        <Box hidden={inputType !== "text"} >
            <TextField variant="outlined" minRows={4} maxRows={6} multiline fullWidth label="Maven Log File Output" value={textFieldInput} onChange={textFieldChange} inputProps={{ style: { fontSize: "small", fontFamily: "monospace" } }} />
        </Box>
        <Box hidden={inputType !== "file"}>
            <Button variant="outlined" component="label" color="primary" fullWidth>
                Select File
                <input hidden accept="text" multiple type="file" onChange={handleSelectedFile} />
            </Button>
            {selectedFile ?
                <Chip sx={{ marginTop: "10px" }} label={selectedFile?.name} onDelete={() => {
                    setSelectedFile(undefined); onSelected("");
                }} />
                : null}
        </Box>
    </>
    );
}