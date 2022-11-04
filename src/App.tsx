import { Box } from '@mui/system';
import { InputCard } from './components/InputCard';
import { Header } from './Header';

function MainApp() {
  return (
    <Box>
      <Header />
      <Box sx={{ margin: "20px" }}>
        <InputCard />
      </Box>
    </Box >
  );
}

export default MainApp;
