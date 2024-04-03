import React, { useState } from "react";
import TodoForm from "./TodoForm";
import { RiCloseCircleLine } from "react-icons/ri";
import { TiEdit } from "react-icons/ti";

function Todo({
  todos,
  completeTodo,
  removeTodo,
  updateTodo,
  setUpdating,
  handleUpdateTodo,
}) {
  const [edit, setEdit] = useState(null);

  const handleEditClick = (id) => {
    setUpdating(true);
    setEdit(id);
  };

  // const handleCancelEdit = () => {
  //   setEdit(null);
  //   setUpdating(false)
  // };

  // const submitUpdate = (updatedTodo) => {
  //   updateTodo(updatedTodo.id, updatedTodo);
  //   // handleCancelEdit();
  //   setEdit(null);
  //   setUpdating(false);
  // };

  const submitUpdate = async (updatedTodo) => {
    await updateTodo(updatedTodo.id, updatedTodo);
    setEdit(null); // Reset edit state after update
    setUpdating(false);
    handleUpdateTodo(updatedTodo); // Call callback function with updated todo data
  };

  const groupByCategory = todos.reduce((acc, todo) => {
    if (!acc[todo.category]) {
      acc[todo.category] = [];
    }
    acc[todo.category].push(todo);
    return acc;
  }, {});

  const renderTodosByCategory = () => {
    return Object.entries(groupByCategory).map(([category, todos]) => (
      <div key={category}>
        <h2 className="category-heading">{category}</h2>
        {todos.map((todo) => (
          <div
            className={todo.isComplete ? "todo-row complete" : "todo-row"}
            key={todo.id}
            onClick={() => completeTodo(todo.id)}
          >
            {edit === todo.id ? (
              <TodoForm
                edit={todo}
                onSubmit={submitUpdate}
                // onCancel={handleCancelEdit}
              />
            ) : (
              <>
                {todo.text}
                <div className="icons">
                  <RiCloseCircleLine
                    onClick={(e) => {
                      e.stopPropagation();
                      removeTodo(todo.id);
                    }}
                    className="delete-icon"
                  />
                  <TiEdit
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditClick(todo.id);
                    }}
                    className="edit-icon"
                  />
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    ));
  };

  return <>{renderTodosByCategory()}</>;
}

export default Todo;
