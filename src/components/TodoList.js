import React, { useState, useEffect } from "react";
import TodoForm from "./TodoForm";
import Todo from "./Todo";

function TodoList() {
  const [todos, setTodos] = useState([]);
  const [updating, setUpdating] = useState(false);

  // Fetch todos when the component mounts
  useEffect(() => {
    fetchTodos();
  }, []);

  // Function to fetch todos from the server
  const fetchTodos = async () => {
    try {
      const response = await fetch("http://localhost:3001/api/todos"); // Updated fetch endpoint
      if (!response.ok) {
        throw new Error("Failed to fetch todos"); // Throw error if response is not OK
      }
      const data = await response.json();
      setTodos(data); // Set todos state with the fetched data
    } catch (error) {
      console.error(error); // Log any errors to the console
    }
  };

  // Function to add a new todo
  const addTodo = async (todo) => {
    try {
      const response = await fetch("http://localhost:3001/api/todos", {
        // Updated fetch endpoint
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(todo),
      });
      if (!response.ok) {
        throw new Error("Failed to add todo"); // Throw error if response is not OK
      }
      const newTodo = await response.json();
      setTodos((prevTodos) => [newTodo, ...prevTodos]); // Update todos state with the new todo
    } catch (error) {
      console.error(error); // Log any errors to the console
    }
  };

  // Function to update an existing todo
  const updateTodo = async (todoId, newValue) => {
    try {
      const response = await fetch(
        `http://localhost:3001/api/todos/${todoId}`,
        {
          // Updated fetch endpoint
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newValue),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to update todo"); // Throw error if response is not OK
      }
      const updatedTodo = await response.json();
      setTodos((prevTodos) =>
        prevTodos.map((todo) =>
          todo.id === updatedTodo.id ? updatedTodo : todo
        )
      ); // Update todos state with the updated todo
    } catch (error) {
      console.error(error); // Log any errors to the console
    }
  };

  // Callback function to handle todo update
  const handleUpdateTodo = (updatedTodo) => {
    // Find the index of the updated todo in the todos array
    const updatedIndex = todos.findIndex((todo) => todo.id === updatedTodo.id);

    // If the updated todo exists in the todos array, update it
    if (updatedIndex !== -1) {
      // Create a copy of the todos array to avoid mutating state directly
      const updatedTodos = [...todos];

      // Update the todo at the found index with the updated todo data
      updatedTodos[updatedIndex] = updatedTodo;

      // Update the todos state with the updated array
      setTodos(updatedTodos);
    }
  };

  // Function to remove a todo
  const removeTodo = async (id) => {
    try {
      const response = await fetch(`http://localhost:3001/api/todos/${id}`, {
        // Updated fetch endpoint
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete todo"); // Throw error if response is not OK
      }
      setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id)); // Filter out the deleted todo from the todos state
    } catch (error) {
      console.error(error); // Log any errors to the console
    }
  };

  // Function to mark a todo as complete
  const completeTodo = async (id) => {
    try {
      const todoToUpdate = todos.find((todo) => todo.id === id);
      if (!updating && todoToUpdate) {
        const updatedTodo = {
          ...todoToUpdate,
          isComplete: !todoToUpdate.isComplete,
        };
        const response = await fetch(`http://localhost:3001/api/todos/${id}`, {
          // Updated fetch endpoint
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedTodo),
        });
        if (!response.ok) {
          throw new Error("Failed to update todo"); // Throw error if response is not OK
        }
        setTodos((prevTodos) =>
          prevTodos.map((todo) => (todo.id === id ? updatedTodo : todo))
        ); // Update todos state with the updated todo
      }
    } catch (error) {
      console.error(error); // Log any errors to the console
    }
  };

  return (
    <div>
      <h1>Let's get organized!</h1>
      {/* TodoForm component to add new todos */}
      <TodoForm onSubmit={addTodo} />
      {/* Todo component to display todos */}
      <Todo
        todos={todos}
        completeTodo={completeTodo}
        removeTodo={removeTodo}
        updateTodo={updateTodo}
        setUpdating={setUpdating}
        handleUpdateTodo={handleUpdateTodo} // Pass callback function as pro
      />
    </div>
  );
}

export default TodoList;
