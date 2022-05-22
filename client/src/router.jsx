import App from './pages/App';
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import SwitchLevel from './pages/SwitchLevel';

export default function Router() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<App />} />
                <Route path="/level/:level" element={<SwitchLevel />} />
            </Routes>
        </BrowserRouter>
    );
}
