import React from "react";
import "./App.css";
import BlogForm from "./BlogForm";

// import {
//   createBrowserRouter,
//   Route,
//   Router,
//   RouterProvider,
//   Routes,
// } from "react-router-dom";
// import axios from "axios";

function App() {
  // const postInfo = (postInfo) => {
  //   axios.post('api/regi')
  // };

  // useEffect(() => {
  //   axios
  //     .get("/api/blog/getgetget")
  //     .then((Response) => console.log(Response.data));
  // }, []);

  return (
    <div className="App">
      <BlogForm />
    </div>
    // <Router>
    //     <Route exact path="/">
    //       <BlogForm />
    //     </Route>
    // </Router>
  );
}

export default App;
