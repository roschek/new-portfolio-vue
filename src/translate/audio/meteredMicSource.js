// Soniox AudioSource that also exposes the microphone level for the UI.
// One getUserMedia stream feeds both the MediaRecorder and the analyser:
// iOS Safari may mute the first track when a second capture is opened.
import { AudioPermissionError, AudioDeviceError, AudioUnavailableError } from "@soniox/client";

const CONSTRAINTS = {
  echoCancellation: false,
  noiseSuppression: false,
  autoGainControl: false,
  channelCount: 1,
};

export class MeteredMicSource {
  constructor({ timesliceMs = 60 } = {}) {
    this.timesliceMs = timesliceMs;
    this.handlers = null;
    this.stream = null;
    this.recorder = null;
    this.analyser = null;
    this.context = null;
    this.samples = null;
    this.chain = Promise.resolve();
  }

  async start(handlers) {
    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === "undefined") {
      throw new AudioUnavailableError("Audio capture is not supported");
    }
    this.handlers = handlers;
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({ audio: CONSTRAINTS });
    } catch (err) {
      if (err?.name === "NotAllowedError") throw new AudioPermissionError(err.message, err);
      if (err?.name === "NotFoundError") throw new AudioDeviceError(err.message, err);
      throw err;
    }
    this.stream.getAudioTracks()[0]?.addEventListener("mute", () => this.handlers?.onMuted?.());
    this.stream.getAudioTracks()[0]?.addEventListener("unmute", () => this.handlers?.onUnmuted?.());
    this.#startMeter();
    this.#startRecorder();
  }

  #startMeter() {
    try {
      this.context = new AudioContext();
      this.analyser = this.context.createAnalyser();
      this.analyser.fftSize = 512;
      this.context.createMediaStreamSource(this.stream).connect(this.analyser);
      this.samples = new Uint8Array(this.analyser.fftSize);
    } catch {
      // The level meter is cosmetic; recording works without it.
      this.analyser = null;
    }
  }

  #startRecorder() {
    const recorder = new MediaRecorder(this.stream);
    recorder.ondataavailable = (event) => {
      if (!event.data.size) return;
      // Keep chunks in order even though arrayBuffer() is async.
      this.chain = this.chain
        .then(() => event.data.arrayBuffer())
        .then((buffer) => this.handlers?.onData(buffer))
        .catch((err) => this.handlers?.onError?.(err));
    };
    recorder.start(this.timesliceMs);
    this.recorder = recorder;
  }

  restart() {
    if (!this.stream) return;
    if (this.recorder?.state !== "inactive") this.recorder?.stop();
    this.#startRecorder();
  }

  pause() {
    if (this.recorder?.state === "recording") this.recorder.pause();
    this.context?.suspend();
  }

  resume() {
    if (this.recorder?.state === "paused") this.recorder.resume();
    this.context?.resume();
  }

  stop() {
    if (this.recorder && this.recorder.state !== "inactive") this.recorder.stop();
    this.stream?.getTracks().forEach((track) => track.stop());
    this.context?.close();
    this.recorder = this.stream = this.analyser = this.context = this.handlers = null;
  }

  getLevel() {
    if (!this.analyser) return 0;
    this.analyser.getByteTimeDomainData(this.samples);
    let sum = 0;
    for (const value of this.samples) {
      const centered = (value - 128) / 128;
      sum += centered * centered;
    }
    return Math.min(1, Math.sqrt(sum / this.samples.length) * 4);
  }
}
