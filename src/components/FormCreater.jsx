// FormCreator.js
import React, { useState, useRef } from 'react';
import compromise from 'compromise';
import suggestions from './suggestions';
import './form.css';
import DynamicForm from './DynamicForm';

const FormCreator = () => {
  const [chatMessages, setChatMessages] = useState([]);
  const [formFields, setFormFields] = useState([]);
  const [formCreated, setFormCreated] = useState(false);
  const [command, setCommand] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const inputRef = useRef(null);

  const handleInputChange = (e) => {
    setCommand(e.target.value);
  };


  const handleSubmit = (e) => {
    e.preventDefault();
    const userMessage = command.trim();
    const userMessageObj = { user: true, message: userMessage };
    setChatMessages((prevMessages) => [...prevMessages, userMessageObj]);

    const parsedInput = compromise(userMessage);
    const intent = determineIntent(parsedInput);

    if (intent === 'createForm') {
      const fields = extractFields(parsedInput);
      setFormFields(fields);
      setFormCreated(true);
      setChatMessages((prevMessages) => [
        ...prevMessages,
        { user: false, message: suggestions.createForm },
      ]);
    } else if (intent === 'addField') {
      const newField = extractNewField(parsedInput);
      setFormFields((prevFields) => [...prevFields, newField]);
      setChatMessages((prevMessages) => [
        ...prevMessages,
        { user: false, message: `Field added successfully.` },
      ]);
    } else if (intent === 'greeting') {
      setChatMessages((prevMessages) => [
        ...prevMessages,
        { user: false, message: suggestions.greeting },
      ]);
    } else {
      setChatMessages((prevMessages) => [
        ...prevMessages,
        { user: false, message: suggestions.unknown },
      ]);
    }
    setCommand('');
  };
  
  const determineIntent = (parsedInput) => {
    if (parsedInput.match('(create|make|generate) form with').found || parsedInput.match('(create|make|generate) a form with').found) {
      return 'createForm';
    } else if (parsedInput.match('(add) field').found) {
      return 'addField';
    } else if (parsedInput.match('(hi|hello)').found) {
      return 'greeting';
    }
    return 'unknown';
  };

  const extractFields = (parsedInput) => {
  const inputText = parsedInput.text();
  const withIndex = inputText.indexOf('with');
  if (withIndex !== -1) {
    const fieldsString = inputText.substring(withIndex + 4).trim();
    const fields = fieldsString.split(',');
    const parsedFields = fields.map(field => {
      const trimmedField = field.trim();
      const nameAndType = trimmedField.split(' as ');
      const name = nameAndType[0].trim();
      const type = nameAndType[1] ? nameAndType[1].trim() : 'text';
      return { name, type };
    });
    return parsedFields.filter(field => field.name !== '');
  }
  return [];
};

  
const extractNewField = (parsedInput) => {
  const inputText = parsedInput.text();
  const addIndex = inputText.indexOf('add field');
  if (addIndex !== -1) {
    const fieldsString = inputText.substring(addIndex + 9).trim();
    const fields = fieldsString.split('as').map(field => field.trim());
    const name = fields[0];
    const type = fields[1] ? fields[1] : 'text';
    return { name, type };
  }
  return null;
};

  
  
  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="form-creator-container">
      <div className="chat-area">
        {chatMessages.map((message, index) => (
          <div key={index} className={`message ${message.user ? 'user' : 'bot'}`}>
            <p>{message.message}</p>
          </div>
        ))}
      </div>
      <form className='botform' onSubmit={handleSubmit}>
        <input
          type="text"
          value={command}
          onChange={handleInputChange}
          placeholder="Type 'create form with field1, field2, etc.'"
          className="input-field"
          ref={inputRef}
        />
{/*         <button type="button" onClick={handleSpeechRecognition} className="mic-button">
          <img src="src/assets/mic.png" alt="microphone" />
        </button> */}
        <button type="submit" className="send-button">Send</button>
      </form>
      {formCreated && (
        <div>
          <button onClick={openModal} className="open-modal-button">Open Form</button>
          {isModalOpen && <DynamicForm formFields={formFields} closeModal={closeModal} />}
        </div>
      )}
    </div>
  );
};

export default FormCreator;
