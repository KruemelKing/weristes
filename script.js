// `script.js` – ohne erneute Initialisierung von Firebase

const database = firebase.database();

let gameId = null;

// Neues Spiel erstellen
function createGame() {
  gameId = Math.random().toString(36).substr(2, 5); // Erzeugt einen zufälligen Code
  database.ref('games/' + gameId).set({
    players: 1,
    board: initializeBoard() // Das Board wird vorbereitet
  });
  loadGame();
  alert(`Dein Spielcode ist: ${gameId}`);
}

// Spiel beitreten
function joinGame() {
  gameId = document.getElementById("joinCode").value;
  database.ref('games/' + gameId).once('value').then(snapshot => {
    if (snapshot.exists()) {
      database.ref('games/' + gameId + '/players').set(2);
      loadGame();
    } else {
      alert("Spiel nicht gefunden!");
    }
  });
}

// Lade das Spielfeld
function loadGame() {
  document.getElementById("menu").style.display = "none";
  document.getElementById("game").style.display = "block";
  const boardDiv = document.getElementById('board');

  database.ref('games/' + gameId + '/board').on('value', (snapshot) => {
    const board = snapshot.val();
    boardDiv.innerHTML = ''; // Löscht das Board und aktualisiert es

    board.forEach((character, index) => {
      const card = document.createElement('div');
      card.className = 'card';
      card.textContent = character;
      card.onclick = () => flipCard(index);
      boardDiv.appendChild(card);
    });
  });
}

// Initialisiere das Board
function initializeBoard() {
  return ["Max", "Anna", "Tom", "Lisa", "Lukas", "Sophie"];
}

// Karte umklappen
function flipCard(index) {
  database.ref(`games/${gameId}/board/${index}`).get().then((snapshot) => {
    const currentState = snapshot.val();
    const newState = currentState === "flipped" ? "hidden" : "flipped";
    database.ref(`games/${gameId}/board/${index}`).set(newState);
  });
}

// Spiel verlassen
function leaveGame() {
  document.getElementById("menu").style.display = "block";
  document.getElementById("game").style.display = "none";
  gameId = null;
}
