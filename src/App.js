import { HashRouter, Route, Routes, Link } from 'react-router-dom';

import TableLand from './components/TableLand';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route
          path="/test"
          element={
            <TableLand /> } />
        <Route
          path="/dashboard"
          element={
            <Dashboard /> } />
        <Route
          path="/"
          element={
            <Link to="/dashboard">Enter</Link>} />
      </Routes>
    </HashRouter>
  );
}

export default App;
