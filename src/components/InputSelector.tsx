import { Box, Button, Chip, FormControlLabel, FormGroup, FormHelperText, IconButton, Switch, TextField, Typography } from "@mui/material";
import { ChangeEvent, useState } from "react";

type InputType = "file" | "text";

export const InputSelector = () => {
    const [inputType, setInputType] = useState<InputType>("text");
    const [selectedFile, setSelectedFile] = useState<File | undefined>(undefined);

    const switchComp = <Switch defaultChecked onChange={() => setInputType((old) => old === "file" ? "text" : "file")} />
    const handleSelectedFile = (event: ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files && files.length > 0) {
            setSelectedFile(files[0]);
        }
    }

    return (<>
        <FormGroup>
            <FormControlLabel control={switchComp} label={inputType === "file" ? "Upload Log File" : "Enter as text"} />
        </FormGroup>
        <Box hidden={inputType !== "text"} >
            <TextField variant="outlined" minRows={4} maxRows={4} multiline fullWidth />
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