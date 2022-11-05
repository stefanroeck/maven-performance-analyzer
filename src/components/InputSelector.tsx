import { Box, Button, Chip, FormControlLabel, FormGroup, Switch, TextField } from "@mui/material";
import { ChangeEvent, FC, useState } from "react";

type InputType = "file" | "text";

interface Props {
    onSelected: (content: string) => void;
}

export const InputSelector: FC<Props> = ({ onSelected }) => {
    const [inputType, setInputType] = useState<InputType>("text");

    const [selectedFile, setSelectedFile] = useState<File | undefined>(undefined);
    const [textFieldInput, setTextFieldInput] = useState("");

    const switchComp = <Switch defaultChecked onChange={() => setInputType((old) => old === "file" ? "text" : "file")} />
    const handleSelectedFile = (event: ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files && files.length > 0) {
            setSelectedFile(files[0]);
        }
    }

    const textFieldChange = (event: ChangeEvent<HTMLInputElement>) => {
        setTextFieldInput(event.target.value);
        onSelected(event.target.value);
    }

    return (<>
        <FormGroup sx={{ marginBottom: "10px" }}>
            <FormControlLabel control={switchComp} label={inputType === "file" ? "Upload Log File" : "Enter as text"} />
        </FormGroup>
        <Box hidden={inputType !== "text"} >
            <TextField variant="outlined" minRows={4} maxRows={4} multiline fullWidth label="Maven Log File Output" value={textFieldInput} onChange={textFieldChange} />
        </Box>
        <Box hidden={inputType !== "file"}>
            <Button variant="outlined" component="label" color="secondary" fullWidth>
                Select File
                <input hidden accept="text" multiple type="file" onChange={handleSelectedFile} />
            </Button>
            {selectedFile ?
                <Chip sx={{ marginTop: "10px" }} label={selectedFile?.name} onDelete={() => setSelectedFile(undefined)} />
                : null}
        </Box>
    </>
    );
}