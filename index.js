const main = document.querySelector("main");

// hier definiere ich die Übungen. pic steht für die Bildnummer und min für die Minutenanzahl.
// danach kann der User die Werte anpassen. 
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
// Hier speichere ich die Übungen in einem Array, damit ich sie später anpassen und in der Routine verwenden kann.
// Hier jeder Veränderung wird hier gespeichert. 
let exerciceArray = [];

// hier sage ich, wenn es Übungen in Localstorage gibt, dann JSON.parse wandelt den JSON String zurück in ein JavaScript Object
(() => {
  if(localStorage.exercices){
    exerciceArray = JSON.parse(localStorage.exercices);  
  }else{
    exerciceArray = basicArray;
  }
})();
// hier erstelle ich eine Klasse für die Übungen.
// hier this ist wichtig,damit ich die Werte außer der Klasse verwenden kann. ohne this wird die Variable nur Dauerhaft in der Klasse gespeichert.
class Exercice {
  constructor(){
    this.index = 0; // hier Index ist sehr wichtig, damit kann ich die Werte ändern kann.
    this.minutes = exerciceArray[this.index].min; // hier er zeigt mir die Minuten. jetzt also 1 Minute.
    this.seconds = 0; 
    this.timerId = null; 
    this.isPlaying = true; 
    this.isPaused = false;  
  }
   
 // hier da wir in eine Klasse sind, kann ich direkt eine funktion definieren.
 // if(this.seconds < 10){ return '0' + this.seconds} else {return this.seconds} also ? ist if und : ist else.
 // hier in Zeile 51 zeige ich die Anzahl der Übungen. Zum Beispiel 1/10, 2/10...
  updateCountdown(){
    main.innerHTML = `
      <div class="exercice-container"> 
        <p>${this.minutes}:${this.seconds < 10 ? '0' + this.seconds : this.seconds}</p>
        // hier zeige ich die Bilder der Übungen. index = Bildnummer
        <img src="./img/${exerciceArray[this.index].pic}.png"/>
        <div>${this.index + 1} / ${exerciceArray.length}</div>
        ${this.isPaused ? '<button id="resume">Fortsetzen</button>' : ''}
      </div> 
    `;

    // oben habe ich es geklärt if isPause, dann haben wir ein Btn resume, else haben wir gar nicht.
    // also wenn isPaused ture, dann  haben wir den Button, dann wenn ich die Taste cklicke, dann rufe ich die Funktion resume auf.
    const resumeBtn = document.getElementById('resume');
    if(resumeBtn){
      resumeBtn.addEventListener('click', () => this.resume());
    }
    // hier if isPlaying ist true und isPaused ist false, dann fang der Timer an. Minuten und Sekunden sind 0 und hier index++ heißt
    // nächste Übung. 
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

          // hier if seconds === 0, dann eine eine Minute weniger und jetzt fangen wir von 59 Sekunden an.
          // jedes Sekunde passiert es so 58,57...
          
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
// hier einfache funktionen resume = Timer läuft weiter, start = Pause.
// ring auch eine option mit mp3 Datei.
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
 // Hier benutze ich ein OOP Ansatz, diese PageContent, handEventMinutes.... Sind Funktionen. Aber hier man nennt es Methoden.
 // PageContent ist eine Methode, damit kann ich die Seite erstellen. Unten Sie wird benutzt. 
 // handEventMinutes hier ich nehme alle input Elemente, dann ich muss jetzt die genaue exo nehmen, also die genauer Übung
 // dann prüfen wir ob die Übung richtig ist, exo.pic == e.target.id, dann kannst du die Minuten für jede Übung in Localstorage speichern.
 // handleEventArrow hier ändern wir die Reihenfolge der Übungen. hier && position !== 0 also wenn wir auf Übung 1 klicken, 
 // dann 1 - 1 = 0, also die erste Übung. 
 // deleteItem hier benutzen wir der neuen Array, wenn Event click aktiv ist, dann forEach alle Übungen in neue Array, außer der filtierte Übung.
 // Hier am ende reboot, also die Funktion macht alles von 0. 
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
// jetzt sind wir in der zweiter Opject hier ist die Hauptseite mit alle Übungen, ist wie eine Display funktion, sie zeigt die Minuten
// die Bilder und löschen Button und der .join("") ist um die komma zwischen die Übungen zu entfernen.
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
    // hier rufe ich die Funktionen an.
    utils.handEventMinutes();
    utils.handleEventArrow();
    utils.deleteItem();
    reboot.addEventListener("click", () => utils.reboot());
    start.addEventListener("click", () => page.routine());
  },
// hier ist die Routine Page ein neues Exercice 
  routine: function () {
    this.currentExercice = new Exercice();
    document.querySelector("h1").innerHTML = "Deine Routine";
    this.currentExercice.start();
    document.querySelector(".btn-container").innerHTML = "";
  },
  // hier ist finish also Ende Seite
  finish: function () {
    utils.pageContent(
      "Routine Beendet",
      "<button id='restart'>Wiederholen</button>",
      "<button id='lobby' class='btn-reboot'>Zurück <i class='fas fa-times-circle'></i></button>"
    );
    // hier sind die zwei Tasten, für die Seiten also wiederholen oder zurück zur Lobby Seite.
    document.getElementById('restart').addEventListener('click', () => page.routine());
    document.getElementById('lobby').addEventListener('click', () => page.lobby());
  },
};

 const ex= new Exercice();
   console.log(ex.minutes);

page.lobby();
