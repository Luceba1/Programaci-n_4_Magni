import { ParticipantesProvider } from './context/ParticipantesContext';
import Home from './Home';

export default function App() {
  return (
    <ParticipantesProvider>
      <Home />
    </ParticipantesProvider>
  );
}