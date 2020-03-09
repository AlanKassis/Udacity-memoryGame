
/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 *    Author: Alan Kassis
 */

class PlayGame {
  constructor (deck) {
    this.gameGrid = document.getElementById('grid')
    this.deckArray = deck
    this.shuffleCards(this.deckArray)
    this.buildHtml(this.deckArray)
    this.startGame()
  }

  startGame () {
    this.openCards = []
    this.matchedCards = []
    this.moveDiv = document.getElementById('moves')
    this.moveCount = 1
    this.pending = false
    this.first = null
    this.timerStart = false
    this.starCount = 0
    this.time = 0
    this.timeDiv = document.getElementById('timer1')
    this.victoryModal = document.createElement('div')
    this.victoryModal.setAttribute('class', 'modal')
    this.modalContent = document.createElement('div')
    this.modalContent.setAttribute('class', 'modal-content')
  }

  shuffleCards (array) {
    var currentIndex = array.length, temporaryValue, randomIndex
    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex)
      currentIndex -= 1
      temporaryValue = array[currentIndex]
      array[currentIndex] = array[randomIndex]
      array[randomIndex] = temporaryValue
    }
    return array
  }

  buildHtml () {
    for (let i = 0; i <= 15; i++) {
      var cardDiv = document.createElement('div')
      cardDiv.setAttribute('class', 'card')
      cardDiv.innerHTML = `${this.deckArray[i].inner}${this.deckArray[i].front}${this.deckArray[i].back}`
      cardDiv.value = `${this.deckArray[i].value}`
      cardDiv.setAttribute('id', i)
      // cardDiv.addEventListener('click', this.flipCard) -> call this from ready state instead
      this.gameGrid.appendChild(cardDiv)
    }
  }

  flipCard (card) {
    if (!this.flipped(card)) {
      if (!this.pending) {
        if (this.openCards.length === 0) {
          card.classList.add('visible')
          this.first = card
          this.openCards.push(card)
        } else if (this.openCards.length === 1) {
          if (!this.timerStart) {
            this.timerStart = true
            this.timer()
          }
          card.classList.add('visible')
          this.checkMatch(card)
        }
      }
    }
  }

  victory () {
    const modal = this.victoryModal
    const modalContent = this.modalContent
    console.log('winner')
    this.timerStart = false

    modalContent.innerHTML = `
    <div class="congratulations"> You Win !! </div>
    <div class="final-score"> You won in ${this.moveCount} turns and finished in ${this.time} seconds
     with a score of ${this.starCount}</div>`
    modal.addEventListener('click', this.restart)
    modal.appendChild(modalContent)
    document.body.appendChild(modal)
    modal.style.display = 'block'
  }

  restart () {
    location.reload()
  }

  checkMatch (card) {
    this.pending = true
    if (card.value === this.first.value) {
      this.match(card, this.first)
    } else this.noMatch(card, this.first)
  }

  match (card1, card2) {
    this.matchedCards.push(card1)
    this.matchedCards.push(card2)
    this.openCards = []
    this.first = null
    this.pending = false
    this.moveDiv.textContent = this.moveCount++
    this.incrementTurns(this.moveCount)
    if (this.matchedCards.length === 16) this.victory()
  }

  noMatch (card1, card2) {
    setTimeout(flipBack => {
      card1.classList.remove('visible')
      card2.classList.remove('visible')
    }, 2000)
    this.openCards = []
    this.first = null
    this.pending = false
    this.moveDiv.textContent = this.moveCount++
    this.incrementTurns(this.moveCount)
  }

  flipped (card) {
    return card.classList.contains('visible')
  }

  incrementTurns (moveCount) {
    const starPath = "<img class='star' src='img/1x/star.png'></img>"
    const turnDiv = document.getElementById('stars')
    switch (moveCount) {
      case 8:
        turnDiv.innerHTML = `${starPath}${starPath}`
        this.starCount = 2
        break
      case 16:
        turnDiv.innerHTML = `${starPath}`
        this.starCount = 1
        break
      case 24:
        turnDiv.innerHTML = 'Try again for a better score'
        this.starCount = 0
        break
    }
  }

  timer () {
    setInterval(() => {
      this.time++
      this.timeDiv.innerText = this.time
    }, 2 * 1000)
  }

//   purge(card1, card2) {
//     card1.removeEventListener('click', () => {
//       gameInstance.flipCard(card)
//   })
//   card2.removeEventListener('click', () => {
//     gameInstance.flipCard(card)
// })
//   } I couldn't figure out how to remove the eventListener so I'll just use boolean logic to get around it
// class end
}

function ready () {
  var deck = makeDeck()
  const restartBtn = document.getElementById('redo')
  const gameInstance = new PlayGame(deck)
  const cards = Array.from(document.getElementsByClassName('card'))
  for (const card of cards) {
    card.addEventListener('click', () => {
      gameInstance.flipCard(card)
    })
  }
  restartBtn.addEventListener('click', gameInstance.restart)
}

function makeDeck () {
  let card = {}
  const deck = []
  for (let x = 0; x <= 1; x++) {
    for (let i = 1; i <= 8; i++) {
      card = {
        inner: '<div class="flip-card-inner">',
        front: `<div class="flip-card-front"><img src="img/1x/Asset ${i}-80.jpg" class="card-image"/></div>`,
        back: '<div class="flip-card-back"><img src="img/1x/Card_back.jpg" class="card-image"/></div></div>',
        value: i
      }
      deck.push(card)
    }
  }
  return deck
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', ready)
} else {
  ready()
}
