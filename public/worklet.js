// Audio worklet for processing microphone input
// This worklet captures audio from the microphone and prepares it for sending to the Gemini API

class AudioProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
  }

  process(inputs, outputs, parameters) {
    const input = inputs[0];
    const output = outputs[0];

    if (input.length > 0) {
      const inputData = input[0];

      // Copy the mono channel data to the output
      for (let channel = 0; channel < inputData.numberOfChannels; channel++) {
        for (let i = 0; i < inputData.length; i++) {
          output[channel][i] = inputData[channel][i];
        }
      }
    }
  }
}

registerProcessor('audio-processor', AudioProcessor);
