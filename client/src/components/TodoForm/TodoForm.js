// imports for TodoForm
import React, { useContext, useState } from "react";
import {
  TodoFormWrapper,
  TodoFormInput,
  TodoButton,
  TodoHeadingWrapper,
  DateSelector,
  TodoButtonWrapper,
  TodoFormHeading,
} from "./TodoFormElements";
import { TodosContext } from "../.././context/TodosContext";
import { AuthContext } from "../.././context/Auth";
import { db } from "../../services/firebase";

const TodoForm = () => {
  // Context and state needed for TodoForm Component
  const { currentUser } = useContext(AuthContext);
  const { todos, setTodos } = useContext(TodosContext);
  const [newTodo, setNewTodo] = useState("");
  const [newDate, setNewDate] = useState(new Date());
  //function for adding a new todo
  const handleNewTodo = async (event) => {
    event.preventDefault();
    console.log(newTodo);
    if (newTodo === "") {
      alert("Please add value for Todo");
      return;
    }
    try {
      let month = newDate.getMonth() + 1;
      let day = newDate.getDate();

      if (month <= 9) {
        month = `0${month}`;
      }
      if (day <= 9) {
        day = `0${day}`;
      }
      let formattedDate = `${newDate.getFullYear()}-${month}-${day}`;

      const todoObject = {
        id: todos.length + 1,
        title: newTodo,
        date: formattedDate,
      };

      setTodos(todos.concat(todoObject));
      try {
        await db
          .collection("users")
          .doc(currentUser.uid)
          .update({
            todos: [...todos, todoObject],
          });
      } catch (err) {
        console.log(err);
        alert("Error, todo was not saved. Please refresh page and try again");
      }
    } catch {
      const todoObject = {
        id: todos.length + 1,
        title: newTodo,
      };

      setTodos(todos.concat(todoObject));

      try {
        await db
          .collection("users")
          .doc(currentUser.uid)
          .update({
            todos: [...todos, todoObject],
          });
      } catch (err) {
        console.log(err);
        alert("Error, todo was not saved. Please refresh page and try again");
      }
    }

    setNewTodo("");
    setNewDate(null);
  };

  //function to handle onChange of Todo
  const handleNewTodoChange = (event) => {
    setNewTodo(event.target.value);
  };

  return (
    //Wrapper for full TodoForm
    <TodoFormWrapper onSubmit={handleNewTodo}>
      <TodoHeadingWrapper>
        <TodoFormHeading>Todo Section</TodoFormHeading>
      </TodoHeadingWrapper>
      {/* Input to add task for todo */}
      <TodoFormInput
        type="text"
        onChange={handleNewTodoChange}
        value={newTodo}
        placeholder="Enter New Todo Here"
      />
      {/* Input to add date for todo */}
      <DateSelector onChange={setNewDate} value={newDate} />
      {/* Button to submit new todo */}
      <TodoButtonWrapper>
        <TodoButton type="submit">Submit Todo</TodoButton>
      </TodoButtonWrapper>
    </TodoFormWrapper>
  );
};

export default TodoForm;
