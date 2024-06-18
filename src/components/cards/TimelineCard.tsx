import { Box } from "@mui/material";
import { FunctionComponent } from "react";
import { MavenPluginStats } from "../../analyzer/analyzer";
import { ExpandableCard } from "./ExpandableCard";
import { diagramHeight, muiDistinctColors } from "./diagramUtils";
import ReactApexChart, { Props as ApexChartProps } from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { dedup } from "../../utils/arrayUtils";
import { grey } from "@mui/material/colors";

interface Props {
  data: ReadonlyArray<MavenPluginStats>;
}

interface DataWithDuration {
  thread: string;
  module: string;
  startTime: Date;
  duration: number;
}

export const TimelineCard: FunctionComponent<Props> = ({ data }) => {
  const barData = data.reduce(
    (arr, { thread, module, duration, startTime }) => {
      const existing = arr.find(
        (e) => e.thread === thread && e.module === module,
      );
      if (existing) {
        existing.duration += duration;
        if (startTime < existing.startTime) {
          existing.startTime = startTime;
        }
      } else {
        arr.push({
          thread,
          module,
          startTime,
          duration,
        });
      }
      return arr;
    },
    [] as DataWithDuration[],
  );

  const threads = dedup(barData.map((b) => b.thread));
  const modules = dedup(barData.map((b) => b.module));
  const multiThreaded = threads.length > 1;

  const series: ApexChartProps["series"] = [
    {
      data: barData.map((b, idx) => {
        return {
          fillColor: muiDistinctColors[idx % muiDistinctColors.length],
          x: multiThreaded ? b.thread : b.module,
          y: [
            b.startTime.getTime(),
            new Date(b.startTime.getTime() + b.duration).getTime(),
          ],
        };
      }),
    },
  ];

  const options: ApexOptions = {
    chart: {
      zoom: {
        enabled: false,
      },
      toolbar: {
        show: false,
      },
    },
    fill: {
      opacity: 1.0,
    },
    plotOptions: {
      bar: {
        horizontal: true,
        dataLabels: {
          orientation: "horizontal",
          hideOverflowingLabels: false,
          position: "bottom",
        },
      },
    },
    dataLabels: {
      enabled: true,
      textAnchor: "start",
      offsetX: -35,
      style: {
        colors: ["black"],
        fontWeight: "normal",
      },
      formatter: function (val, opts) {
        const label = modules[opts.dataPointIndex];
        if (Array.isArray(val)) {
          const from = new Date(val[0]);
          const to = new Date(val[1]);
          const millis = to.getTime() - from.getTime();
          return `${label} - ${new Date(millis)
            .toISOString()
            .substring(14, 19)}`;
        }
        return label + "";
      },
    },
    xaxis: {
      type: "datetime",
      labels: {
        datetimeUTC: false,
      },
    },
    yaxis: {
      show: true,
    },
    grid: {
      row: {
        colors: [grey[50], "#fff"],
      },
      xaxis: {
        lines: {
          show: true,
        },
      },
      yaxis: {
        lines: {
          show: false,
        },
      },
    },
    states: {
      hover: {
        filter: {
          type: "none",
        },
      },
      active: {
        filter: {
          type: "none",
        },
      },
    },
    tooltip: {
      x: {
        format: "HH:mm:ss",
      },
    },
  };

  const height = diagramHeight(
    multiThreaded ? threads.length : modules.length,
    "normal",
  );
  return (
    <ExpandableCard
      expanded={true}
      title="Timeline"
      subheader="Visualizes execution order and dependencies for multi-module builds. Each line represents a module. In case of multithreaded builds, multiple modules are built concurrently. Only works, if the thread name is part of the log file."
    >
      <ReactApexChart
        options={options}
        series={series}
        type="rangeBar"
        height={height}
      />
      <Box sx={{ overflowX: "auto" }}></Box>
    </ExpandableCard>
  );
};
