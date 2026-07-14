import React from 'react';
import Form from 'react-bootstrap/Form';

function CheckExample({ Todo }) {
  return (
    <Form>
      {['checkbox'].map((type) => (
        <div key={`default-${Todo.sno}`} className="mb-3">
          <Form.Check type={type} id={`CHK-${Todo.sno}`} label={`${Todo.title} : ${Todo.desc}`} />
          
        </div>
      ))}
    </Form>
  );
}

export default CheckExample;
