import { HashRouter, Route, Routes } from 'react-router-dom';

import TableLand from './components/TableLand';

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route
          path="/test"
          element={
            <TableLand /> } />
        <Route
          path="/"
          element={
            <h1>Home</h1>} />
      </Routes>
    </HashRouter>
  );
}

export default App;
