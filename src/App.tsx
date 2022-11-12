import { Box } from '@mui/system';
import { useState } from 'react';
import { TotalDurationCard } from './components/cards/TotalDurationCard';
import { InputCard } from './components/input/InputCard';
import { Header } from './Header';
import { DurationPerModuleCard } from './components/cards/DurationPerModuleCard';
import { parse } from './analyzer/parser';
import { analyze, AnalyzerRow } from './analyzer/analyzer';
import { TimelineCard } from './components/cards/TimelineCard';
import { SourceCodeTreeMapCard } from './components/cards/SourceCodeTreeMapCard';

function MainApp() {
  const [showResults, setShowResults] = useState(false);
  const [data, setData] = useState<AnalyzerRow[]>([]);

  const onAnalyze = (logContent: string) => {
    const result = analyze(parse(logContent));
    setData(result);
    const chartsVisible = result.length > 0;
    setShowResults(chartsVisible);
  };

  return (
    <Box>
      <Header />
      <Box sx={{ margin: "20px" }}>
        <InputCard onAnalyze={onAnalyze} />
        {showResults && <>
          <TimelineCard data={data} />
          <DurationPerModuleCard data={data} />
          <TotalDurationCard data={data} />
          <SourceCodeTreeMapCard data={data} />
        </>}
      </Box>
    </Box >
  );
}

export default MainApp;
