import React from 'react';
import './submissionModal.css';

const SubmissionsModal = ({ isOpen, onClose, submissions }) => {

  const getSortedKeys = () => {
    const keys = submissions.reduce((acc, submission) => {
      Object.keys(submission).forEach(key => {
        if (!acc.includes(key) && key !== 'id' && key !== 'formId') {
          acc.push(key);
        }
      });
      return acc;
    }, []);
    return keys.sort();
  };

  //   return (
  //     isOpen && (
  //       <div className="modal-overlay">
  //         <div className="modal">
  //           <button onClick={onClose} className="close-modal-button">X</button>
  //           <h2>Submissions</h2>
  //           <div className="table-container">
  //             <table className="submission-table">
  //               <thead>
  //                 <tr>
  //                   {getSortedKeys().map(key => (
  //                     <th key={key}>{key}</th>
  //                   ))}
  //                 </tr>
  //               </thead>
  //               <tbody>
  //                 {submissions.map((submission, index) => (
  //                   <tr key={index}>
  //                     {getSortedKeys().map(key => (
  //                       <td key={key}>{submission[key]}</td>
  //                     ))}
  //                   </tr>
  //                 ))}
  //               </tbody>
  //             </table>
  //           </div>
  //         </div>
  //       </div>
  //     )
  //   );
  // };

  // export default SubmissionsModal;
  return (
    isOpen && (
      <div className="modal-overlay">
        <div className="modal">
          <button onClick={onClose} className="close-modal-button">X</button>
          <h2>Submissions</h2>
          <div className="table-container">
            <table className="submission-table">
              <thead>
                <tr>
                  <th>S.No</th> {/* Serial number column */}
                  <th>Sumbmission UID</th> {/* Render 'ID' first */}
                  {getSortedKeys().map(key => (
                    key !== 'id' && key !== 'formId' && <th key={key}>{key}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {submissions.map((submission, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td> {/* Dynamically increasing serial number */}
                    <td>{submission.id.split('_')[1]}</td> {/* Extract submission ID */}
                    {getSortedKeys().map(key => (
                      key !== 'id' && key !== 'formId' && <td key={key}>{submission[key]}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    )
  );
  

};
export default SubmissionsModal;