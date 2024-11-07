const characters = ["Max", "Anna", "Tom", "Lisa", "Lukas", "Sophie"]; // Liste der Charaktere
let secretCharacter = null;

// Funktion, um eine zufällige Karte zu ziehen
function drawRandomCard() {
  const randomIndex = Math.floor(Math.random() * characters.length);
  secretCharacter = characters[randomIndex];
  alert(`Geheimnisvolle Karte: ${secretCharacter}`); // Nur für den Test, später verstecken!
}

// Karten dynamisch erstellen und ins Board einfügen
const board = document.getElementById('board');
characters.forEach((character, index) => {
  const card = document.createElement('div');
  card.className = 'card';
  card.textContent = character;
  card.onclick = () => flipCard(card);
  board.appendChild(card);
});

// Funktion, um Karten umzudrehen
function flipCard(card) {
  card.classList.toggle('flipped');
}
