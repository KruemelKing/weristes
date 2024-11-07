// Zugriff auf die Firebase-Datenbank, die von der index.html-Datei übergeben wurde
const database = window.database;  // Firebase-Datenbank aus der index.html
const { ref, set, onValue } = window;  // Hole die richtigen Methoden aus window

let gameId = null;

// Neues Spiel erstellen
function createGame() {
  console.log("Neues Spiel wird erstellt...");  // Testausgabe
  gameId = Math.random().toString(36).substr(2, 5);  // Zufälliger Spielcode

  // Ref für den neuen Spielstandort erstellen
  const gameRef = ref(database, 'games/' + gameId);

  // Spiel in der Datenbank speichern
  set(gameRef, {
    players: 1,
    board: initializeBoard()  // Board mit initialen Werten
  });
  
  loadGame();
  alert(`Dein Spielcode ist: ${gameId}`);
}

// Initialisiere das Board
function initializeBoard() {
  return ["Max", "Anna", "Tom", "Lisa", "Lukas", "Sophie"];
}

// Karte umklappen
function flipCard(index) {
  const cardRef = ref(database, `games/${gameId}/board/${index}`);
  get(cardRef).then((snapshot) => {
    const currentState = snapshot.val();
    const newState = currentState === "flipped" ? "hidden" : "flipped";
    set(cardRef, newState);
  });
}

// Spiel verlassen
function leaveGame() {
  document.getElementById("menu").style.display = "block";
  document.getElementById("game").style.display = "none";
  gameId = null;
}

// Spiel beitreten
function joinGame() {
  gameId = document.getElementById("joinCode").value;
  const gameRef = ref(database, 'games/' + gameId);
  get(gameRef).then(snapshot => {
    if (snapshot.exists()) {
      set(ref(database, 'games/' + gameId + '/players'), 2);
      loadGame();
    } else {
      alert("Spiel nicht gefunden!");
    }
  });
}

// Spielfeld laden
function loadGame() {
  document.getElementById("menu").style.display = "none";
  document.getElementById("game").style.display = "block";
  const boardDiv = document.getElementById('board');

  const boardRef = ref(database, 'games/' + gameId + '/board');
  onValue(boardRef, (snapshot) => {
    const board = snapshot.val();
    boardDiv.innerHTML = '';  // Löscht das Board und aktualisiert es

    board.forEach((character, index) => {
      const card = document.createElement('div');
      card.className = 'card';
      card.textContent = character;
      card.onclick = () => flipCard(index);
      boardDiv.appendChild(card);
    });
  });
}
