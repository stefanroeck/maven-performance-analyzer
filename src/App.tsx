import { Box } from '@mui/system';
import { useState } from 'react';
import { TotalDurationCard } from './components/cards/TotalDurationCard';
import { InputCard } from './components/input/InputCard';
import { Header } from './Header';
import { DurationPerModuleCard } from './components/cards/DurationPerModuleCard';
import { parse } from './analyzer/parser';
import { analyze, AnalyzerRow } from './analyzer/analyzer';
import { TimelineCard } from './components/cards/TimelineCard';

function MainApp() {
  const [showTimeline, setShowTimeline] = useState(false);
  const [showTotalDuration, setShowTotalDuration] = useState(false);
  const [showDurationPerModule, setDurationPerModule] = useState(false);
  const [data, setData] = useState<AnalyzerRow[]>([]);

  const onAnalyze = (logContent: string) => {
    const result = analyze(parse(logContent));
    setData(result);
    const chartsVisible = result.length > 0;
    setShowTotalDuration(chartsVisible);
    setDurationPerModule(chartsVisible);
    setShowTimeline(chartsVisible);
  };

  return (
    <Box>
      <Header />
      <Box sx={{ margin: "20px" }}>
        <InputCard onAnalyze={onAnalyze} />
        {showTimeline && <TimelineCard data={data} />}
        {showDurationPerModule && <DurationPerModuleCard data={data} />}
        {showTotalDuration && <TotalDurationCard data={data} />}
      </Box>
    </Box >
  );
}

export default MainApp;
