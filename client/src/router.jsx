import App from './pages/App';
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Level1 from './pages/levels/level1/level1';

export default function Router() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<App />} />
                <Route path="/level/1" element={<Level1 />} />
            </Routes>
        </BrowserRouter>
    );
}
