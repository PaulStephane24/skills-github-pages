// Game state
const gameState = {
  gameStarted: false,
  playerCount: 2,
  currentPlayer: 0,
  currentTask: "",
  taskType: "",
  gameMode: "soft",
  players: ["Player 1", "Player 2", "Player 3", "Player 4", "Player 5", "Player 6", "Player 7", "Player 8"],
}

// DOM Elements
const setupScreen = document.getElementById("setup-screen")
const gameScreen = document.getElementById("game-screen")
const twoPlayersForm = document.getElementById("two-players-form")
const multiPlayersForm = document.getElementById("multi-players-form")
const playerInputs = document.getElementById("player-inputs")
const playerCountDisplay = document.getElementById("player-count")
const playerAvatar = document.getElementById("player-avatar")
const playerNameDisplay = document.getElementById("player-name")
const modeBadge = document.getElementById("mode-badge")
const choiceButtons = document.getElementById("choice-buttons")
const taskDisplay = document.getElementById("task-display")
const taskType = document.getElementById("task-type")
const taskContent = document.getElementById("task-content")
const nextPlayerBtn = document.getElementById("next-player")
const backToSetupBtn = document.getElementById("back-to-setup")
const randomPlayerBtn = document.getElementById("random-player")

// Truth and Dare data
const truthQuestions = {
  soft: ["What is your favorite color?", "What is your favorite food?", "What is your dream vacation?"],
  medium: ["What is your biggest fear?", "What is your most embarrassing moment?", "What is your biggest regret?"],
  hard: [
    "What is the most illegal thing you have ever done?",
    "What is the most embarrassing thing you have ever done in public?",
    "What is the most hurtful thing you have ever said to someone?",
  ],
}

const dares = {
  soft: ["Sing a song.", "Do a silly dance.", "Tell a joke."],
  medium: ["Call a friend and tell them you love them.", "Do 20 push-ups.", "Eat a spoonful of mustard."],
  hard: ["Go outside and yell at the top of your lungs.", "Give a stranger a kiss on the cheek.", "Do a striptease."],
}

// Initialize the game
function init() {
  // Set up event listeners
  setupEventListeners()

  // Generate player inputs for multi-player mode
  generatePlayerInputs()
}

// Set up all event listeners
function setupEventListeners() {
  // Tab triggers
  document.querySelectorAll(".tab-trigger").forEach((tab) => {
    tab.addEventListener("click", () => {
      document.querySelectorAll(".tab-trigger").forEach((t) => t.classList.remove("active"))
      tab.classList.add("active")

      const players = tab.getAttribute("data-players")
      if (players === "2") {
        twoPlayersForm.style.display = "block"
        multiPlayersForm.style.display = "none"
        gameState.playerCount = 2
      } else {
        twoPlayersForm.style.display = "none"
        multiPlayersForm.style.display = "block"
        gameState.playerCount = 3
        updatePlayerCountDisplay()
      }
    })
  })

  // Mode buttons
  document.querySelectorAll(".mode-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".mode-btn").forEach((b) => {
        b.classList.remove("btn-primary")
        b.classList.add("btn-outline")
      })
      btn.classList.remove("btn-outline")
      btn.classList.add("btn-primary")

      gameState.gameMode = btn.getAttribute("data-mode")
    })
  })

  // Player count controls
  document.getElementById("increase-players").addEventListener("click", () => {
    if (gameState.playerCount < 8) {
      gameState.playerCount++
      updatePlayerCountDisplay()
      generatePlayerInputs()
    }
  })

  document.getElementById("decrease-players").addEventListener("click", () => {
    if (gameState.playerCount > 3) {
      gameState.playerCount--
      updatePlayerCountDisplay()
      generatePlayerInputs()
    }
  })

  // Start game button
  document.getElementById("start-game").addEventListener("click", startGame)

  // Truth and Dare buttons
  document.getElementById("truth-btn").addEventListener("click", handleTruth)
  document.getElementById("dare-btn").addEventListener("click", handleDare)

  // Next player button
  nextPlayerBtn.addEventListener("click", nextPlayer)

  // Back to setup button
  backToSetupBtn.addEventListener("click", resetGame)

  // Random player button
  randomPlayerBtn.addEventListener("click", randomizePlayer)
}

