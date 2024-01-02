export enum Accidental {
  Natural = "♮",
  Flat = "♭",
  Sharp = "♯",
}

export enum BaseNote {
  A = "A",
  B = "B",
  C = "C",
  D = "D",
  E = "E",
  F = "F",
  G = "G",
}

const NoteNumMapUp = {
  [BaseNote.A]: 0,
  [BaseNote.B]: 2,
  [BaseNote.C]: 3,
  [BaseNote.D]: 5,
  [BaseNote.E]: 7,
  [BaseNote.F]: 8,
  [BaseNote.G]: 10,
};

const AccidentalMapDown = {
  [Accidental.Natural]: 0,
  [Accidental.Flat]: -1,
  [Accidental.Sharp]: 1,
};

const NoteNumMapDown = {
  [BaseNote.A]: -0,
  [BaseNote.B]: -10,
  [BaseNote.C]: -9,
  [BaseNote.D]: -7,
  [BaseNote.E]: -5,
  [BaseNote.F]: -4,
  [BaseNote.G]: -2,
};

const AccidentalMapUp = {
  [Accidental.Natural]: 0,
  [Accidental.Flat]: 1,
  [Accidental.Sharp]: -1,
};

export class Note {
  pitch: number = -1;
  note: BaseNote;
  accidental: Accidental;
  octave: number;
  private alternativeNotation: AlternativeNoteNotation;

  static readonly basePitch: number = 440;
  static readonly baseNote: BaseNote = BaseNote.A;
  static readonly baseOctave: number = 4;

  constructor(note: BaseNote, accidental: Accidental, octave: number) {
    this.note = note;
    this.accidental = accidental;
    this.octave = octave;
    this.alternativeNotation = new AlternativeNoteNotation(
      note,
      accidental,
      octave
    );
    this.calculatePitch();
  }

  private calculateSemiTones(): number {
    const octaveSemiTones = 12;

    if (this.octave <= Note.baseOctave) {
      let currNoteDiff = NoteNumMapDown[this.note];
      return (
        (this.octave - Note.baseOctave) * octaveSemiTones +
        currNoteDiff +
        AccidentalMapDown[this.accidental]
      );
    } else {
      let currNoteDiff = NoteNumMapUp[this.note];
      return (
        (this.octave - Note.baseOctave) * octaveSemiTones +
        currNoteDiff +
        AccidentalMapUp[this.accidental]
      );
    }
  }

  private generateSinWave(time: number): number {
    const { sin, exp, pow, PI } = Math;

    // Base sin wave
    let Y =
      (sin(2 * PI * this.pitch * time) *
        exp(-0.0004 * 2 * PI * this.pitch * time)) /
      2;

    // overtones
    Y +=
      (sin(2 * 2 * PI * this.pitch * time) *
        exp(-0.0004 * 2 * PI * this.pitch * time)) /
      2;
    Y +=
      (sin(3 * 2 * PI * this.pitch * time) *
        exp(-0.0004 * 2 * PI * this.pitch * time)) /
      4;
    Y +=
      (sin(4 * 2 * PI * this.pitch * time) *
        exp(-0.0004 * 2 * PI * this.pitch * time)) /
      8;
    Y +=
      (sin(5 * 2 * PI * this.pitch * time) *
        exp(-0.0004 * 2 * PI * this.pitch * time)) /
      16;
    Y +=
      (sin(6 * 2 * PI * this.pitch * time) *
        exp(-0.0004 * 2 * PI * this.pitch * time)) /
      32;

    // Saturate sound
    Y += pow(Y, 3);

    // I don't know what this does.
    Y *= 1 + 16 * time * exp(-6 * time);

    return Y;
  }

  playNote(totalDuration: number): () => void {
    const context = new AudioContext();
    const oscillator = context.createOscillator();
    oscillator.connect(context.destination);
    // oscillator.frequency.value = this.pitch;

    oscillator.start(context.currentTime + 2);
    return oscillator.stop;
  }

  private calculatePitch() {
    this.pitch = Math.pow(2, this.calculateSemiTones() / 12) * Note.basePitch;
  }

  get stringNotation(): string {
    return this.alternativeNotation.toString();
  }

  toString() {
    return `${this.note}${this.accidental}`;
  }
}

export class AlternativeNoteNotation {
  baseNote: BaseNote;
  accidental: Accidental;
  octave: number;

  constructor(baseNote: BaseNote, accidental: Accidental, octave: number) {
    this.baseNote = baseNote;
    this.accidental = accidental;
    this.octave = octave;
  }

  toString() {
    return `${this.baseNote}${
      this.accidental !== Accidental.Natural ? this.accidental : ""
    }${this.octave}`;
  }
}

