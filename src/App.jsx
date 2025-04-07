import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Helper function to get today's date
const getTodayDate = () => {
  const today = new Date();
  return today.toLocaleDateString(); // Format: MM/DD/YYYY
};

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [message, setMessage] = useState('');
  const [checked, setChecked] = useState(false);

  // Fetch the todo list from the API
  const fetchTasks = async () => {
    try {
      const response = await axios.get('https://abhi2200.pythonanywhere.com/api/todo/');
      setTasks(response.data.tasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  // Add a task
  const addTask = async () => {
    if (message) {
      try {
        await axios.post('https://abhi2200.pythonanywhere.com/api/todo/', {
          message,
        });
        setMessage('');
        fetchTasks();
      } catch (error) {
        console.error('Error adding task:', error);
      }
    }
  };

  // Delete a task
  const deleteTask = async (index) => {
    try {
      await axios.delete('https://abhi2200.pythonanywhere.com/api/todo/', {
        data: { index },
      });
      fetchTasks();
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  // Update a task
  const updateTask = async (index, updatedMessage) => {
    if (updatedMessage) {
      try {
        await axios.patch('https://abhi2200.pythonanywhere.com/api/todo/', {
          index,
          message: updatedMessage,
        });
        fetchTasks();
      } catch (error) {
        console.error('Error updating task:', error);
      }
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="todo-app">
      <header>
        <h1>Todo List for {getTodayDate()}</h1>
        <div>
          <input
            type="checkbox"
            checked={checked}
            onChange={() => setChecked(!checked)}
          />
          <input
            type="text"
            placeholder="Enter a new task"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button onClick={addTask}>Add Task</button>
        </div>
      </header>

      <main>
        <ul>
          {tasks.map((task, index) => (
            <li key={index}>
              <span>{task.message}</span>
              <button onClick={() => deleteTask(index)}>Delete</button>
              <button onClick={() => updateTask(index, prompt('Update task:', task.message))}>Edit</button>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
};

export default App;
