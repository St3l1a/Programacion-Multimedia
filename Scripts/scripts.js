//VIDEO
document.addEventListener("DOMContentLoaded", function () {
    let reproductor_video = document.getElementById("video");
    let iconPlayPause_video = document.getElementById("iconPlayPause-video");
    let playPauseBtn_video = document.getElementById("playPauseBtn-video");
    let timeini_video = document.getElementById("time-ini-video");
    let timefin_video = document.getElementById("time-fin-video");
    let volumeFill_video = document.querySelector(".green-video");
    let progressBar_video = document.querySelector(".time-video");
    let volumeBar_video = document.querySelector(".slider-video");
    let flecha_adelante = document.getElementById("flecha-adelante");
    let flecha_atras = document.getElementById("flecha-atras");
    let fullscreenBtn = document.querySelector('.fullscreen-btn');

    volumeBar_video.addEventListener("click", function (event) {
        let porcentaje = event.offsetX / volumeBar_video.clientWidth;
        porcentaje = Math.min(1, Math.max(0, porcentaje));
        reproductor_video.volume = porcentaje;
        volumeFill_video.style.width = `${porcentaje * 100}%`;
    });

    flecha_adelante.addEventListener("click", function (event) {
        reproductor_video.currentTime += 10;
        
        let porcentaje = reproductor_video.currentTime / reproductor_video.duration;
        
        document.querySelector(".elapsed-video").style.width = `${porcentaje * 100}%`;
    });

    flecha_atras.addEventListener("click", function (event) {
        reproductor_video.currentTime -= 10;
        
        let porcentaje = reproductor_video.currentTime / reproductor_video.duration;
        
        document.querySelector(".elapsed-video").style.width = `${porcentaje * 100}%`;
    });


    progressBar_video.addEventListener("click", function (event) {
        let porcentaje = event.offsetX / progressBar_video.clientWidth;
        reproductor_video.currentTime = reproductor_video.duration * porcentaje;
        document.querySelector(".elapsed-video").style.width = `${porcentaje * 100}%`;
    });

    playPauseBtn_video.addEventListener("click", function () {
        if (reproductor_video.paused) {
            reproductor_video.play();
            video.classList.remove("videoPausado");
            iconPlayPause_video.innerHTML = `<path fill-rule="evenodd" d="M21.6 12a9.6 9.6 0 1 1-19.2 0 9.6 9.6 0 0 1 19.2 0ZM8.4 9.6a1.2 1.2 0 1 1 2.4 0v4.8a1.2 1.2 0 1 1-2.4 0V9.6Zm6-1.2a1.2 1.2 0 0 0-1.2 1.2v4.8a1.2 1.2 0 1 0 2.4 0V9.6a1.2 1.2 0 0 0-1.2-1.2Z" clip-rule="evenodd"></path>`;
        } else {
            reproductor_video.pause();
            video.classList.add("videoPausado");
            iconPlayPause_video.innerHTML = `<svg width="24" height="24" viewBox="0 0 60 60" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M45.6 29.2l-22-15a1 1 0 0 0-1.6.8v30a1 1 0 0 0 1.6.8l22-15a1 1 0 0 0 0-1.6zM24 43V17l19.2 13L24 43z"/><path d="M30 0a30 30 0 1 0 0 60 30 30 0 0 0 0-60zm0 58A28 28 0 1 1 30 2a28 28 0 0 1 0 56z"/></svg>`;
        }
    });

    reproductor_video.addEventListener("click", function () {
      if (reproductor_video.paused) {
        reproductor_video.play();
        video.classList.remove("videoPausado");
        iconPlayPause_video.innerHTML = `<path fill-rule="evenodd" d="M21.6 12a9.6 9.6 0 1 1-19.2 0 9.6 9.6 0 0 1 19.2 0ZM8.4 9.6a1.2 1.2 0 1 1 2.4 0v4.8a1.2 1.2 0 1 1-2.4 0V9.6Zm6-1.2a1.2 1.2 0 0 0-1.2 1.2v4.8a1.2 1.2 0 1 0 2.4 0V9.6a1.2 1.2 0 0 0-1.2-1.2Z" clip-rule="evenodd"></path>`;
    } else {
        reproductor_video.pause();
        video.classList.add("videoPausado");
        iconPlayPause_video.innerHTML = `<svg width="24" height="24" viewBox="0 0 60 60" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M45.6 29.2l-22-15a1 1 0 0 0-1.6.8v30a1 1 0 0 0 1.6.8l22-15a1 1 0 0 0 0-1.6zM24 43V17l19.2 13L24 43z"/><path d="M30 0a30 30 0 1 0 0 60 30 30 0 0 0 0-60zm0 58A28 28 0 1 1 30 2a28 28 0 0 1 0 56z"/></svg>`;
    }
    });

    reproductor_video.addEventListener("loadedmetadata", function () {
        let totalSegundos = Math.floor(reproductor_video.duration);
        timefin_video.textContent = `${Math.floor(totalSegundos / 60)}:${(totalSegundos % 60).toString().padStart(2, '0')}`;
    });

    reproductor_video.addEventListener("timeupdate", function () {
        let totalSegundos = Math.floor(reproductor_video.duration);
        let segundosActuales = Math.floor(reproductor_video.currentTime);
        let minutosTranscurridos = Math.floor(segundosActuales / 60);
        let segundosT = segundosActuales % 60;
        timeini_video.textContent = `${minutosTranscurridos}:${segundosT.toString().padStart(2, '0')}`;

        let segundosRestantes = totalSegundos - segundosActuales;
        let minutosRestantes = Math.floor(segundosRestantes / 60);
        let segundosR = segundosRestantes % 60;
        document.getElementById("duracionRestante-video").textContent = `${minutosRestantes}:${segundosR.toString().padStart(2, '0')}`;

        let progreso = (reproductor_video.currentTime / reproductor_video.duration) * 100;
        document.querySelector(".elapsed-video").style.width = `${progreso}%`;
    });

    fullscreenBtn.addEventListener('click', () => {
        // Si no hay ningún elemento en pantalla completa, entra en modo pantalla completa
        if (!document.fullscreenElement) {
          if (reproductor_video.requestFullscreen) {
            reproductor_video.requestFullscreen();
          } else if (reproductor_video.mozRequestFullScreen) { // Firefox
            reproductor_video.mozRequestFullScreen();
          } else if (reproductor_video.webkitRequestFullscreen) { // Chrome, Safari y Opera
            reproductor_video.webkitRequestFullscreen();
          } else if (reproductor_video.msRequestFullscreen) { // IE/Edge
            reproductor_video.msRequestFullscreen();
          }
        } else {
          // Si ya está en pantalla completa, sal de ella
          if (document.exitFullscreen) {
            document.exitFullscreen();
          } else if (document.mozCancelFullScreen) { // Firefox
            document.mozCancelFullScreen();
          } else if (document.webkitExitFullscreen) { // Chrome, Safari y Opera
            document.webkitExitFullscreen();
          } else if (document.msExitFullscreen) { // IE/Edge
            document.msExitFullscreen();
          }
        }
      });

});

