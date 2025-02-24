<template>
  <div>
    <div class="mockup-window bg-base-300 border">
    <div class="bg-base-200 flex justify-center px-4 py-16">
      <div class="div1">
        <h2 class="text-xl">Teachable Machine Image Model</h2>
        <button class="btn btn-primary" @click="toggleCamera">{{cameraOn ? 'Apagar' : 'Encender'}}</button>
        <button class="btn btn-primary" @click="classifyImage">Clasificar imagen</button>
        <div id="webcam-container"></div>
        <div id="label-container"></div>
        <!-- Área de arrastre de imágenes -->
          <div 
            id="drop-area" 
            class="drop-area" 
            @dragover.prevent="handleDragOver" 
            @drop.prevent="handleDrop"
          >
            <p>Arrastra una imagen aquí</p>
          </div>
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
    let model, maxPredictions;
    let labelContainer;
    
    // Estados
    const cameraOn = ref(false);
    let webcam;
    let isLooping = false;
    const uploadedImage = ref(null); // Imagen arrastrada

    // 📌 **Inicializar el modelo**
    const initModel = async () => {
      const modelURL = URL + "model.json";
      const metadataURL = URL + "metadata.json";
      model = await tmImage.load(modelURL, metadataURL);
      maxPredictions = model.getTotalClasses();

      labelContainer = document.getElementById("label-container");
      labelContainer.innerHTML = "";
      for (let i = 0; i < maxPredictions; i++) {
        labelContainer.appendChild(document.createElement("div"));
      }
    };

    //**Webcam**
    const initCamera = async () => {
      if (!model) await initModel();

      webcam = new tmImage.Webcam(200, 200, true);
      await webcam.setup();
      await webcam.play();

      document.getElementById("webcam-container").innerHTML = "";
      document.getElementById("webcam-container").appendChild(webcam.canvas);

      isLooping = true;
      loop();
    };

    const stopCamera = () => {
      if (webcam) {
        webcam.stop();
        document.getElementById("webcam-container").innerHTML = "";
        isLooping = false;
      }
    };

    const toggleCamera = async () => {
      if (cameraOn.value) {
        stopCamera();
      } else {
        await initCamera();
      }
      cameraOn.value = !cameraOn.value;
    };

    const loop = async () => {
      if (webcam && isLooping) {
        webcam.update();
        await predict(webcam.canvas);
        window.requestAnimationFrame(loop);
      }
    };

    //funciones para arrastrar imagen**
    const handleDragOver = (event) => {
      event.preventDefault();
    };

    const handleDrop = (event) => {
      event.preventDefault();
      const file = event.dataTransfer.files[0];

      if (file && file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = () => {
          const img = new Image();
          img.onload = () => {
            uploadedImage.value = img; // Guardamos la imagen en ref
            if (cameraOn.value) {
              stopCamera();
            }
          };
          img.src = reader.result;
        };
        reader.readAsDataURL(file);
      }
    };

    //**Clasificación de img**
    const predict = async (imageSource) => {
      if (!model) await initModel();

      const prediction = await model.predict(imageSource);
      labelContainer.innerHTML = ""; // Limpia predicciones anteriores

      for (let i = 0; i < maxPredictions; i++) {
        const classPrediction =
          prediction[i].className + ": " + prediction[i].probability.toFixed(2);
        labelContainer.appendChild(document.createElement("div")).innerHTML = classPrediction;
      }
    };

    const classifyImage = async () => {
      if (uploadedImage.value) {
        if (cameraOn.value) stopCamera();

        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        canvas.width = uploadedImage.value.width;
        canvas.height = uploadedImage.value.height;
        ctx.drawImage(uploadedImage.value, 0, 0);
        await predict(canvas);
      } else if (cameraOn.value) {
        await predict(webcam.canvas);
      } else {
        alert("No hay imágenes para clasificar.");
      }
    };

    return { 
      toggleCamera, cameraOn, 
      handleDragOver, handleDrop, 
      classifyImage 
    };
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

.drop-area {
  width: 100%;
  height: 200px;
  border: 2px dashed #4CAF50;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
  background-color: #f9f9f9;
  cursor: pointer;
}

.drop-area p {
  color: #4CAF50;
  font-size: 16px;
}
</style>
