import App from './pages/App';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Scene1 } from './pages/scenes';

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/level/1" element={<Scene1 />} />
      </Routes>
    </BrowserRouter>
  );
}
