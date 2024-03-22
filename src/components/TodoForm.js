import React, { useState, useRef, useEffect } from "react";

function TodoForm({ edit, onSubmit }) {
  const [input, setInput] = useState("");
  const [category, setCategory] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    if (edit) {
      setInput(edit.text);
      setCategory(edit.category);
      inputRef.current.focus();
    }
  }, [edit]);

  const handleChange = (e) => {
    setInput(e.target.value);
  };

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input) return;

    onSubmit({ text: input, category });
    setInput("");
    setCategory("");
  };

  return (
    <form className="todo-form" onSubmit={handleSubmit}>
      {!edit && (
        <>
          <input
            placeholder="Add a task"
            value={input}
            onChange={handleChange}
            name="text"
            className="todo-input"
            ref={inputRef}
          />
          <input
            placeholder="Complete by"
            value={category}
            onChange={handleCategoryChange}
            name="category"
            className="todo-input"
          />
        </>
      )}
      {edit && (
        <input
          placeholder="Update your item"
          value={input}
          onChange={handleChange}
          name="text"
          className="todo-input"
          ref={inputRef}
        />
      )}
      <button type="submit" className="todo-button">
        {edit ? "Update" : "Add Todo"}
      </button>
    </form>
  );
}

export default TodoForm;
