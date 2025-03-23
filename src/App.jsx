import { React } from "react";
import { BrowserRouter} from "react-router-dom";
import {  useSelector } from "react-redux";
import Layout from "./Layout";

function App() {
  const theme = useSelector((state) => state.theme.currentTheme);
  return (
    <BrowserRouter>
      <div className={`${theme} font-[Inter]`}>
        <Layout />
      </div>
    </BrowserRouter>
  );
}

export default App;
