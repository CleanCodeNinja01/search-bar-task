import React from "react";
// import "./App.css";
import Searchbar from "./components/Searchbar";
import "./index.css"; // ✅ This imports Tailwind styles

function App() {
  return (
    <>
      {/* <div className="bg-blue-500 text-white p-4 rounded-lg">
        Tailwind is working aa!
      </div> */}
      <Searchbar />
    </>
  );
}

export default App;
