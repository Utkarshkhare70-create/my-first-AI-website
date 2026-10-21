import { SoundtrackId } from '../types/wish';

class AudioManager {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private currentTrack: SoundtrackId | null = null;
  private isPlaying: boolean = false;
  private loopInterval: number | null = null;
  private gainNode: GainNode | null = null;

  private initCtx(): AudioContext {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (muted) {
      this.stop();
    }
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  public getCurrentTrack(): SoundtrackId | null {
    return this.currentTrack;
  }

  // Play a note with synth envelope
  private playTone(
    freq: number,
    startTime: number,
    duration: number,
    type: OscillatorType = 'sine',
    gainValue: number = 0.15
  ) {
    if (this.isMuted || !this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(gainValue, startTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + duration);
    } catch {
      // AudioContext error handling
    }
  }

  // Play short celebratory sound effect
  public playPopper() {
    if (this.isMuted) return;
    const ctx = this.initCtx();
    const now = ctx.currentTime;

    // Noise burst for the "POP"
    const bufferSize = ctx.sampleRate * 0.12;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.02));
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 1800;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    noise.start(now);

    // High twinkle chime
    this.playTone(880, now + 0.05, 0.4, 'triangle', 0.2);
    this.playTone(1320, now + 0.1, 0.45, 'sine', 0.2);
    this.playTone(1760, now + 0.15, 0.5, 'sine', 0.25);
  }

  // Balloon pop sound
  public playBalloonPop() {
    if (this.isMuted) return;
    const ctx = this.initCtx();
    const now = ctx.currentTime;

    const bufferSize = ctx.sampleRate * 0.08;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.015));
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

    noise.connect(gain);
    gain.connect(ctx.destination);
    noise.start(now);
  }

  // Candle blow whoosh and celebration chime
  public playCandleBlow() {
    if (this.isMuted) return;
    const ctx = this.initCtx();
    const now = ctx.currentTime;

    // Gentle breath sound
    const bufferSize = ctx.sampleRate * 0.6;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.sin((i / bufferSize) * Math.PI);
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, now);
    filter.frequency.exponentialRampToValueAtTime(200, now + 0.6);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.25, now);
    gain.gain.linearRampToValueAtTime(0, now + 0.6);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    noise.start(now);

    // Chime harp cascade after blow
    const notes = [523.25, 659.25, 783.99, 1046.5, 1318.5, 1567.98];
    notes.forEach((f, idx) => {
      this.playTone(f, now + 0.4 + idx * 0.08, 0.6, 'sine', 0.18);
    });
  }

  // Firework burst whoosh and explosion
  public playFirework() {
    if (this.isMuted) return;
    const ctx = this.initCtx();
    const now = ctx.currentTime;

    // Launch whistle
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(300, now);
    osc.frequency.exponentialRampToValueAtTime(1400, now + 0.3);
    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.3);

    // Boom
    setTimeout(() => {
      if (this.isMuted || !this.ctx) return;
      const t = this.ctx.currentTime;
      this.playTone(120, t, 0.4, 'triangle', 0.35);
      this.playTone(180, t + 0.05, 0.3, 'sine', 0.25);
      this.playPopper();
    }, 280);
  }

  // Stepper / button click
  public playClick() {
    if (this.isMuted) return;
    const ctx = this.initCtx();
    this.playTone(600, ctx.currentTime, 0.05, 'sine', 0.08);
  }

  // Soundtrack loops
  public playSoundtrack(id: SoundtrackId) {
    if (this.isMuted) return;
    this.stop();
    this.initCtx();
    this.currentTrack = id;
    this.isPlaying = true;

    this.playTrackPattern(id);

    const loopDurations: Record<SoundtrackId, number> = {
      acoustic: 6000,
      pop: 4800,
      lofi: 8000,
    };

    this.loopInterval = window.setInterval(() => {
      if (this.isPlaying && !this.isMuted) {
        this.playTrackPattern(id);
      }
    }, loopDurations[id]);
  }

  private playTrackPattern(id: SoundtrackId) {
    if (!this.ctx || this.isMuted) return;
    const now = this.ctx.currentTime;

    if (id === 'acoustic') {
      // Warm ukulele Happy Birthday melody
      // C4=261.63, D4=293.66, E4=329.63, F4=349.23, G4=392.00, A4=440.00, B4=493.88, C5=523.25
      const notes = [
        { f: 261.63, t: 0.0, d: 0.3 },
        { f: 261.63, t: 0.35, d: 0.3 },
        { f: 293.66, t: 0.7, d: 0.6 },
        { f: 261.63, t: 1.4, d: 0.6 },
        { f: 349.23, t: 2.1, d: 0.6 },
        { f: 329.63, t: 2.8, d: 1.1 },

        { f: 261.63, t: 4.0, d: 0.3 },
        { f: 261.63, t: 4.35, d: 0.3 },
        { f: 293.66, t: 4.7, d: 0.6 },
        { f: 261.63, t: 5.4, d: 0.6 },
      ];
      notes.forEach((n) => {
        this.playTone(n.f, now + n.t, n.d, 'triangle', 0.16);
        // Harmonic warmth
        this.playTone(n.f * 1.5, now + n.t, n.d * 0.7, 'sine', 0.06);
      });
    } else if (id === 'pop') {
      // Upbeat pop synth chords & rhythm
      const chords = [
        { f: [349.23, 440.0, 523.25], t: 0.0 }, // F maj
        { f: [392.0, 493.88, 587.33], t: 1.2 }, // G maj
        { f: [329.63, 440.0, 523.25], t: 2.4 }, // A min
        { f: [261.63, 329.63, 392.0], t: 3.6 }, // C maj
      ];
      chords.forEach((c) => {
        c.f.forEach((freq) => {
          this.playTone(freq, now + c.t, 0.45, 'sawtooth', 0.06);
          this.playTone(freq * 0.5, now + c.t, 0.5, 'triangle', 0.12);
        });
      });
      // Pop synth bells on top
      const bells = [659.25, 783.99, 880.0, 1046.5];
      bells.forEach((f, idx) => {
        this.playTone(f, now + idx * 0.3 + 0.15, 0.25, 'sine', 0.1);
      });
    } else if (id === 'lofi') {
      // Cozy chill lofi chords (Maj7 & 9ths)
      const lofiChords = [
        { f: [261.63, 329.63, 392.0, 493.88], t: 0.0 }, // Cmaj7
        { f: [220.0, 261.63, 329.63, 392.0], t: 2.0 },  // Am7
        { f: [174.61, 220.0, 261.63, 329.63], t: 4.0 }, // Fmaj7
        { f: [196.0, 246.94, 293.66, 349.23], t: 6.0 }, // G7
      ];
      lofiChords.forEach((c) => {
        c.f.forEach((freq) => {
          this.playTone(freq, now + c.t, 1.6, 'sine', 0.09);
        });
      });
      // Soft gentle chime
      this.playTone(1046.5, now + 1.2, 0.8, 'sine', 0.08);
      this.playTone(1318.51, now + 3.2, 0.8, 'sine', 0.07);
    }
  }

  public stop() {
    this.isPlaying = false;
    this.currentTrack = null;
    if (this.loopInterval) {
      clearInterval(this.loopInterval);
      this.loopInterval = null;
    }
  }

  public togglePlay(id: SoundtrackId = 'acoustic'): boolean {
    if (this.isPlaying && this.currentTrack === id) {
      this.stop();
      return false;
    } else {
      this.playSoundtrack(id);
      return true;
    }
  }
}

export const audio = new AudioManager();
