// `script.js` - Keine Firebase-Initialisierung mehr notwendig

// Zugriff auf die Firebase-Datenbank, die von der index.html-Datei übergeben wurde
const database = window.database;  // Firebase-Datenbank aus der index.html
const ref = window.ref;
const set = window.set;
const onValue = window.onValue;

let gameId = null;

// Neues Spiel erstellen
function createGame() {
  console.log("Neues Spiel wird erstellt...");  // Testausgabe
  gameId = Math.random().toString(36).substr(2, 5);  // Zufälliger Spielcode
  set(ref(database, 'games/' + gameId), {
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
  ref(database, `games/${gameId}/board/${index}`).get().then((snapshot) => {
    const currentState = snapshot.val();
    const newState = currentState === "flipped" ? "hidden" : "flipped";
    set(ref(database, `games/${gameId}/board/${index}`), newState);
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
  ref(database, 'games/' + gameId).once('value').then(snapshot => {
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

  onValue(ref(database, 'games/' + gameId + '/board'), (snapshot) => {
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
