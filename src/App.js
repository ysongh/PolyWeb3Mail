import React, { useState } from 'react';
import { HashRouter, Route, Routes, Link } from 'react-router-dom';

import TableLand from './components/TableLand';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';

function App() {
  const [tablelandMethods, setTablelandMethods] = useState("");
  const [tableName, setTableName] = useState("");

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
            <Dashboard
              tableName={tableName}
              tablelandMethods={tablelandMethods} /> } />
        <Route
          path="/"
          element={
            <Home
              setTablelandMethods={setTablelandMethods}
              setTableName={setTableName} /> } />
      </Routes>
    </HashRouter>
  );
}

export default App;
