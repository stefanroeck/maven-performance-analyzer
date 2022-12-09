import { Paper, Tab, Tabs } from "@mui/material";
import { FC, useState, SyntheticEvent } from "react";
import FileIcon from '@mui/icons-material/AttachFileOutlined';
import TextIcon from '@mui/icons-material/DescriptionOutlined';
import UrlIcon from '@mui/icons-material/LinkOutlined';
import { InputText } from "./InputText";
import { InputFile } from "./InputFile";
import { InputUrl } from "./InputUrl";

type InputType = "file" | "text" | "url";
const inputTypes: InputType[] = ["text", "url", "file"];

interface Props {
    onSelected: (content: string) => void;
}

export const InputSelector: FC<Props> = ({ onSelected }) => {
    const [inputType, setInputType] = useState<InputType>("text");

    const onTabChanged = (_event: SyntheticEvent, tabPos: number) => {
        setInputType(inputTypes[tabPos]);
    }

    return (<>
        <Tabs value={inputTypes.indexOf(inputType)} onChange={onTabChanged} sx={{ marginTop: "-30px" }}>
            <Tab label={"Enter as Text"} icon={<TextIcon />} iconPosition={"start"} />
            <Tab label={"Enter Url"} icon={<UrlIcon />} iconPosition={"start"} />
            <Tab label={"Select file from disk"} icon={<FileIcon />} iconPosition={"start"} />
        </Tabs>

        <Paper elevation={2} sx={{ padding: "20px" }}>
            <InputText onSelected={onSelected} visible={inputType === "text"} />
            <InputFile onSelected={onSelected} visible={inputType === "file"} />
            <InputUrl onSelected={onSelected} visible={inputType === "url"} />
        </Paper>
    </>
    );
}