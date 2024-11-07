// `script.js` – ohne erneute Initialisierung von Firebase

const database = firebase.database();

// Beispiel für die `createGame`-Funktion in `script.js`

let gameId = null;

function createGame() {
  console.log("Neues Spiel wird erstellt..."); // Testausgabe
  gameId = Math.random().toString(36).substr(2, 5);
  set(ref(database, 'games/' + gameId), {
    players: 1,
    board: initializeBoard()
  });
  loadGame();
  alert(`Dein Spielcode ist: ${gameId}`);
}

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
