import "./App.css";
import {
  Accidental,
  BaseNote,
  CompareAccententals,
  Note,
  NoteList,
} from "./classes/Note";
import { groupBy } from "./extensions/groupBy";

function App() {
  // NoteList.sort(
  //   (a: Note, b: Note) =>
  //     b.octave - a.octave ||
  //     a.note.localeCompare(b.note) ||
  //     CompareAccententals(a.accidental, b.accidental)
  // );
  const groupedNotes = groupBy(NoteList, "octave");

  const playNote = (note: Note) => {
    note.playNote(1);
  };

  return (
    <div className="App">
      {Object.values(groupedNotes).map((notes: Note[]) => (
        <div style={{ display: "block" }} key={notes[0].octave}>
          {notes.map((note: Note) => (
            <button key={note.stringNotation} onClick={() => playNote(note)}>
              {note.stringNotation}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
}

export default App;
