import { Paper, Tab, Tabs } from "@mui/material";
import { FC, useState, SyntheticEvent, useContext } from "react";
import FileIcon from '@mui/icons-material/AttachFileOutlined';
import TextIcon from '@mui/icons-material/DescriptionOutlined';
import UrlIcon from '@mui/icons-material/LinkOutlined';
import { InputText } from "./InputText";
import { InputFile } from "./InputFile";
import { InputUrl } from "./InputUrl";
import { AnalyzerContext } from "../../analyzer/analyzerContext";

type InputType = "file" | "text" | "url";
const inputTypes: InputType[] = ["text", "url", "file"];

export const InputSelector: FC = () => {
    const [inputType, setInputType] = useState<InputType>("text");

    const onTabChanged = (_event: SyntheticEvent, tabPos: number) => {
        setInputType(inputTypes[tabPos]);
    }

    const { setAnalyzerInput } = useContext(AnalyzerContext);

    return (<>
        <Tabs value={inputTypes.indexOf(inputType)} onChange={onTabChanged} sx={{ marginTop: "-30px" }}>
            <Tab label={"Enter as Text"} icon={<TextIcon />} iconPosition={"start"} />
            <Tab label={"Enter Url"} icon={<UrlIcon />} iconPosition={"start"} />
            <Tab label={"Select file from disk"} icon={<FileIcon />} iconPosition={"start"} />
        </Tabs>

        <Paper elevation={2} sx={{ padding: "20px" }}>
            <InputText onSelected={setAnalyzerInput} visible={inputType === "text"} />
            <InputFile onSelected={setAnalyzerInput} visible={inputType === "file"} />
            <InputUrl onSelected={setAnalyzerInput} visible={inputType === "url"} />
        </Paper>
    </>
    );
}