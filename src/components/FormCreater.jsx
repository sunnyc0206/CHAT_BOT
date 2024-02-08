import React, { useState, useRef } from 'react';
import compromise from 'compromise';
import suggestions from './suggestions'; // Importing suggestions from the suggestions.js file
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

  const handleSpeechRecognition = () => {
    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.start();

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setCommand(transcript);
      inputRef.current.focus();
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
    };

    recognition.onend = () => {
      recognition.stop();
    };
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const userMessage = command.trim();
    const userMessageObj = { user: true, message: userMessage }; // Create user message object
    setChatMessages(prevMessages => [...prevMessages, userMessageObj]); // Add user message to chatMessages
    const parsedInput = compromise(userMessage);
    const intent = determineIntent(parsedInput);
    if (intent === 'createForm') {
      const fields = extractFields(parsedInput);
      setFormFields(fields);
      setFormCreated(true);
      setChatMessages(prevMessages => [...prevMessages, { user: false, message: suggestions.createForm }]);
    } else if (intent === 'addField') { // Check for 'addField' intent
      const newField = extractNewField(parsedInput);
      setFormFields(prevFields => [...prevFields, newField]); // Add new field
      setChatMessages(prevMessages => [...prevMessages, { user: false, message: `Field "${newField}" added successfully.` }]);
    } else if (intent === 'greeting') {
      setChatMessages(prevMessages => [...prevMessages, { user: false, message: suggestions.greeting }]);
    } else {
      setChatMessages(prevMessages => [...prevMessages, { user: false, message: suggestions.unknown }]);
    }
    setCommand('');
  };
  
  const determineIntent = (parsedInput) => {
    if (parsedInput.match('(create|make|generate) form with').found || parsedInput.match('(create|make|generate) a form with').found) {
      return 'createForm';
    } else if (parsedInput.match('(add) field').found) { // Check for 'addField' intent
      return 'addField';
    } else if (parsedInput.match('(hi|hello)').found) {
      return 'greeting';
    }
    return 'unknown';
  };
  
  const extractNewField = (parsedInput) => {
    const inputText = parsedInput.text();
    const fieldIndex = inputText.indexOf('field');
    if (fieldIndex !== -1) {
      const fieldsString = inputText.substring(fieldIndex + 5).trim(); // Add 5 to exclude 'field' and any leading space
      // Split the string by spaces and commas
      const fields = fieldsString.split(/[\s,]+/).map(field => field.trim());
      // Filter out any empty strings
      return fields.filter(field => field !== '');
    }
    return [];
  };
  
  
  
  
  const extractFields = (parsedInput) => {
    const inputText = parsedInput.text();
    const withIndex = inputText.indexOf('with');
    if (withIndex !== -1) {
      const fieldsString = inputText.substring(withIndex + 4).trim(); // Add 4 to exclude 'with'
      // Split the string by both commas and spaces
      const fields = fieldsString.split(/[,\s]+/).map(field => field.trim());
      // Filter out empty strings
      return fields.filter(field => field !== '');
    }
    return [];
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
        <button type="button" onClick={handleSpeechRecognition} className="mic-button">
          <img src="src/assets/mic.png" alt="microphone" />
        </button>
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