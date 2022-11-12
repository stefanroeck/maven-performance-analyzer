import { Box } from '@mui/system';
import { useState } from 'react';
import { TotalDurationCard } from './components/cards/TotalDurationCard';
import { InputCard } from './components/input/InputCard';
import { Header } from './Header';
import { DurationPerModuleCard } from './components/cards/DurationPerModuleCard';
import { parse } from './analyzer/parser';
import { analyze, AnalyzerResult } from './analyzer/analyzer';
import { TimelineCard } from './components/cards/TimelineCard';
import { SourceCodeTreeMapCard } from './components/cards/SourceCodeTreeMapCard';

function MainApp() {
  const [data, setData] = useState<AnalyzerResult | undefined>(undefined);

  const onAnalyze = (logContent: string) => {
    const result = analyze(parse(logContent));
    setData(result);
  };

  return (
    <Box>
      <Header />
      <Box sx={{ margin: "20px" }}>
        <InputCard onAnalyze={onAnalyze} />
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
