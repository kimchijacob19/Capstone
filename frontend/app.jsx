import { Routes, Route } from "react-router-dom";
import Drilldown from "./Drilldown";
import SpotDetails from "./SpotDetails";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Drilldown />} />
      <Route path="/spots/:id" elemnet={<SpotDetails />} />
    </Routes>
  );
}

export default App;
