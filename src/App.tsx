import { Divider } from '@mui/material';
import { Box } from '@mui/system';
import { useState } from 'react';
import { TotalDurationCard } from './components/TotalDurationCard';
import { InputCard } from './components/InputCard';
import { Header } from './Header';
import { DurationPerModuleCard } from './components/DurationPerModuleCard';

function MainApp() {
  const [showTotalDuration, setShowTotalDuration] = useState(false);
  const [showDurationPerModule, setDurationPerModule] = useState(false);

  const onAnalyze = () => {
    //setShowTotalDuration(true);
    setDurationPerModule(true);
  };

  return (
    <Box>
      <Header />
      <Box sx={{ margin: "20px" }}>
        <InputCard onAnalyze={onAnalyze} />
        <Divider sx={{ margin: "20px" }} />
        {showTotalDuration && <TotalDurationCard onClose={() => setShowTotalDuration(false)} />}
        <Divider sx={{ margin: "20px" }} />
        {showDurationPerModule && <DurationPerModuleCard onClose={() => setDurationPerModule(false)} />}
      </Box>
    </Box >
  );
}

export default MainApp;
