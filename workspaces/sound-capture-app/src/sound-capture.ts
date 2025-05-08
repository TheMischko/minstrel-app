import { SoundCaptureChannels } from "shared-lib/.dist/models/messaging/sound-capture.channels";

const button = document.createElement("button");
document.body.appendChild(button);
button.addEventListener("click", () => {
  window.SoundCaptureAPI.send(SoundCaptureChannels.INIT_MSG, "Test");
});

const messageOutput = document.createElement("div");
document.body.appendChild(messageOutput);
