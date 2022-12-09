import { Box, Button, FormControl, FormHelperText, InputAdornment, TextField } from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2";
import { ChangeEvent, FC, useState } from "react";
import { fetchFile } from "../../sample/fetchSampleFile";
import ValidIcon from '@mui/icons-material/TaskAltOutlined';
import { styled } from "@mui/system";
import { green } from "@mui/material/colors";

interface Props {
    visible: boolean;
    onSelected: (content: string) => void;
}

const StyledValidIcon = styled(ValidIcon)({
    color: green[500],
});


export const InputUrl: FC<Props> = ({ onSelected, visible }) => {
    const [url, setUrl] = useState("");
    const [valid, setValid] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | undefined>(undefined);

    const textFieldChange = (event: ChangeEvent<HTMLInputElement>) => {
        setUrl(old => {
            if (old !== event.target.value) {
                setValid(false);
            }
            return event.target.value;
        });
    }

    const onButtonClick = () => {
        if (url !== "") {
            setLoading(true);
            setError(undefined);
            fetchFile(url).then(text => {
                onSelected(text);
                setValid(text.length > 0);
                setLoading(false);
            }).catch((e: Error) => {
                setLoading(false);
                setValid(false);
                setError(e.message);
                onSelected("");
            });
        }
    }

    return (<>
        <Box hidden={!visible} >
            <Grid2 container spacing={2}>
                <Grid2 xs={11}>
                    <FormControl fullWidth error={error !== undefined}>
                        <TextField fullWidth variant="outlined"
                            label="Url to Maven Log"
                            value={url}
                            onChange={textFieldChange}

                            InputProps={valid ? {
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <StyledValidIcon />
                                    </InputAdornment>
                                ),
                            } : { error: error !== undefined }}
                        />
                        <FormHelperText>{error}</FormHelperText>
                    </FormControl>
                </Grid2>
                <Grid2 xs={1}>
                    <Button fullWidth variant="outlined" color="primary"
                        onClick={onButtonClick} disabled={loading}>
                        Load
                    </Button>
                </Grid2>
            </Grid2>
        </Box>
    </>);

}