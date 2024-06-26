import { Box } from "@mui/material";
import { FunctionComponent } from "react";
import { BarDatum, ResponsiveBar } from "@nivo/bar";
import { MavenPluginStats } from "../../analyzer/analyzer";
import { ExpandableCard } from "./ExpandableCard";
import {
  axisWithDuration,
  basicBarCharProps,
  diagramHeight,
  muiColorGradients,
} from "./diagramUtils";

interface Props {
  data: ReadonlyArray<MavenPluginStats>;
}

export interface DataWithDuration extends BarDatum {
  label: string;
  duration: number;
}

export const MavenPluginsCard: FunctionComponent<Props> = ({ data }) => {
  const barData = data.reduce((arr, curr) => {
    const existing = arr.find((e) => e.label === curr.plugin);
    if (existing) {
      existing.duration += curr.duration;
    } else {
      arr.push({ label: curr.plugin, duration: curr.duration });
    }
    return arr;
  }, [] as DataWithDuration[]);

  return (
    <ExpandableCard
      title="Maven Build Plugins"
      subheader="Aggregated execution time per maven build plugin"
    >
      <Box sx={{ height: `${diagramHeight(barData.length)}px` }}>
        <ResponsiveBar
          {...basicBarCharProps}
          data={barData.sort((a, b) => a.duration - b.duration)}
          keys={["duration"]}
          indexBy="label"
          layout="horizontal"
          colors={muiColorGradients(barData.length)}
          colorBy="indexValue"
          enableGridX={true}
          enableGridY={false}
          axisBottom={axisWithDuration}
        />
      </Box>
    </ExpandableCard>
  );
};
