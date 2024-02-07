import React from 'react';
import DynamicForm from './components/DynamicForm'; // Assuming DynamicForm component is in src/components

const App = () => {
  return (
    <div>
      <h1>CIGNA-BOT</h1>
      <p>Type "hi" or "hello" to chat</p>
      <DynamicForm />
    </div>
  );
};

export default App;
