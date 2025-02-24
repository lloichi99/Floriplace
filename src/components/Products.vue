<template>
  <div>
    <div class="mockup-window bg-base-300 border">
    <div class="bg-base-200 flex justify-center px-4 py-16">
      <div class="div1">
        <h2 class="text-xl">Teachable Machine Image Model</h2>
        <button class="btn btn-primary" @click="toggleCamera">{{cameraOn ? 'Apagar' : 'Encender'}}</button>
        <div id="webcam-container"></div>
        <div id="label-container"></div>
      </div>
    </div>
  </div>
  
  </div>  
</template>

<script>
import * as tmImage from '@teachablemachine/image';
import { ref } from 'vue';

export default {
  setup() {
    const URL = "https://teachablemachine.withgoogle.com/models/A8Zu0J9ev/";
    let model, webcam, labelContainer, maxPredictions;
    const cameraOn = ref(false);

    const init = async () => {
      const modelURL = URL + "model.json";
      const metadataURL = URL + "metadata.json";

      model = await tmImage.load(modelURL, metadataURL);
      maxPredictions = model.getTotalClasses();

      const flip = true;
      webcam = new tmImage.Webcam(200, 200, flip);
      await webcam.setup();
      await webcam.play();
      window.requestAnimationFrame(loop);

      document.getElementById("webcam-container").appendChild(webcam.canvas);
      labelContainer = document.getElementById("label-container");
      labelContainer.innerHTML = "";
      for (let i = 0; i < maxPredictions; i++) {
        labelContainer.appendChild(document.createElement("div"));
      }
    };

    const stopCamera = () => {
      if (webcam) {
        webcam.stop();
        document.getElementById("webcam-container").innerHTML = "";
        labelContainer.innerHTML = "";
      }
    };

    const toggleCamera = async () => {
      if (cameraOn.value) {
        stopCamera();
      } else {
        await init();
      }
      cameraOn.value = !cameraOn.value;
    };

    const loop = async () => {
      webcam.update();
      await predict();
      window.requestAnimationFrame(loop);
    };

    const predict = async () => {
      const prediction = await model.predict(webcam.canvas);
      for (let i = 0; i < maxPredictions; i++) {
        const classPrediction =
          prediction[i].className + ": " + prediction[i].probability.toFixed(2);
        labelContainer.childNodes[i].innerHTML = classPrediction;
      }
    };

    return { toggleCamera, cameraOn };
  }
};
</script>

<style>
.div1 {
  display: flex;
  flex-direction: column;
  align-items:center;
}

button {
  padding: 10px 20px;
  background-color: #4CAF50;
  color: white;
  border: none;
  cursor: pointer;
  margin: 10px;
}
button:hover {
  background-color: #45a049;
}
</style>