// Generate player input fields for multi-player mode
function generatePlayerInputs() {
  playerInputs.innerHTML = ""

  for (let i = 0; i < gameState.playerCount; i++) {
    const div = document.createElement("div")
    div.className = "form-group"

    const label = document.createElement("label")
    label.textContent = `Player ${i + 1}`
    label.setAttribute("for", `multi_player_${i}`)

    const input = document.createElement("input")
    input.type = "text"
    input.id = `multi_player_${i}`
    input.className = "form-control"
    input.placeholder = `Player ${i + 1}`
    input.value = gameState.players[i] || `Player ${i + 1}`
    input.addEventListener("input", (e) => {
      gameState.players[i] = e.target.value || `Player ${i + 1}`
    })

    div.appendChild(label)
    div.appendChild(input)
    playerInputs.appendChild(div)
  }
}

// Update player count display
function updatePlayerCountDisplay() {
  playerCountDisplay.textContent = `${gameState.playerCount} Players`

  // Enable/disable buttons based on player count
  document.getElementById("decrease-players").disabled = gameState.playerCount <= 3
  document.getElementById("increase-players").disabled = gameState.playerCount >= 8
}

// Start the game
function startGame() {
  // Get player names from inputs
  if (document.querySelector(".tab-trigger.active").getAttribute("data-players") === "2") {
    gameState.players[0] = document.getElementById("player_name_0").value || "Player 1"
    gameState.players[1] = document.getElementById("player_name_1").value || "Player 2"
    gameState.playerCount = 2
  } else {
    // Player names are already updated through input event listeners
  }

  gameState.gameStarted = true
  gameState.currentPlayer = 0
  gameState.currentTask = ""
  gameState.taskType = ""

  // Update UI
  setupScreen.style.display = "none"
  gameScreen.style.display = "block"
  backToSetupBtn.style.display = "block"
  randomPlayerBtn.style.display = "block"

  updateGameUI()
}

// Handle truth selection
function handleTruth() {
  const modeQuestions = truthQuestions[gameState.gameMode]
  const randomQuestion = modeQuestions[Math.floor(Math.random() * modeQuestions.length)]

  gameState.currentTask = randomQuestion
  gameState.taskType = "truth"

  updateGameUI()
}

// Handle dare selection
function handleDare() {
  const modeDares = dares[gameState.gameMode]
  const randomDare = modeDares[Math.floor(Math.random() * modeDares.length)]

  gameState.currentTask = randomDare
  gameState.taskType = "dare"

  updateGameUI()
}

// Move to next player
function nextPlayer() {
  gameState.currentPlayer = (gameState.currentPlayer + 1) % gameState.playerCount
  gameState.currentTask = ""
  gameState.taskType = ""

  updateGameUI()
}

// Randomize current player
function randomizePlayer() {
  gameState.currentPlayer = Math.floor(Math.random() * gameState.playerCount)
  gameState.currentTask = ""
  gameState.taskType = ""

  updateGameUI()
}

// Reset game to setup screen
function resetGame() {
  gameState.gameStarted = false

  // Update UI
  setupScreen.style.display = "block"
  gameScreen.style.display = "none"
  backToSetupBtn.style.display = "none"
  randomPlayerBtn.style.display = "none"
}

// Update game UI based on current state
function updateGameUI() {
  // Update player info
  playerAvatar.textContent = gameState.players[gameState.currentPlayer].charAt(0).toUpperCase()
  playerNameDisplay.textContent = `${gameState.players[gameState.currentPlayer]}'s Turn`

  // Update mode badge
  modeBadge.className = `mode-badge mode-${gameState.gameMode}`
  modeBadge.textContent = `${gameState.gameMode.charAt(0).toUpperCase() + gameState.gameMode.slice(1)} Mode`

  // Show/hide elements based on task state
  if (gameState.currentTask) {
    choiceButtons.style.display = "none"
    taskDisplay.style.display = "block"
    nextPlayerBtn.style.display = "block"
    randomPlayerBtn.style.display = "none"

    taskType.textContent = gameState.taskType === "truth" ? "Truth Question" : "Dare Challenge"
    taskContent.textContent = gameState.currentTask
  } else {
    choiceButtons.style.display = "grid"
    taskDisplay.style.display = "none"
    nextPlayerBtn.style.display = "none"
    randomPlayerBtn.style.display = "block"
  }
}

// Initialize the game when the page loads
window.addEventListener("DOMContentLoaded", init)

