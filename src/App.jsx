import { Routes, Route } from "react-router-dom";
import Home from "./routes/Home";
import Match from "./routes/Match";
import PointEntry from "./routes/PointEntry";
import Summary from "./routes/Summary";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/match" element={<Match />} />
      <Route path="/point" element={<PointEntry />} />
      <Route path="/summary" element={<Summary />} />
    </Routes>
  );
}

export default App
