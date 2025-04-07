import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Helper function to get today's date
const getTodayDate = () => {
  const today = new Date();
  return today.toLocaleDateString(); // Format: MM/DD/YYYY
};

// Helper function to get CSRF token from cookies
const getCsrfToken = () => {
  const csrfToken = document.cookie
    .split('; ')
    .find(row => row.startsWith('csrftoken='))
    ?.split('=')[1];
  return csrfToken;
};

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [message, setMessage] = useState('');
  const [checked, setChecked] = useState(false);

  const axiosInstance = axios.create({
    headers: {
      'X-CSRFToken': getCsrfToken(),
    },
    withCredentials: true,  // Ensure cookies are sent with requests
  });

  // Fetch the todo list from the API
  const fetchTasks = async () => {
    try {
      const response = await axiosInstance.get('https://abhi2200.pythonanywhere.com/api/todo/');
      setTasks(response.data.tasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      alert('Failed to fetch tasks. Please try again.');
    }
  };

  // Add a task
  const addTask = async () => {
    if (message) {
      try {
        await axiosInstance.post('https://abhi2200.pythonanywhere.com/api/todo/', {
          message,
        });
        setMessage('');
        fetchTasks();
      } catch (error) {
        console.error('Error adding task:', error);
        alert('Failed to add task. Please try again.');
      }
    }
  };

  // Delete a task
  const deleteTask = async (taskId) => {
    try {
      await axiosInstance.delete('https://abhi2200.pythonanywhere.com/api/todo/', {
        data: { id: taskId },
      });
      fetchTasks();
    } catch (error) {
      console.error('Error deleting task:', error);
      alert('Failed to delete task. Please try again.');
    }
  };

  // Update a task
  const updateTask = async (taskId, updatedMessage) => {
    if (updatedMessage) {
      try {
        await axiosInstance.patch('https://abhi2200.pythonanywhere.com/api/todo/', {
          id: taskId,
          message: updatedMessage,
        });
        fetchTasks();
      } catch (error) {
        console.error('Error updating task:', error);
        alert('Failed to update task. Please try again.');
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
              <button onClick={() => deleteTask(task.id)}>Delete</button>
              <button onClick={() => updateTask(task.id, prompt('Update task:', task.message))}>Edit</button>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
};

export default App;