export const NoteList: Note[] = [
  new Note(BaseNote.C, Accidental.Natural, 0),
  new Note(BaseNote.C, Accidental.Sharp, 0),
  new Note(BaseNote.D, Accidental.Flat, 0),
  new Note(BaseNote.D, Accidental.Natural, 0),
  new Note(BaseNote.D, Accidental.Sharp, 0),
  new Note(BaseNote.E, Accidental.Flat, 0),
  new Note(BaseNote.E, Accidental.Natural, 0),
  new Note(BaseNote.F, Accidental.Natural, 0),
  new Note(BaseNote.F, Accidental.Sharp, 0),
  new Note(BaseNote.G, Accidental.Flat, 0),
  new Note(BaseNote.G, Accidental.Natural, 0),
  new Note(BaseNote.G, Accidental.Sharp, 0),
  new Note(BaseNote.A, Accidental.Flat, 0),
  new Note(BaseNote.A, Accidental.Natural, 0),
  new Note(BaseNote.A, Accidental.Sharp, 0),
  new Note(BaseNote.B, Accidental.Flat, 0),
  new Note(BaseNote.B, Accidental.Natural, 0),

  new Note(BaseNote.C, Accidental.Natural, 1),
  new Note(BaseNote.C, Accidental.Sharp, 1),
  new Note(BaseNote.D, Accidental.Flat, 1),
  new Note(BaseNote.D, Accidental.Natural, 1),
  new Note(BaseNote.D, Accidental.Sharp, 1),
  new Note(BaseNote.E, Accidental.Flat, 1),
  new Note(BaseNote.E, Accidental.Natural, 1),
  new Note(BaseNote.F, Accidental.Natural, 1),
  new Note(BaseNote.F, Accidental.Sharp, 1),
  new Note(BaseNote.G, Accidental.Flat, 1),
  new Note(BaseNote.G, Accidental.Natural, 1),
  new Note(BaseNote.G, Accidental.Sharp, 1),
  new Note(BaseNote.A, Accidental.Flat, 1),
  new Note(BaseNote.A, Accidental.Natural, 1),
  new Note(BaseNote.A, Accidental.Sharp, 1),
  new Note(BaseNote.B, Accidental.Flat, 1),
  new Note(BaseNote.B, Accidental.Natural, 1),

  new Note(BaseNote.C, Accidental.Natural, 2),
  new Note(BaseNote.C, Accidental.Sharp, 2),
  new Note(BaseNote.D, Accidental.Flat, 2),
  new Note(BaseNote.D, Accidental.Natural, 2),
  new Note(BaseNote.D, Accidental.Sharp, 2),
  new Note(BaseNote.E, Accidental.Flat, 2),
  new Note(BaseNote.E, Accidental.Natural, 2),
  new Note(BaseNote.F, Accidental.Natural, 2),
  new Note(BaseNote.F, Accidental.Sharp, 2),
  new Note(BaseNote.G, Accidental.Flat, 2),
  new Note(BaseNote.G, Accidental.Natural, 2),
  new Note(BaseNote.G, Accidental.Sharp, 2),
  new Note(BaseNote.A, Accidental.Flat, 2),
  new Note(BaseNote.A, Accidental.Natural, 2),
  new Note(BaseNote.A, Accidental.Sharp, 2),
  new Note(BaseNote.B, Accidental.Flat, 2),
  new Note(BaseNote.B, Accidental.Natural, 2),

  new Note(BaseNote.C, Accidental.Natural, 3),
  new Note(BaseNote.C, Accidental.Sharp, 3),
  new Note(BaseNote.D, Accidental.Flat, 3),
  new Note(BaseNote.D, Accidental.Natural, 3),
  new Note(BaseNote.D, Accidental.Sharp, 3),
  new Note(BaseNote.E, Accidental.Flat, 3),
  new Note(BaseNote.E, Accidental.Natural, 3),
  new Note(BaseNote.F, Accidental.Natural, 3),
  new Note(BaseNote.F, Accidental.Sharp, 3),
  new Note(BaseNote.G, Accidental.Flat, 3),
  new Note(BaseNote.G, Accidental.Natural, 3),
  new Note(BaseNote.G, Accidental.Sharp, 3),
  new Note(BaseNote.A, Accidental.Flat, 3),
  new Note(BaseNote.A, Accidental.Natural, 3),
  new Note(BaseNote.A, Accidental.Sharp, 3),
  new Note(BaseNote.B, Accidental.Flat, 3),
  new Note(BaseNote.B, Accidental.Natural, 3),

  new Note(BaseNote.C, Accidental.Natural, 4),
  new Note(BaseNote.C, Accidental.Sharp, 4),
  new Note(BaseNote.D, Accidental.Flat, 4),
  new Note(BaseNote.D, Accidental.Natural, 4),
  new Note(BaseNote.D, Accidental.Sharp, 4),
  new Note(BaseNote.E, Accidental.Flat, 4),
  new Note(BaseNote.E, Accidental.Natural, 4),
  new Note(BaseNote.F, Accidental.Natural, 4),
  new Note(BaseNote.F, Accidental.Sharp, 4),
  new Note(BaseNote.G, Accidental.Flat, 4),
  new Note(BaseNote.G, Accidental.Natural, 4),
  new Note(BaseNote.G, Accidental.Sharp, 4),
  new Note(BaseNote.A, Accidental.Flat, 4),
  new Note(BaseNote.A, Accidental.Natural, 4),
  new Note(BaseNote.A, Accidental.Sharp, 4),
  new Note(BaseNote.B, Accidental.Flat, 4),
  new Note(BaseNote.B, Accidental.Natural, 4),

  new Note(BaseNote.C, Accidental.Natural, 5),
  new Note(BaseNote.C, Accidental.Sharp, 5),
  new Note(BaseNote.D, Accidental.Flat, 5),
  new Note(BaseNote.D, Accidental.Natural, 5),
  new Note(BaseNote.D, Accidental.Sharp, 5),
  new Note(BaseNote.E, Accidental.Flat, 5),
  new Note(BaseNote.E, Accidental.Natural, 5),
  new Note(BaseNote.F, Accidental.Natural, 5),
  new Note(BaseNote.F, Accidental.Sharp, 5),
  new Note(BaseNote.G, Accidental.Flat, 5),
  new Note(BaseNote.G, Accidental.Natural, 5),
  new Note(BaseNote.G, Accidental.Sharp, 5),
  new Note(BaseNote.A, Accidental.Flat, 5),
  new Note(BaseNote.A, Accidental.Natural, 5),
  new Note(BaseNote.A, Accidental.Sharp, 5),
  new Note(BaseNote.B, Accidental.Flat, 5),
  new Note(BaseNote.B, Accidental.Natural, 5),

  new Note(BaseNote.C, Accidental.Natural, 6),
  new Note(BaseNote.C, Accidental.Sharp, 6),
  new Note(BaseNote.D, Accidental.Flat, 6),
  new Note(BaseNote.D, Accidental.Natural, 6),
  new Note(BaseNote.D, Accidental.Sharp, 6),
  new Note(BaseNote.E, Accidental.Flat, 6),
  new Note(BaseNote.E, Accidental.Natural, 6),
  new Note(BaseNote.F, Accidental.Natural, 6),
  new Note(BaseNote.F, Accidental.Sharp, 6),
  new Note(BaseNote.G, Accidental.Flat, 6),
  new Note(BaseNote.G, Accidental.Natural, 6),
  new Note(BaseNote.G, Accidental.Sharp, 6),
  new Note(BaseNote.A, Accidental.Flat, 6),
  new Note(BaseNote.A, Accidental.Natural, 6),
  new Note(BaseNote.A, Accidental.Sharp, 6),
  new Note(BaseNote.B, Accidental.Flat, 6),
  new Note(BaseNote.B, Accidental.Natural, 6),

  new Note(BaseNote.C, Accidental.Natural, 7),
  new Note(BaseNote.C, Accidental.Sharp, 7),
  new Note(BaseNote.D, Accidental.Flat, 7),
  new Note(BaseNote.D, Accidental.Natural, 7),
  new Note(BaseNote.D, Accidental.Sharp, 7),
  new Note(BaseNote.E, Accidental.Flat, 7),
  new Note(BaseNote.E, Accidental.Natural, 7),
  new Note(BaseNote.F, Accidental.Natural, 7),
  new Note(BaseNote.F, Accidental.Sharp, 7),
  new Note(BaseNote.G, Accidental.Flat, 7),
  new Note(BaseNote.G, Accidental.Natural, 7),
  new Note(BaseNote.G, Accidental.Sharp, 7),
  new Note(BaseNote.A, Accidental.Flat, 7),
  new Note(BaseNote.A, Accidental.Natural, 7),
  new Note(BaseNote.A, Accidental.Sharp, 7),
  new Note(BaseNote.B, Accidental.Flat, 7),
  new Note(BaseNote.B, Accidental.Natural, 7),

  new Note(BaseNote.C, Accidental.Natural, 8),
  new Note(BaseNote.C, Accidental.Sharp, 8),
  new Note(BaseNote.D, Accidental.Flat, 8),
  new Note(BaseNote.D, Accidental.Natural, 8),
  new Note(BaseNote.D, Accidental.Sharp, 8),
  new Note(BaseNote.E, Accidental.Flat, 8),
  new Note(BaseNote.E, Accidental.Natural, 8),
  new Note(BaseNote.F, Accidental.Natural, 8),
  new Note(BaseNote.F, Accidental.Sharp, 8),
  new Note(BaseNote.G, Accidental.Flat, 8),
  new Note(BaseNote.G, Accidental.Natural, 8),
  new Note(BaseNote.G, Accidental.Sharp, 8),
  new Note(BaseNote.A, Accidental.Flat, 8),
  new Note(BaseNote.A, Accidental.Natural, 8),
  new Note(BaseNote.A, Accidental.Sharp, 8),
  new Note(BaseNote.B, Accidental.Flat, 8),
  new Note(BaseNote.B, Accidental.Natural, 8),
];
