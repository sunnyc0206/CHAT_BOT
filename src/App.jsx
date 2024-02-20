import React from 'react';
import DynamicForm from './components/DynamicForm'; // Assuming DynamicForm component is in src/components
import FormCreator from './components/FormCreater';
import "./App.css";

const App = () => {
  return (
    <div className='bot_form'>
      <h1>CIGNA-BOT</h1>
      {/* <p>Type "hi" or "hello" to chat</p> */}
      <FormCreator />
    </div>
  );
};

export default App;
