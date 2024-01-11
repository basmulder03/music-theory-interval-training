import "./App.css";
import { Accidental, BaseNote, NoteList } from "./classes/Note";

function App() {
  const note = NoteList.find((n) => n.stringNotation === "A4")!!;

  let stopContext: () => void;
  let stoppable: boolean = false;

  const playNote = () => {
    note.playNote(1);
  };

  return (
    <div className="App">
      <button onClick={playNote}>Toggle Note</button>
    </div>
  );
}

export default App;
