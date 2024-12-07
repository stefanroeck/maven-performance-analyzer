import { Box } from "@mui/material";
import { useContext } from "react";
import { MavenPluginsCard } from "./components/cards/MavenPluginsCard";
import { InputCard } from "./components/input/InputCard";
import { Header } from "./Header";
import { ModulesCard } from "./components/cards/ModulesCard";
import { SourceCodeTreeMapCard } from "./components/cards/SourceCodeTreeMapCard";
import { TimelineCard } from "./components/cards/TimelineCard";
import { HelpCard } from "./components/input/HelpCard";
import { StatisticsCard } from "./components/cards/StatisticsCard";
import { AnalyzerContext } from "./analyzer/analyzerContext";

const MainPage = () => {
  const { analyzerResult } = useContext(AnalyzerContext);
  const hasError = analyzerResult?.messages.error !== undefined;
  const mavenPluginsStats = analyzerResult?.mavenPlugins;
  const modulesStats = analyzerResult?.modules;

  return (
    <Box>
      <Header />
      <Box sx={{ margin: "20px" }}>
        <HelpCard />
        <InputCard />
        {analyzerResult?.stats && analyzerResult?.tests && (
          <>
            <StatisticsCard
              generalStats={analyzerResult.stats}
              testStats={analyzerResult.tests}
            />
          </>
        )}
        {!hasError && mavenPluginsStats && mavenPluginsStats.length > 0 && (
          <>
            <TimelineCard data={mavenPluginsStats} />
            <ModulesCard data={mavenPluginsStats} />
            <MavenPluginsCard data={mavenPluginsStats} />
          </>
        )}
        {!hasError && modulesStats && modulesStats.length > 0 && (
          <>
            <SourceCodeTreeMapCard data={analyzerResult.modules} />
          </>
        )}
      </Box>
    </Box>
  );
};

export default MainPage;
