import { Box, Button, Chip } from "@mui/material";
import { ChangeEvent, FunctionComponent, useState } from "react";
import { InputProps } from "./inputProps";

export const InputFile: FunctionComponent<InputProps> = ({
  visible,
  onSelected,
  disabled,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | undefined>(undefined);

  const handleSelectedFile = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      setSelectedFile(files[0]);
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string" && reader.result !== null) {
          onSelected(reader.result);
        }
      };
      reader.readAsText(files[0]);
    } else {
      onSelected("");
    }
  };

  return (
    <Box hidden={!visible}>
      <Button
        variant="contained"
        component="label"
        color="primary"
        fullWidth
        disabled={disabled}
      >
        Select File
        <input
          hidden
          accept="text"
          multiple
          type="file"
          onChange={handleSelectedFile}
        />
      </Button>
      {selectedFile ? (
        <Chip
          sx={{ marginTop: "10px" }}
          label={selectedFile?.name}
          onDelete={() => {
            setSelectedFile(undefined);
            onSelected("");
          }}
          disabled={disabled}
        />
      ) : null}
    </Box>
  );
};
