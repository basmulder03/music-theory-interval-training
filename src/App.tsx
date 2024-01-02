import "./App.css";
import { Accidental, BaseNote, NoteList } from "./classes/Note";

function App() {
  const note = NoteList.find((n) => n.stringNotation === "A4")!!;

  let stopContext: () => void;
  let stoppable: boolean = false;

  const toggleNote = () => {
    if (stoppable) {
      stopContext();
    } else {
      stoppable = true;
      stopContext = note.playNote(5000);
    }
  };

  return (
    <div className="App">
      <button>Toggle Note</button>
    </div>
  );
}

export default App;
