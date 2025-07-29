import React, { useState } from "react";
import StudentViewRequests from "./StudentViewRequests";
import StudentCreateRequest from "./StudentCreateRequests";

const StudentRequests = () => {
  const [showCreate, setShowCreate] = useState(false);

  return (
    <div>
      <h2>Requests</h2>
      {!showCreate && (
        <>
          <button onClick={() => setShowCreate(true)}>
            Send New Request
          </button>
          <StudentViewRequests />
        </>
      )}
      {showCreate && (
        <>
          <button onClick={() => setShowCreate(false)}>
            Back to Requests
          </button>
          <StudentCreateRequest onSuccess={() => setShowCreate(false)} />
        </>
      )}
    </div>
  );
};

export default StudentRequests;