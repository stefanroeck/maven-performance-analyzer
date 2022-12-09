import { Box } from '@mui/system';
import { useState } from 'react';
import { MavenPluginsCard } from './components/cards/MavenPluginsCard';
import { InputCard } from './components/input/InputCard';
import { Header } from './Header';
import { ModulesCard } from './components/cards/ModulesCard';
import { parse } from './analyzer/parser';
import { analyze, AnalyzerResult } from './analyzer/analyzer';
import { SourceCodeTreeMapCard } from './components/cards/SourceCodeTreeMapCard';
import { TimelineCard } from './components/cards/TimelineCard';
import { HelpCard } from './components/input/HelpCard';
import { dedup } from './utils/arrayUtils';
import { StatisticsCard } from './components/cards/StatisticsCard';

function MainApp() {
  const [data, setData] = useState<AnalyzerResult | undefined>(undefined);
  const noMetricsFound = data !== undefined && data.modules.length === 0 && data.mavenPlugins.length === 0;
  const multiThreadedNoThreads = data?.stats.multiThreaded && data.stats.threads > 1 && dedup(data.mavenPlugins.map(p => p.thread)).length === 1;
  const errorText = noMetricsFound
    ? "No metrics could be found. Please make sure to provide a valid maven log file with timestamp information as described above."
    : multiThreadedNoThreads
      ? `This seems to be a multi-threaded build with ${data?.stats?.threads} threads but the thread name cannot be found in the log file. Please make sure to configure maven logger as described above.`
      : undefined;
  const showInfo = data !== undefined && data.modules.length > 0 && data.mavenPlugins.length === 0;
  const infoText = showInfo ? "Durations cannot be calculated. Please make sure that the log file contains timestamps in the expected format yyyy-MM-dd HH:mm:ss,SSS" : undefined;

  const onAnalyze = (logContent: string) => {
    if (logContent !== "") {
      const result = analyze(parse(logContent));
      setData(result);
    } else {
      setData(undefined);
    }
  };

  return (
    <Box>
      <Header />
      <Box sx={{ margin: "20px" }}>
        <HelpCard />
        <InputCard onAnalyze={onAnalyze} infoText={infoText} errorText={errorText} />
        {data && <>
          <StatisticsCard data={data.stats} />
        </>}
        {!errorText && data && (data.mavenPlugins.length > 0) && <>
          <TimelineCard data={data.mavenPlugins} />
          <ModulesCard data={data.mavenPlugins} />
          <MavenPluginsCard data={data.mavenPlugins} />
        </>}
        {!errorText && data && (data.modules.length > 0) && <>
          <SourceCodeTreeMapCard data={data.modules} />
        </>}
      </Box>
    </Box >
  );
}

export default MainApp;
