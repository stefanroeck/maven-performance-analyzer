import { BarDatum, BarSvgProps } from "@nivo/bar";
import {
  amber,
  blue,
  blueGrey,
  brown,
  cyan,
  deepOrange,
  deepPurple,
  green,
  grey,
  indigo,
  lightBlue,
  lightGreen,
  lime,
  orange,
  pink,
  purple,
  red,
  teal,
  yellow,
} from "@mui/material/colors";

export const axisWithDuration = {
  format: (v: string) => `${formatDuration(parseInt(v))}`,
};

export function formatDuration(v: number) {
  return new Date(v).toISOString().substring(14, 19);
}

export const defaultMargin = {
  top: 0,
  right: 20,
  bottom: 20,
  left: 160,
};
// a comment
export const basicBarCharProps: Partial<
  Omit<BarSvgProps<BarDatum>, "height" | "width">
> = {
  padding: 0.3,
  innerPadding: 0,
  labelSkipWidth: 35,
  borderRadius: 0,
  margin: defaultMargin,
  valueFormat: formatDuration,
};

const colorVariant = 200;
export const muiDistinctColors: string[] = [
  amber[colorVariant],
  blue[colorVariant],
  blueGrey[colorVariant],
  brown[colorVariant],
  cyan[colorVariant],
  deepOrange[colorVariant],
  deepPurple[colorVariant],
  green[colorVariant],
  grey[colorVariant],
  indigo[colorVariant],
  lightBlue[colorVariant],
  lightGreen[colorVariant],
  lime[colorVariant],
  orange[colorVariant],
  pink[colorVariant],
  purple[colorVariant],
  red[colorVariant],
  teal[colorVariant],
  yellow[colorVariant],
];

export const muiColorGradient: string[] = [
  amber[50],
  amber[100],
  amber[200],
  amber[300],
  amber[400],
  amber[500],
  amber[600],
  amber[700],
  amber[800],
  amber[900],
];

export const muiColorGradients = (size: number) => {
  return Array.from(Array(size).keys()).map(
    (i) => muiColorGradient[Math.floor((i * muiColorGradient.length) / size)],
  );
};

export const diagramHeight = (
  elements: number,
  barHeight: "normal" | "large" = "normal",
) => {
  return elements * (barHeight === "normal" ? 40 : 60) + 100;
};
