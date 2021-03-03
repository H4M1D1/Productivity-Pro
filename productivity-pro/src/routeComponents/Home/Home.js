//imports needed for Home Component
import React, { useContext, useEffect, useState } from "react";
import { auth, db } from "../../services/firebase";
import { AuthContext } from "../../Auth";
import { TodosContext } from "../../TodosContext";
import EventCalendar from "../../components/EventCalendar";
import TodoSection from "../../components/TodoSection/TodoSection";

// Home page  (Only visible when user is signed in and authenticated)

const Home = () => {
  //state and context needed for form and db functions
  const { currentUser } = useContext(AuthContext);
  const [todos, setTodos] = useState([]);

  //fetching users current todos from database
  const fetchTodos = () => {
    db.collection("users")
      .doc(currentUser.uid)
      .get()
      .then((doc) => {
        setTodos(doc.data().todos);
      });
  };

  useEffect(() => {
    fetchTodos();
    //eslint-disable-next-line
  }, []);

  return (
    <div id="homepage">
      <h1>Home</h1>
      <button
        onClick={() => {
          auth.signOut();
        }}
      >
        Log Out
      </button>

      {/* Providing context to component*/}
      <TodosContext.Provider value={{ todos, setTodos }}>
        <TodoSection />
        <EventCalendar />
      </TodosContext.Provider>
    </div>
  );
};

export default Home;