// AUDIO
let select = document.getElementById("canciones");
  let reproductor = document.getElementById("reproductorAudio");
  let nombreCancion = document.getElementById("titulo-cancion");
  let iconPlayPause = document.getElementById("iconPlayPause");
  let playPauseBtn = document.getElementById("playPauseBtn");
  let timeini = document.getElementById("time-ini");
  let timefin = document.getElementById("time-fin");
  let volumeFill = document.querySelector(".green");
  let progressBar = document.querySelector(".time");
  let volumeBar = document.querySelector(".slider");
  let flecha_adelante = document.getElementById("flecha-adelante2");
  let flecha_atras = document.getElementById("flecha-atras2");

  select.addEventListener("change", function() {
    let opcionElegida = select.value;
      
    if(opcionElegida === "London") {
      reproductor.src = "Audios/London.mp3";
      nombreCancion.textContent = "London";
      timefin.textContent = "15:34";
    } else if(opcionElegida === "Gymnopedie") {
      reproductor.src = "Audios/Gymnopedie.mp3";
      nombreCancion.textContent = "Gymnopedie";
      timefin.textContent = "3:57";
    }
  });

  volumeBar.addEventListener("click", function (event) {
    let anchoBarra = volumeBar.clientWidth; 
    let clickX = event.offsetX; 
    let porcentaje = clickX / anchoBarra; 

    porcentaje = Math.min(1, Math.max(0, porcentaje));

    reproductor.volume = porcentaje;

    let level = porcentaje * 100;
    volumeFill.style.width = `${level}%`;
});

flecha_adelante.addEventListener("click", function (event) {
    reproductor.currentTime += 10;
    
    let porcentaje = reproductor_video.currentTime / reproductor_video.duration;
    
    document.querySelector(".elapsed").style.width = `${porcentaje * 100}%`;
});

