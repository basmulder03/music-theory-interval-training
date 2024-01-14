import "./App.css";
import { Note, getNoteFromSemitones } from "./classes/Note";

function App() {
  console.log(getNoteFromSemitones(Note.fromString("B4b"), -12));

  return <div className="App"></div>;
}

export default App;
