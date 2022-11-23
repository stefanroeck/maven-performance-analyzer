import { Box } from '@mui/system';
import { useState } from 'react';
import { TotalDurationCard } from './components/cards/TotalDurationCard';
import { InputCard } from './components/input/InputCard';
import { Header } from './Header';
import { DurationPerModuleCard } from './components/cards/DurationPerModuleCard';
import { parse } from './analyzer/parser';
import { analyze, AnalyzerResult } from './analyzer/analyzer';
import { SourceCodeTreeMapCard } from './components/cards/SourceCodeTreeMapCard';
import { TimelineCard } from './components/cards/TimelineCard';
import { HelpCard } from './components/input/HelpCard';

function MainApp() {
  const [data, setData] = useState<AnalyzerResult | undefined>(undefined);
  const showError = data !== undefined && data.modules.length === 0 && data.mavenPlugins.length === 0;
  const errorText = showError ? "No metrics could be found. Please make sure to provide a valid maven log file with timestamp information as described above." : undefined;
  const showInfo = data !== undefined && data.modules.length > 0 && data.mavenPlugins.length === 0;
  const infoText = showInfo ? "Durations cannot be calculated. Please make sure that the log file contains timestamps in the expected format yyyy-MM-dd HH:mm:ss,SSS" : undefined;

  const onAnalyze = (logContent: string) => {
    const result = analyze(parse(logContent));
    setData(result);
  };

  return (
    <Box>
      <Header />
      <Box sx={{ margin: "20px" }}>
        <HelpCard />
        <InputCard onAnalyze={onAnalyze} infoText={infoText} errorText={errorText} />
        {data && (data.mavenPlugins.length > 0) && <>
          <TimelineCard data={data.mavenPlugins} />
          <DurationPerModuleCard data={data.mavenPlugins} />
          <TotalDurationCard data={data.mavenPlugins} />
        </>}
        {data && (data.modules.length > 0) && <>
          <SourceCodeTreeMapCard data={data.modules} />
        </>}
      </Box>
    </Box >
  );
}

export default MainApp;
