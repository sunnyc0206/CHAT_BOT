import React, { useEffect, useState } from "react";
import {
  ref,
  child,
  get,
  set,
  update,
  getDatabase,
  push,
} from "firebase/database";
import db from "./Firebase/firebase";
import { collection, getDocs, addDoc } from "firebase/firestore";

import firebaseApp from "./Firebase/firebase";
import ConfirmationModal from "./ConfirmationModal.jsx";

const DynamicForm = ({ formFields, formName, updateFormFields }) => {
  const [isConfirmationModalOpen, setConfirmationModalOpen] = useState(false);
  const [fields, setFields] = useState(formFields);
  const [Name, setName] = useState(formName);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    setFields(formFields);
    setName(formName);
  }, [formFields, formName]);

  useEffect(() => {
    updateFormFields(fields);
  }, [fields, updateFormFields]);

  const addField = () => {
    const newField = prompt(
      'Enter the name and type of the new field (e.g., "fieldName [as type]"):'
    );
    if (newField) {
      const [name, type] = newField.split(" as ");
      setFields([
        ...fields,
        { name: name.trim(), type: type ? type.trim() : "text" },
      ]);
    }
  };

  const handleOpenModal = () => {
    if (!Name || typeof Name !== "string" || Name.trim() === "") {
      const name = prompt("Enter form name");
      setName(name);
      //console.error('Invalid form name');
      return;
    }
    setConfirmationModalOpen(true);
  };

  const handleCloseModal = () => {
    setConfirmationModalOpen(false);
  };

  const handleConfirmSubmit = (e) => {
    e.preventDefault();
    handleCloseModal();
    handleSubmit(e);
  };

  const removeField = (index) => {
    const newFields = [...fields];
    newFields.splice(index, 1);
    setFields(newFields);
  };

  
  //
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = {
        formIDname: Name,
        ...fields.reduce((result, field) => {
          if (field.type === "text") {
            result[field.name] = "string";
          } else if (field.type === "dropdown") {
            result[field.name] = {
              type: "dropdown",
              options: field.options || [],
            };
          } else if (field.type === "radiobutton") {
            result[field.name] = {
              type: "radiobutton",
              options: field.options || [],
            };
          } else {
            result[field.name] = field.type;
          }
          return result;
        }, {}),
      };

      try {
        const formsSnapshot1 = await addDoc(collection(db, "form"), formData);
        const formId = formsSnapshot1._key.path.segments[1];

        const formDataSubmission = fields.reduce((result, field) => {
          if (field.type === "radiobutton") {
            
            const selectedRadiobutton = document.querySelector(
              `input[name="${field.name}"]:checked`
            );
            if (selectedRadiobutton) {
              result[field.name] = selectedRadiobutton.value;
            }
          } else if(field.type === "dropdown"){
            const selectedDropdownOption = document.querySelector(
              `select[name="${field.name}"] option:checked`
            );
            console.log(selectedDropdownOption);
            if (selectedDropdownOption && selectedDropdownOption.value !== "") {
              //console.log("saved");
              result[field.name] = selectedDropdownOption.value;
            }
          }else {
            const fieldValue = document.getElementById(field.name)?.value;
            if (fieldValue) {
              result[field.name] = fieldValue;
            }
          }
          if(result){
            //console.log(result);
            return result;
          }
          return null;

          
        }, {});

        // const formSubmissionsRef = collection(
        //   db,
        //   "data",
        //   formId,
        //   "submissions"
        // );
        if(Object.keys(formDataSubmission).length>0){
          console.log(formDataSubmission);
          const formSubmissionsRef = collection(
            db,
            "data",
            formId,
            "submissions"
          );
          await addDoc(formSubmissionsRef, formDataSubmission);
        }
        
      } catch (error) {
        console.error("Error storing form data:", error);
      }
    } catch (error) {
      console.error("Error storing form structure:", error);
    }
  };

  const handleAddOption = (fieldIndex) => {
    const newFields = [...fields];
    const selectedField = newFields[fieldIndex];
    const newField = prompt("Enter the new option");
    if (newField) {
      selectedField.options = selectedField.options
        ? [...selectedField.options, newField]
        : [newField];
      setFields(newFields);
    }
  };



