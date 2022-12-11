import { Box } from '@mui/system';
import { useState } from 'react';
import { MavenPluginsCard } from './components/cards/MavenPluginsCard';
import { InputCard } from './components/input/InputCard';
import { Header } from './Header';
import { ModulesCard } from './components/cards/ModulesCard';
import { SourceCodeTreeMapCard } from './components/cards/SourceCodeTreeMapCard';
import { TimelineCard } from './components/cards/TimelineCard';
import { HelpCard } from './components/input/HelpCard';
import { StatisticsCard } from './components/cards/StatisticsCard';
import { useAnalyzerInBackground } from './analyzer/useAnalyzerInBackground';

function MainApp() {
  const [logContent, setLogContent] = useState<string>("");
  const data = useAnalyzerInBackground(logContent);
  const hasError = data?.messages.error !== undefined;

  return (
    <Box>
      <Header />
      <Box sx={{ margin: "20px" }}>
        <HelpCard />
        <InputCard onLogContentChanged={setLogContent} infoText={data?.messages.info} errorText={data?.messages.error} />
        {data && <>
          <StatisticsCard data={data.stats} />
        </>}
        {!hasError && data && (data.mavenPlugins.length > 0) && <>
          <TimelineCard data={data.mavenPlugins} />
          <ModulesCard data={data.mavenPlugins} />
          <MavenPluginsCard data={data.mavenPlugins} />
        </>}
        {!hasError && data && (data.modules.length > 0) && <>
          <SourceCodeTreeMapCard data={data.modules} />
        </>}
      </Box>
    </Box >
  );
}

export default MainApp;