flecha_atras.addEventListener("click", function (event) {
    reproductor.currentTime -= 10;
    
    let porcentaje = reproductor_video.currentTime / reproductor_video.duration;
    
    document.querySelector(".elapsed").style.width = `${porcentaje * 100}%`;
});

progressBar.addEventListener("click", function (event) {
    let anchoBarra = progressBar.clientWidth; // Ancho total de la barra
    let clickX = event.offsetX; // Posición X del clic dentro de la barra
    let porcentaje = clickX / anchoBarra; // Calcula el % de la barra donde se hizo clic

    reproductor.currentTime = reproductor.duration * porcentaje; // Avanza la canción

    // Actualiza visualmente la barra de progreso
    let progreso = porcentaje * 100;
    document.querySelector(".elapsed").style.width = `${progreso}%`;
});

  playPauseBtn.addEventListener("click", function () {
  if (reproductor.paused) {
      reproductor.play();
      // Cambia el icono a PAUSA
      iconPlayPause.innerHTML = `
        <path fill-rule="evenodd" d="M21.6 12a9.6 9.6 0 1 1-19.2 0 9.6 9.6 0 0 1 19.2 0ZM8.4 9.6a1.2 1.2 0 1 1 2.4 0v4.8a1.2 1.2 0 1 1-2.4 0V9.6Zm6-1.2a1.2 1.2 0 0 0-1.2 1.2v4.8a1.2 1.2 0 1 0 2.4 0V9.6a1.2 1.2 0 0 0-1.2-1.2Z" clip-rule="evenodd"></path>`;
  } else {
    reproductor.pause();
    iconPlayPause.innerHTML = `
      <svg width="24" height="24" viewBox="0 0 60 60" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M45.6 29.2l-22-15a1 1 0 0 0-1.6.8v30a1 1 0 0 0 1.6.8l22-15a1 1 0 0 0 0-1.6zM24 43V17l19.2 13L24 43z"/>
        <path d="M30 0a30 30 0 1 0 0 60 30 30 0 0 0 0-60zm0 58A28 28 0 1 1 30 2a28 28 0 0 1 0 56z"/>
      </svg>`;

  }
});

  reproductor.addEventListener("loadedmetadata", function() {
    let totalSegundos = Math.floor(reproductor.duration);
    let minutos = Math.floor(totalSegundos / 60);
    let segundos = totalSegundos % 60;
    
    // Formatear para que siempre muestre dos dígitos en los segundos (ej. 03 en vez de 3)
    document.getElementById("duracionCancion").textContent = `${minutos}:${segundos.toString().padStart(2, '0')}`;
    document.getElementById("nombreCancion").textContent = reproductor.src;
  });

  reproductor.addEventListener("timeupdate", function() {
  let totalSegundos = Math.floor(reproductor.duration); // Duración total de la canción
  let segundosActuales = Math.floor(reproductor.currentTime); // Tiempo transcurrido

  // Calcular tiempo restante
  let segundosRestantes = totalSegundos - segundosActuales;
  let minutosRestantes = Math.floor(segundosRestantes / 60);
  let segundosR = segundosRestantes % 60;

  // Calcular tiempo transcurrido
  let minutosTranscurridos = Math.floor(segundosActuales / 60);
  let segundosT = segundosActuales % 60;

  // Actualizar el tiempo transcurrido (timeini)
  timeini.textContent = `${minutosTranscurridos}:${segundosT.toString().padStart(2, '0')}`;

  // Actualizar el tiempo restante (duracionRestanteCancion)
  document.getElementById("duracionRestanteCancion").textContent = `${minutosRestantes}:${segundosR.toString().padStart(2, '0')}`;

  // Actualizar el estado del reproductor
  if (segundosActuales >= totalSegundos) {
      document.getElementById("duracion").textContent = "Finalizado";
  } else if (reproductor.paused) {
      document.getElementById("duracion").textContent = "Pausado";
  } else {
      document.getElementById("duracion").textContent = "Reproduciendo";
  }

  let progreso = (reproductor.currentTime / reproductor.duration) * 100;
  document.querySelector(".elapsed").style.width = `${progreso}%`;
});


// MAPA
var map = L.map('map').setView([39.512972, -0.423917], 16);

// Capa en blanco y negro de Stamen Design
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
maxZoom: 19,
attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

var marker = L.marker([39.512972, -0.423917]).addTo(map);