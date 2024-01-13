export enum Accidental {
  Natural = "♮",
  Flat = "♭",
  Sharp = "♯",
}

export const CompareAccententals = (a: Accidental, b: Accidental): number => {
  if (a === b) return 0;
  else if (a === Accidental.Natural && b === Accidental.Flat) return 1;
  else if (a === Accidental.Natural && b === Accidental.Sharp) return -1;
  else if (
    (a === Accidental.Flat && b === Accidental.Natural) ||
    (a === Accidental.Flat && b === Accidental.Sharp)
  )
    return -1;
  else if (
    (a === Accidental.Sharp && b === Accidental.Flat) ||
    (a === Accidental.Sharp && b === Accidental.Natural)
  )
    return 1;
  return 0;
};

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

  constructor(note: BaseNote, accidental: Accidental, octave: number) {
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

  private generateSinWave(time: number, frames: number): number {
    /*
      Formula as found:
        Y = sin(2 * PI * w * time) * exp(-0.0004 * 2 * PI * w * time)
      Overtones
        Y += sin(2 * 2 * PI * w * time) * exp(-0.0004 * 2 * PI * w * time) / 2
        Y += sin(3 * 2 * PI * w * time) * exp(-0.0004 * 2 * PI * w * time) / 4
        Y += sin(4 * 2 * PI * w * time) * exp(-0.0004 * 2 * PI * w * time) / 8
        Y += sin(5 * 2 * PI * w * time) * exp(-0.0004 * 2 * PI * w * time) / 16
        Y += sin(6 * 2 * PI * w * time) * exp(-0.0004 * 2 * PI * w * time) / 32
      Saturation
        Y += Y * Y * Y
      Optional
        Y *= 1 + 16 * time * exp(-6 * time)

      Other formula
        y = 0.6 * sin(1*w*time) * exp(-0.0015*w*time);
        y += 0.4 * sin(2*w*time) * exp(-0.0015 * w *  time);
        y += y * y * y
        y *= 1 + 16 * time * exp(-6 * time)

      Third formula
        y  = 0.6*sin(1.0*w*t)*exp(-0.0008*w*t);
        y += 0.3*sin(2.0*w*t)*exp(-0.0010*w*t);
        y += 0.1*sin(4.0*w*t)*exp(-0.0015*w*t);
        y += 0.2*y*y*y;
        y *= 0.9 + 0.1*cos(70.0*t);
        y = 2.0*y*exp(-22.0*t) + y;

        https://dsp.stackexchange.com/questions/46598/mathematical-equation-for-the-sound-wave-that-a-PIano-makes
    */
    const { exp, sin, cos, PI } = Math;
    // const sin = (num: number) => Math.sin(num * (Math.PI / 180));
    // const cos = (num: number) => Math.sin(num * (Math.PI / 180));
    let w = this.pitch;
    let t = time / frames;
    // let y = 0.6 * sin(1.0 * w * t) * exp(-0.0008 * w * t);
    // y += 0.3 * sin(2.0 * w * t) * exp(-0.001 * w * t);
    // y += 0.1 * sin(4.0 * w * t) * exp(-0.0015 * w * t);
    // y += 0.2 * y * y * y;
    // y *= 0.9 + 0.1 * cos(70.0 * t);
    // y = 2.0 * y * exp(-22.0 * t) + y;

    let y = 0.6 * sin(1 * w * t) * exp(-0.0015 * w * t);
    y += 0.4 * sin(2 * w * t) * exp(-0.0015 * w * t);
    y += y * y * y;
    y *= 1 + 16 * t * exp(-6 * t);

    // Formula as found:
    // let Y = sin(2 * PI * w * t) * exp(-0.0004 * 2 * PI * w * t);
    // // Overtones
    // Y += (sin(2 * 2 * PI * w * t) * exp(-0.0004 * 2 * PI * w * t)) / 2;
    // Y += (sin(3 * 2 * PI * w * t) * exp(-0.0004 * 2 * PI * w * t)) / 4;
    // Y += (sin(4 * 2 * PI * w * t) * exp(-0.0004 * 2 * PI * w * t)) / 8;
    // Y += (sin(5 * 2 * PI * w * t) * exp(-0.0004 * 2 * PI * w * t)) / 16;
    // Y += (sin(6 * 2 * PI * w * t) * exp(-0.0004 * 2 * PI * w * t)) / 32;
    // // Formula as found:
    // Y = sin(2 * PI * w * t) * exp(-0.0004 * 2 * PI * w * t);
    // // Overtones
    // Y += (sin(2 * 2 * PI * w * t) * exp(-0.0004 * 2 * PI * w * time)) / 2;
    // Y += (sin(3 * 2 * PI * w * t) * exp(-0.0004 * 2 * PI * w * t)) / 4;
    // Y += (sin(4 * 2 * PI * w * t) * exp(-0.0004 * 2 * PI * w * t)) / 8;
    // Y += (sin(5 * 2 * PI * w * t) * exp(-0.0004 * 2 * PI * w * t)) / 16;
    // Y += (sin(6 * 2 * PI * w * t) * exp(-0.0004 * 2 * PI * w * t)) / 32;
    // // Saturation
    // Y += Y * Y * Y;
    // // Optional
    // Y *= 1 + 16 * t * exp(-6 * t);
    // Y += Y * Y * Y;
    // // Optional
    // Y *= 1 + 16 * t * exp(-6 * t);

    return y;
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
        nowBuffering[i] = this.generateSinWave(i, audioCtx.sampleRate);
        // nowBuffering[i] = Math.random() * 2 - 1;
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

  new Note(BaseNote.A, Accidental.Flat, 1),
  new Note(BaseNote.A, Accidental.Natural, 1),
  new Note(BaseNote.A, Accidental.Sharp, 1),
  new Note(BaseNote.B, Accidental.Flat, 1),
  new Note(BaseNote.B, Accidental.Natural, 1),
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

  new Note(BaseNote.A, Accidental.Flat, 2),
  new Note(BaseNote.A, Accidental.Natural, 2),
  new Note(BaseNote.A, Accidental.Sharp, 2),
  new Note(BaseNote.B, Accidental.Flat, 2),
  new Note(BaseNote.B, Accidental.Natural, 2),
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

  new Note(BaseNote.A, Accidental.Flat, 3),
  new Note(BaseNote.A, Accidental.Natural, 3),
  new Note(BaseNote.A, Accidental.Sharp, 3),
  new Note(BaseNote.B, Accidental.Flat, 3),
  new Note(BaseNote.B, Accidental.Natural, 3),
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

  new Note(BaseNote.A, Accidental.Flat, 4),
  new Note(BaseNote.A, Accidental.Natural, 4),
  new Note(BaseNote.A, Accidental.Sharp, 4),
  new Note(BaseNote.B, Accidental.Flat, 4),
  new Note(BaseNote.B, Accidental.Natural, 4),
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

  new Note(BaseNote.A, Accidental.Flat, 5),
  new Note(BaseNote.A, Accidental.Natural, 5),
  new Note(BaseNote.A, Accidental.Sharp, 5),
  new Note(BaseNote.B, Accidental.Flat, 5),
  new Note(BaseNote.B, Accidental.Natural, 5),
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

  new Note(BaseNote.A, Accidental.Flat, 6),
  new Note(BaseNote.A, Accidental.Natural, 6),
  new Note(BaseNote.A, Accidental.Sharp, 6),
  new Note(BaseNote.B, Accidental.Flat, 6),
  new Note(BaseNote.B, Accidental.Natural, 6),
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

  new Note(BaseNote.A, Accidental.Flat, 7),
  new Note(BaseNote.A, Accidental.Natural, 7),
  new Note(BaseNote.A, Accidental.Sharp, 7),
  new Note(BaseNote.B, Accidental.Flat, 7),
  new Note(BaseNote.B, Accidental.Natural, 7),
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

  new Note(BaseNote.A, Accidental.Flat, 8),
  new Note(BaseNote.A, Accidental.Natural, 8),
  new Note(BaseNote.A, Accidental.Sharp, 8),
  new Note(BaseNote.B, Accidental.Flat, 8),
  new Note(BaseNote.B, Accidental.Natural, 8),
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
];
