import { findKeyOfSubOject } from "../extensions/findKeyOfSubObject";
import { getRandomItemFromArray } from "../extensions/getRandomItemFromArray";
import { defaultFormula } from "./MathBuilder";

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

export enum Level {
  Level1,
  Level2,
  Level3,
  Level4,
}

enum IntervalType {
  Perfect = "Perfect",
  Minor = "Minor",
  Major = "Major",
  Diminished = "Diminished",
  Augmented = "Augmented",
}

enum IntervalAmount {
  Unison = "Unison",
  Second = "Second",
  Third = "Third",
  Fourth = "Fourth",
  Fifth = "Fifth",
  Sixth = "Sixth",
  Seventh = "Seventh",
  Octave = "Octave",
}

class Interval {
  type: IntervalType;
  amount: IntervalAmount;

  constructor(type: IntervalType, amount: IntervalAmount) {
    this.type = type;
    this.amount = amount;
  }

  toString() {
    return `${this.type} ${this.amount.toLowerCase()}`;
  }
}

export const IntervalDifferenceMap: {
  [semiTones: number]: {
    intervals: Interval[];
    otherNames: string[];
  };
} = {
  0: {
    intervals: [
      new Interval(IntervalType.Perfect, IntervalAmount.Unison),
      new Interval(IntervalType.Diminished, IntervalAmount.Second),
    ],
    otherNames: ["P1", "d2"],
  },
  1: {
    intervals: [
      new Interval(IntervalType.Minor, IntervalAmount.Second),
      new Interval(IntervalType.Augmented, IntervalAmount.Unison),
    ],
    otherNames: ["semitone", "half tone", "half step", "m2", "A1"],
  },
  2: {
    intervals: [
      new Interval(IntervalType.Major, IntervalAmount.Second),
      new Interval(IntervalType.Diminished, IntervalAmount.Third),
    ],
    otherNames: ["tone", "whole tone", "whole step", "M2", "d3"],
  },
  3: {
    intervals: [
      new Interval(IntervalType.Minor, IntervalAmount.Third),
      new Interval(IntervalType.Augmented, IntervalAmount.Second),
    ],
    otherNames: ["m3", "A2"],
  },
  4: {
    intervals: [
      new Interval(IntervalType.Major, IntervalAmount.Third),
      new Interval(IntervalType.Diminished, IntervalAmount.Fourth),
    ],
    otherNames: ["M3", "d4"],
  },
  5: {
    intervals: [
      new Interval(IntervalType.Perfect, IntervalAmount.Fourth),
      new Interval(IntervalType.Augmented, IntervalAmount.Third),
    ],
    otherNames: ["P4", "A3"],
  },
  6: {
    intervals: [
      new Interval(IntervalType.Diminished, IntervalAmount.Fifth),
      new Interval(IntervalType.Augmented, IntervalAmount.Fourth),
    ],
    otherNames: ["tritone", "d5", "A4"],
  },
  7: {
    intervals: [
      new Interval(IntervalType.Perfect, IntervalAmount.Fifth),
      new Interval(IntervalType.Diminished, IntervalAmount.Sixth),
    ],
    otherNames: ["P5", "d6"],
  },
  8: {
    intervals: [
      new Interval(IntervalType.Minor, IntervalAmount.Sixth),
      new Interval(IntervalType.Augmented, IntervalAmount.Fifth),
    ],
    otherNames: ["m6", "A5"],
  },
  9: {
    intervals: [
      new Interval(IntervalType.Major, IntervalAmount.Sixth),
      new Interval(IntervalType.Diminished, IntervalAmount.Seventh),
    ],
    otherNames: ["M6", "d7"],
  },
  10: {
    intervals: [
      new Interval(IntervalType.Minor, IntervalAmount.Seventh),
      new Interval(IntervalType.Augmented, IntervalAmount.Sixth),
    ],
    otherNames: ["m7", "A6"],
  },
  11: {
    intervals: [
      new Interval(IntervalType.Major, IntervalAmount.Seventh),
      new Interval(IntervalType.Diminished, IntervalAmount.Octave),
    ],
    otherNames: ["M7", "d8"],
  },
  12: {
    intervals: [
      new Interval(IntervalType.Perfect, IntervalAmount.Octave),
      new Interval(IntervalType.Augmented, IntervalAmount.Seventh),
    ],
    otherNames: ["P8", "A7"],
  },
};

type NoteAccidental = {
  note: BaseNote;
  accidental: Accidental;
};

const totalNoteMap: { [index: number]: NoteAccidental[] } = {
  0: [{ note: BaseNote.A, accidental: Accidental.Natural }],
  1: [
    { note: BaseNote.A, accidental: Accidental.Sharp },
    { note: BaseNote.B, accidental: Accidental.Flat },
  ],
  2: [
    { note: BaseNote.B, accidental: Accidental.Natural },
    { note: BaseNote.C, accidental: Accidental.Flat },
  ],
  3: [
    { note: BaseNote.B, accidental: Accidental.Sharp },
    { note: BaseNote.C, accidental: Accidental.Natural },
  ],
  4: [
    { note: BaseNote.C, accidental: Accidental.Sharp },
    { note: BaseNote.D, accidental: Accidental.Flat },
  ],
  5: [{ note: BaseNote.D, accidental: Accidental.Natural }],
  6: [
    { note: BaseNote.D, accidental: Accidental.Sharp },
    { note: BaseNote.E, accidental: Accidental.Flat },
  ],
  7: [{ note: BaseNote.E, accidental: Accidental.Flat }],
  8: [
    { note: BaseNote.E, accidental: Accidental.Natural },
    { note: BaseNote.F, accidental: Accidental.Flat },
  ],
  9: [
    { note: BaseNote.E, accidental: Accidental.Sharp },
    { note: BaseNote.F, accidental: Accidental.Natural },
  ],
  10: [
    { note: BaseNote.F, accidental: Accidental.Sharp },
    { note: BaseNote.G, accidental: Accidental.Flat },
  ],
  11: [{ note: BaseNote.G, accidental: Accidental.Natural }],
  12: [
    { note: BaseNote.G, accidental: Accidental.Sharp },
    { note: BaseNote.A, accidental: Accidental.Flat },
  ],
};

