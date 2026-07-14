import React, { useState, useEffect } from 'react';
import TodosItem from './TodosItems';

export const Todos = ({ todos }) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000); // updates every second

    return () => clearInterval(timer); // cleanup
  }, []);

  return (
    <div className="container">
      <label>
        <strong>Current Time:</strong> {time.toLocaleString()}
      </label>

      {todos.map((todo) => (
        <TodosItem key={todo.sno} todo={todo} />
      ))}
    </div>
  );
};