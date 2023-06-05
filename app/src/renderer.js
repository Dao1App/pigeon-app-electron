import { ipcRenderer } from "electron";
import keygen from "./keygen.js";
import jetpack from "fs-jetpack";
import env from "env";

document.addEventListener('DOMContentLoaded', () => {
  const generateKeyButton = document.getElementById('generateKeyButton');
  const fileLocationInput = document.getElementById('fileLocationInput');
  const publicKeyElement = document.getElementById('publicKeyElement');

  generateKeyButton.addEventListener('click', async () => {
    const fileLocation = fileLocationInput.value;
    try {
      const publicKey = await ipcRenderer.invoke('generateKey', fileLocation);
      publicKeyElement.textContent = publicKey;
    } catch (error) {
      console.error('Error generating key:', error);
    }
  });
});

ipcRenderer.on('generateKeyResult', (event, data) => {
  if (data.error) {
    console.error('Error generating key:', data.error);
  } else {
    const publicKey = data;
    document.getElementById('publicKeyElement').textContent = publicKey;
  }
});

document.getElementById('generateKeyButton').addEventListener('click', () => {
  ipcRenderer.send('generateKey');
});

document.querySelector("#app").style.display = "block";

const osMap = {
  win32: "Windows",
  darwin: "macOS",
  linux: "Linux"
};

ipcRenderer.on("app-path", (event, appDirPath) => {
  const appDir = jetpack.cwd(appDirPath);
  const manifest = appDir.read("package.json", "json");
});

ipcRenderer.send("need-app-path");
