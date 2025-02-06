document.addEventListener("DOMContentLoaded", function () {
    let audio = document.getElementById("background-audio");
  
    if (!audio) {
      audio = document.createElement("audio");
      audio.id = "background-audio";
      audio.src = "audio.mp3"; // Change to your actual audio file
      audio.loop = true;
      audio.autoplay = true;
  
      document.body.appendChild(audio);
    }
  
    // Resume audio from last saved time
    let savedTime = localStorage.getItem("audioTime");
    if (savedTime) {
      audio.currentTime = parseFloat(savedTime);
    }
  
    audio.play().catch(() => console.log("User interaction required for autoplay."));
  
    // Save audio time before page unload
    window.addEventListener("beforeunload", function () {
      localStorage.setItem("audioTime", audio.currentTime);
    });
  });
  