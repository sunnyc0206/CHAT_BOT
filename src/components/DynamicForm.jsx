// DynamicForm.js

import React, { useState } from 'react';

const DynamicForm = ({ formFields, closeModal }) => {
  const [fields, setFields] = useState(formFields);

  const addField = () => {
    const newFieldName = prompt('Enter the name of the new field:');
    if (newFieldName) {
      setFields([...fields, newFieldName]);
    }
  };

  const removeField = (index) => {
    const newFields = [...fields];
    newFields.splice(index, 1);
    setFields(newFields);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="form-preview">
            <div className='top'>
          <button onClick={closeModal} className="close-modal-button">X</button>
          <h2>Dynamic Form</h2>
          </div>
          <form onSubmit={handleSubmit}>
            {fields.map((fieldName, index) => (
              <div key={index}>
                <label htmlFor={fieldName}>{fieldName}</label>
                <input type="text" id={fieldName} name={fieldName} />
                <button type="button" onClick={() => removeField(index)}>X</button>
              </div>
            ))}
            <button type="submit" className="submit-button">Submit</button>
          </form>
          <button onClick={addField} className="add-field-button">Add Field</button>
        </div>
      </div>
    </div>
  );
};

export default DynamicForm;