const handleRemoveOption = (fieldIndex) => {
  const newFields = [...fields];
  const selectedField = newFields[fieldIndex];

  if (selectedField.type === "dropdown") {
    const selectedOption = document.querySelector(
      `select[name="${selectedField.name}"] option:checked`
    );
    if (selectedOption) {
      const optionToRemove = selectedOption.value;
      if(optionToRemove !== ""){
        selectedField.options = selectedField.options.filter(
          (option) => option !== optionToRemove
        );
      }
      setFields(newFields);
    }
  } else if (selectedField.type === "radiobutton") {
    const selectedRadiobutton = document.querySelector(
      `input[name="${selectedField.name}"]:checked`
    );
    if (selectedRadiobutton) {
      const optionToRemove = selectedRadiobutton.value;
      if(optionToRemove !== ""){
        selectedField.options = selectedField.options.filter(
          (option) => option !== optionToRemove
        );
      }
      
      setFields(newFields);
    }
  }
};

  return (
    <>
      <div className="dynamic-form-container">
        <div className="form-preview">
          <div className="top">
            <button onClick={addField}>ADD</button>
            <h2>{Name ? Name : "Dynamic Form"}</h2>
          </div>
          {fields.length === 0 ? (
            <h3 style={{ textAlign: "center" }}>
              No fields to display, Use ChatBot to create a form
            </h3>
          ) : (
            <form onSubmit={handleSubmit}>
              {fields.map((field, index) => (
                <div key={index}>
                  {field.type === "int" ? (
                    <>
                      <label htmlFor={field.name}>{field.name}</label>
                      <input
                        type="number"
                        id={field.name}
                        name={field.name}
                        className="Input_field"
                      />
                    </>
                  ) : field.type === "date" ? (
                    <>
                      <label htmlFor={field.name}>{field.name}</label>
                      <input
                        type="date"
                        id={field.name}
                        name={field.name}
                        className="Input_field"
                      />
                    </>
                  ) : field.type === "dropdown" ? (
                    <>
                      <div  style={{display: "flex",  alignItems: 'center', justifyContent: 'space-between'}}>
                        <label htmlFor={field.name}>{field.name}</label>

                        <button
                          type="button"
                          onClick={() => handleAddOption(index)}
                        >
                          Add Option
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemoveOption(index)}
                        >
                          Remove Option
                        </button>
                      </div>
                      <select id={field.name} name={field.name}>
                        {field.options.map((option, optionIndex) => (
                          <option key={optionIndex} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </>
                  ) : field.type === "radiobutton" ? (
                    <>
                      <div style={{display: "flex",  alignItems: 'center', justifyContent: 'space-between'}}>
                        <label htmlFor={field.name}>{field.name}</label>

                        <button
                          type="button"
                          onClick={() => handleAddOption(index)}
                        >
                          Add Option
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemoveOption(index)}
                        >
                          Remove Option
                        </button>
                      </div>
                      <div className="opt_parent">
                        <div className="opt">
                          {field.options.map((option, optionIndex) => (
                            <div key={optionIndex} className="radio_options">
                              <input
                                type="radio"
                                id={`${field.name}-${optionIndex}`}
                                name={field.name}
                                value={option}
                              />
                              <label htmlFor={`${field.name}-${optionIndex}`}>
                                {option}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <label htmlFor={field.name}>{field.name}</label>
                      <input
                        type="text"
                        id={field.name}
                        name={field.name}
                        className="Input_field"
                      />
                    </>
                  )}
                  <button type="button" onClick={() => removeField(index)}>
                    X
                  </button>
                </div>
              ))}

              <button
                type="button"
                className="submit-button"
                onClick={handleOpenModal}
              >
                Submit
              </button>
            </form>
          )}

          {/* <button onClick={addField} className="add-field-button">Add Field</button> */}
        </div>
      </div>
      <ConfirmationModal
        isOpen={isConfirmationModalOpen}
        onCancel={handleCloseModal}
        onConfirm={handleConfirmSubmit}
      />
    </>
  );
};

export default DynamicForm;
