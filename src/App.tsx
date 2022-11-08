import { Divider, Grid } from '@mui/material';
import { Box } from '@mui/system';
import { useState } from 'react';
import { TotalDurationCard } from './components/TotalDurationCard';
import { InputCard } from './components/InputCard';
import { Header } from './Header';
import { DurationPerModuleCard } from './components/DurationPerModuleCard';
import { parse } from './analyzer/parser';
import { analyze, AnalyzerRow } from './analyzer/analyzer';
import { TimelineCard } from './components/TimelineCard';

function MainApp() {
  const [showTimeline, setShowTimeline] = useState(false);
  const [showTotalDuration, setShowTotalDuration] = useState(false);
  const [showDurationPerModule, setDurationPerModule] = useState(false);
  const [data, setData] = useState<AnalyzerRow[]>([]);

  const onAnalyze = (logContent: string) => {
    const result = analyze(parse(logContent));
    setData(result);
    if (result.length > 0) {
      setShowTotalDuration(true);
      setDurationPerModule(true);
      setShowTimeline(true);
    }
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
