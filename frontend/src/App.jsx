import { Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import ReportSubmission from "./pages/report_submission";
import View from "./pages/views";
import Details from "./pages/details";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home/>}/>
      <Route path="/report-submission" element={<ReportSubmission/>}/>
      <Route path="/views" element={<View/>}/>
      <Route path="/details/:id" element={<Details/>}/>
    </Routes>
  );
}

export default App;