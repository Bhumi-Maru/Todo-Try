import React, { useState, useEffect } from "react";
import axios from "axios";

function TodoDB() {
  const [todos, setTodos] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:3000/users")
      .then((response) => setTodos(response.data))
      .catch((error) => console.error("Error fetching todos:", error));
  }, []);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const addTodo = () => {
    if (inputValue.trim() === "") {
      return;
    }

    const newTodo = {
      title: inputValue,
      completed: false,
    };

    if (editId) {
      axios
        .put(`http://localhost:3000/users/${editId}`, {
          title: inputValue,
          completed: false,
        })
        .then((response) => {
          setTodos(
            todos.map((todo) => (todo.id === editId ? response.data : todo))
          );
          setInputValue("");
          setEditId(null);
        })
        .catch((error) => console.error("Error updating todo:", error));
    } else {
      axios
        .post("http://localhost:3000/users", newTodo)
        .then((response) => {
          setTodos([...todos, response.data]);
          setInputValue("");
        })
        .catch((error) => console.error("Error adding todo:", error));
    }
  };

  const deleteTodo = (id) => {
    axios
      .delete(`http://localhost:3000/users/${id}`)
      .then(() => {
        setTodos(todos.filter((todo) => todo.id !== id));
      })
      .catch((error) => console.error("Error deleting todo:", error));
  };

  const editTodo = (todo) => {
    setInputValue(todo.title);
    setEditId(todo.id);
  };

  return (
    <div>
      <h1>Todo List</h1>

      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        placeholder="Enter a new todo"
      />
      <button onClick={addTodo}>{editId ? "Update Todo" : "Add Todo"}</button>

      <table border="1" cellPadding="10" style={{ marginTop: "20px" }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {todos.map((todo) => (
            <tr key={todo.id}>
              <td>{todo.id}</td>
              <td>{todo.title}</td>
              <td>
                <button onClick={() => editTodo(todo)}>Edit</button>
                <button onClick={() => deleteTodo(todo.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TodoDB;
