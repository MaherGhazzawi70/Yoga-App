const main = document.querySelector("main");

let basicArray = [
  { pic: 0, min: 1 },
  { pic: 1, min: 1 },
  { pic: 2, min: 1 },
  { pic: 3, min: 1 },
  { pic: 4, min: 1 },
  { pic: 5, min: 1 },
  { pic: 6, min: 1 },
  { pic: 7, min: 1 },
  { pic: 8, min: 1 },
  { pic: 9, min: 1 },
];
let exerciceArray = [];

// Get stored Array 
(() => {
  if(localStorage.exercices){
    exerciceArray = JSON.parse(localStorage.exercices);  
  }else{
    exerciceArray = basicArray;
  }
})();

class Exercice {
  constructor(){
    this.index = 0;
    this.minutes = exerciceArray[this.index].min;
    this.seconds = 0;
    this.timerId = null;
    this.isPlaying = true;
    this.isPaused = false;  // Automatische Pause zwischen Übungen
  }
  
  updateCountdown(){
    main.innerHTML = `
      <div class="exercice-container"> 
        <p>${this.minutes}:${this.seconds < 10 ? '0' + this.seconds : this.seconds}</p>
        <img src="./img/${exerciceArray[this.index].pic}.png"/>
        <div>${this.index + 1} / ${exerciceArray.length}</div>
        ${this.isPaused ? '<button id="resume">Fortsetzen</button>' : ''}
      </div> 
    `;

    const resumeBtn = document.getElementById('resume');
    if(resumeBtn){
      resumeBtn.addEventListener('click', () => this.resume());
    }

    if(this.isPlaying && !this.isPaused){
      this.timerId = setTimeout(() => {
        if(this.minutes === 0 && this.seconds === 0){
          this.index++;
          this.ring();
          
          if(this.index >= exerciceArray.length){
            return page.finish();
          }
          
          // Automatische Pause
          this.isPaused = true;
          this.minutes = exerciceArray[this.index].min;
          this.seconds = 0;
          this.updateCountdown();
          
        } else if(this.seconds === 0){
          this.minutes--;
          this.seconds = 59;
          this.updateCountdown();
        } else {
          this.seconds--;
          this.updateCountdown();
        }
      }, 1000);
    }
  }

  resume(){
    this.isPaused = false;
    this.updateCountdown();
  }

  start(){
    this.isPlaying = true;
    this.updateCountdown();
  }

  ring(){
    const audio = new Audio();
    audio.src = "ring.mp3";
    audio.play();
  }
}

const utils = {
  pageContent: function (title, content, btn) {
    document.querySelector("h1").innerHTML = title;
    main.innerHTML = content;
    document.querySelector(".btn-container").innerHTML = btn;
  },
  handEventMinutes: function () {
    document.querySelectorAll('input[type="number"]').forEach((input) => {
      input.addEventListener("input", (e) => {
        exerciceArray.map((exo) => {
          if (exo.pic == e.target.id) {
            exo.min = parseInt(e.target.value);
            this.store();
          }
        });
      });
    });
  },
  handleEventArrow: function () {
    document.querySelectorAll(".arrow").forEach((arrow) => {
      arrow.addEventListener("click", (e) => {
        let position = 0;
        exerciceArray.map((exo)=> {
          if(exo.pic == e.target.dataset.pic && position !== 0){
            [exerciceArray[position], exerciceArray[position - 1]] = [
              exerciceArray[position - 1],
              exerciceArray[position]
            ];
            page.lobby();  
            this.store();   
          }else{
            position++;   
          }
        });
      });
    });
  },
  deleteItem: function() {
    document.querySelectorAll(".deleteBtn").forEach((btn)=> {
      btn.addEventListener("click",(e)=> {
        let newArray = exerciceArray.filter((exo) => {
          return exo.pic != e.target.dataset.pic;
        });
        exerciceArray = newArray;
        page.lobby();
        this.store();
      });
    });
  },
  reboot: function(){
    exerciceArray = basicArray;
    page.lobby();
    this.store();
  },
  store: function(){
    localStorage.exercices = JSON.stringify(exerciceArray);
  }
};

const page = {
  lobby: function () {
    let mapArray = exerciceArray
      .map((exo) => { 
        return `
          <li>
            <div class="card-header"> 
              <input type="number" id=${exo.pic} min="1" max="10" value=${exo.min}>
              <span> min</span>
            </div>
            <img src="./img/${exo.pic}.png" alt="exercice ${exo.pic}">
            <i class="fas fa-arrow-alt-circle-left arrow" data-pic=${exo.pic}></i>
            <i class="fas fa-times-circle deleteBtn" data-pic=${exo.pic}></i>
          </li>
        `;
      })
      .join("");
      
    utils.pageContent(
      "Einstellungen <i id='reboot' class='fas fa-undo'></i>",
      "<ul>" + mapArray + "</ul>",
      "<button id='start'>Anfangen<i class='fas fa-play-circle'></i></button>"
    );
    
    utils.handEventMinutes();
    utils.handleEventArrow();
    utils.deleteItem();
    reboot.addEventListener("click", () => utils.reboot());
    start.addEventListener("click", () => page.routine());
  },
  
  routine: function () {
    this.currentExercice = new Exercice();
    document.querySelector("h1").innerHTML = "Deine Routine";
    this.currentExercice.start();
    document.querySelector(".btn-container").innerHTML = "";
  },
  
  finish: function () {
    utils.pageContent(
      "Routine Beendet",
      "<button id='restart'>Wiederholen</button>",
      "<button id='lobby' class='btn-reboot'>Zurück <i class='fas fa-times-circle'></i></button>"
    );
    
    document.getElementById('restart').addEventListener('click', () => page.routine());
    document.getElementById('lobby').addEventListener('click', () => page.lobby());
  },
};

page.lobby();