export const getNoteFromSemitones = (note: Note, semiTones: number): Note => {
  const currentNoteKey = findKeyOfSubOject(totalNoteMap, (notes) =>
    notes.some((s) => s.note === note.note && s.accidental === note.accidental)
  );
  const startSemiTones = Number.parseInt(currentNoteKey);
  const octaveDifference = Math.floor(
    Math.abs(startSemiTones + semiTones) / 13
  );
  const newNotes = totalNoteMap[Math.abs(startSemiTones + semiTones) % 13];
  const newNote = getRandomItemFromArray(newNotes);
  return new Note(
    newNote.note,
    note.octave + octaveDifference,
    newNote.accidental
  );
};

const convertStringToAccidental = (stringVersion: string): Accidental => {
  switch (stringVersion) {
    case "♮":
      return Accidental.Natural;
    case "♭":
      return Accidental.Flat;
    case "b":
      return Accidental.Flat;
    case "♯":
      return Accidental.Sharp;
    case "#":
      return Accidental.Sharp;
    default:
      return Accidental.Natural;
  }
};

const NoteNumMapUp = {
  [BaseNote.A]: 12,
  [BaseNote.B]: 14,
  [BaseNote.C]: 3,
  [BaseNote.D]: 5,
  [BaseNote.E]: 7,
  [BaseNote.F]: 8,
  [BaseNote.G]: 10,
};

const NoteNumMapDown = {
  [BaseNote.A]: -0,
  [BaseNote.B]: 2,
  [BaseNote.C]: -9,
  [BaseNote.D]: -7,
  [BaseNote.E]: -5,
  [BaseNote.F]: -4,
  [BaseNote.G]: -2,
};

const AccidentalMap = {
  [Accidental.Natural]: 0,
  [Accidental.Flat]: -1,
  [Accidental.Sharp]: 1,
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

  constructor(
    note: BaseNote,
    octave: number,
    accidental: Accidental = Accidental.Natural
  ) {
    this.note = note;
    this.accidental = accidental;
    this.octave = octave;
    this.alternativeNotation = new AlternativeNoteNotation(
      note,
      accidental,
      octave
    );
    this.calculatePItch();
  }

  private calculateSemiTones(): number {
    const octaveSemiTones = 12;

    if (this.octave <= Note.baseOctave) {
      let currNoteDiff = NoteNumMapDown[this.note];
      return (
        (this.octave - Note.baseOctave) * octaveSemiTones +
        currNoteDiff +
        AccidentalMap[this.accidental]
      );
    } else {
      let currNoteDiff = NoteNumMapUp[this.note];
      return (
        (this.octave - 1 - Note.baseOctave) * octaveSemiTones +
        currNoteDiff +
        AccidentalMap[this.accidental]
      );
    }
  }

  playNote(totalDuration: number) {
    const audioCtx = new window.AudioContext();

    // Create an empty three-second stereo buffer at the sample rate of the AudioContext
    const myArrayBuffer = audioCtx.createBuffer(
      2,
      audioCtx.sampleRate * totalDuration,
      audioCtx.sampleRate
    );

    // Fill the buffer with white noise;
    // just random values between -1.0 and 1.0
    for (let channel = 0; channel < myArrayBuffer.numberOfChannels; channel++) {
      // This gives us the actual ArrayBuffer that contains the data
      const nowBuffering = myArrayBuffer.getChannelData(channel);
      for (let i = 0; i < myArrayBuffer.length; i++) {
        // Math.random() is in [0; 1.0]
        // audio needs to be in [-1.0; 1.0]
        nowBuffering[i] = defaultFormula.Run(
          this.pitch,
          i / (audioCtx.sampleRate * totalDuration)
        );
      }
    }

    // Get an AudioBufferSourceNode.
    // This is the AudioNode to use when we want to play an AudioBuffer
    const source = audioCtx.createBufferSource();
    // set the buffer in the AudioBufferSourceNode
    source.buffer = myArrayBuffer;
    // connect the AudioBufferSourceNode to the
    // destination so we can hear the sound
    source.connect(audioCtx.destination);
    // start the source playing
    source.start();
  }

  private calculatePItch() {
    this.pitch = Math.pow(2, this.calculateSemiTones() / 12) * Note.basePitch;
  }

  get stringNotation(): string {
    return this.alternativeNotation.toString();
  }

  static fromString(note: string): Note {
    const splitted = note.split("");
    if (splitted.length === 2)
      return new Note(
        BaseNote[splitted[0] as BaseNote],
        Number.parseInt(splitted[1])
      );
    else {
      return new Note(
        BaseNote[splitted[0] as BaseNote],
        Number.parseInt(splitted[1]),
        convertStringToAccidental(splitted[2])
      );
    }
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
