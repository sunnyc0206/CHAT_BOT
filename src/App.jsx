import React from 'react';
import DynamicForm from './components/DynamicForm'; // Assuming DynamicForm component is in src/components
import FormCreator from './components/FormCreater';
import DataRender from './components/Data/dataRender';
import "./App.css";
import FormList from './components/FormList';
import Sidebar from './components/Sidebar';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

const App = () => {
  return (
    <div className="main_app">
    <Router>
      <div className="app">
        <Sidebar />
        <div className="content">
          <Routes>
            <Route path="/" element={<FormCreator />} />
            <Route path="/form-list" element={<FormList />} />
            <Route path="/data-list" element={<DataRender />} />
          </Routes>
        </div>
      </div>
    </Router>
    </div>
  );
};

export default App;
