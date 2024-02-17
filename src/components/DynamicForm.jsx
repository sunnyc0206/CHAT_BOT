import React, { useEffect, useState } from 'react';

const DynamicForm = ({ formFields, closeModal, updateFormFields }) => {
  const [fields, setFields] = useState(formFields);

  useEffect(() => {
    setFields(formFields);
  }, [formFields]);

  useEffect(() => {
    updateFormFields(fields);
  }, [fields, updateFormFields]);

  const addField = () => {
    const newField = prompt('Enter the name and type of the new field (e.g., "fieldName [as type]"):');
    if (newField) {
      const [name, type] = newField.split(' as ');
      setFields([...fields, { name: name.trim(), type: (type ? type.trim() : 'text') }]);
    }
  };
  
  const removeField = (index) => {
    const newFields = [...fields];
    newFields.splice(index, 1);
    setFields(newFields);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <div className="dynamic-form-container">
      <div className="form-preview">
        <div className='top'>
          <button onClick={addField} className="close-modal-button">ADD</button>
          <h2>Dynamic Form</h2>
        </div>
        <form onSubmit={handleSubmit}>
          {fields.map((field, index) => (
            <div key={index}>
              <label htmlFor={field.name}>{field.name}</label>
              {field.type === 'int' ? (
                <input type="number" id={field.name} name={field.name} />
              ) : field.type === 'date' ? (
                <input type="date" id={field.name} name={field.name} />
              ) : (
                <input type="text" id={field.name} name={field.name} />
              )}
              <button type="button" onClick={() => removeField(index)}>X</button>
            </div>
          ))}
          <button type="submit" className="submit-button">Submit</button>
        </form>
        {/* <button onClick={addField} className="add-field-button">Add Field</button> */}
      </div>
    </div>
  );
};

export default DynamicForm;