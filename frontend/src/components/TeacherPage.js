import { useState } from "react";
const TeacherPage = () => {
  const [name,changedname]=useState('mahrez');
  const HandleClick=(name)=>{
    changedname('mahzabin');
  }
  return (
    <div >
      <h1>Welcome to the Teacher Portal</h1>
      <p>{name}</p>
      <button onClick={()=>HandleClick(name)}>click</button>
    </div>
  );
};

export default TeacherPage;
