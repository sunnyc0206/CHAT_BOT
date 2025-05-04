import React, { useState, useEffect } from 'react';
import { collectionGroup, getDocs, collection } from 'firebase/firestore';
import db from '../Firebase/firebase';
import SubmissionsModal from './submissionModal';
import './data.css';

const DataRender = () => {
  const [forms, setForms] = useState([]);
  const [selectedForm, setSelectedForm] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);


  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch form data
        const formSnapshot = await getDocs(collection(db, 'form'));

        const formMap = {};
        formSnapshot.forEach(formDoc => {
          const formData = formDoc.data();
          const formId = formDoc.id;
          formMap[formId] = formData.formIDname; // Storing formIDname using form ID as key
        });

        // Fetch submission data
        const submissionSnapshot = await getDocs(collectionGroup(db, 'submissions'));
        const formData = {};

        submissionSnapshot.forEach(doc => {
          const submissionData = doc.data();
          const formId = doc.ref.parent.parent.id;
          const submissionId = doc.id;
          if (!formData[formId]) {
            formData[formId] = {
              id: formId,
              form: formMap[formId], // Include form data
              submissions: []
            };
          }
          formData[formId].submissions.push({
            id: `${formId}_${submissionId}`,
            ...submissionData
          });
        });

        // Sort the submissions by their IDs
        const sortedForms = Object.values(formData).map(form => ({
          ...form,
          submissions: form.submissions.sort((a, b) => a.id.localeCompare(b.id))
        }));

        setForms(sortedForms);
      } catch (error) {
        console.error('Error fetching forms:', error);
      }
    };

    fetchData();
  }, []);


  const handleFormClick = async (formId) => {
    setSelectedForm(formId);

    try {
      const querySnapshot = await getDocs(collection(db, 'data', formId, 'submissions'));
      const submissionsData = querySnapshot.docs.map(doc => ({
        id: `${formId}_${doc.id}`, 
        ...doc.data()
      }));

      setSubmissions(submissionsData);
      setModalOpen(true);
    } catch (error) {
      console.error('Error fetching submissions:', error);
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedForm(null);
    setSubmissions([]);
  };

  return (
    <div className="formlist">
      {forms.map(form => {
        return (
          <div key={form.id} className="form-box" onClick={() => handleFormClick(form.id)}>
            <h2>{form.form}</h2> 
            <p>Number of Submissions: {form.submissions.length}</p>
          </div>
        );
      })}
      <SubmissionsModal isOpen={modalOpen} onClose={handleCloseModal} submissions={submissions} />
    </div>
  );

};

export default DataRender;
