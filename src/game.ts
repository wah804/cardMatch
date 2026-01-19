// ============================================
// Card Match Game - TypeScript Implementation
// ============================================

interface Card {
  id: number;
  value: number;
  isFlipped: boolean;
  isMatched: boolean;
}

class CardMatchGame {
  private cards: Card[] = [];
  private flippedCards: Card[] = [];
  private attemptsLeft: number = 3;
  private matchedPairs: number = 0;
  private isProcessing: boolean = false;
  private readonly totalPairs: number = 3;

  // DOM Elements
  private cardsGrid: HTMLElement;
  private attemptsDisplay: HTMLElement;
  private messageText: HTMLElement;
  private gameMessage: HTMLElement;
  private startOverBtn: HTMLElement;

  constructor() {
    this.cardsGrid = document.getElementById('cards-grid')!;
    this.attemptsDisplay = document.getElementById('attempts-count')!;
    this.messageText = document.getElementById('message-text')!;
    this.gameMessage = document.getElementById('game-message')!;
    this.startOverBtn = document.getElementById('start-over-btn')!;

    this.startOverBtn.addEventListener('click', () => this.initGame());
    this.initGame();
  }

  private initGame(): void {
    this.cards = [];
    this.flippedCards = [];
    this.attemptsLeft = 3;
    this.matchedPairs = 0;
    this.isProcessing = false;

    // Create 3 pairs of cards (values 2-10 for simplicity, no face cards)
    const values = this.getRandomValues(3);
    let id = 0;

    values.forEach(value => {
      // Create pair
      this.cards.push({ id: id++, value, isFlipped: false, isMatched: false });
      this.cards.push({ id: id++, value, isFlipped: false, isMatched: false });
    });

    // Shuffle cards
    this.shuffleCards();

    // Update UI
    this.updateAttemptsDisplay();
    this.hideMessage();
    this.renderCards();
  }

  private getRandomValues(count: number): number[] {
    // Get random card values from 2-10
    const allValues = [2, 3, 4, 5, 6, 7, 8, 9, 10];
    const shuffled = [...allValues].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
  }

  private shuffleCards(): void {
    // Fisher-Yates shuffle algorithm
    for (let i = this.cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
    }
  }

  private renderCards(): void {
    this.cardsGrid.innerHTML = '';

    this.cards.forEach(card => {
      const cardElement = document.createElement('div');
      cardElement.className = 'card';
      cardElement.dataset.id = card.id.toString();

      if (card.isFlipped || card.isMatched) {
        cardElement.classList.add('flipped');
      }

      if (card.isMatched) {
        cardElement.classList.add('matched');
      }

      cardElement.innerHTML = `
        <div class="card-inner">
          <div class="card-front">
            <span class="card-value">${card.value}</span>
          </div>
          <div class="card-back">
            <img src="assets/images/card-flip-card-image.png" alt="Card back" />
          </div>
        </div>
      `;

      cardElement.addEventListener('click', () => this.handleCardClick(card));
      this.cardsGrid.appendChild(cardElement);
    });
  }

  private handleCardClick(card: Card): void {
    // Prevent clicking if processing, already flipped, or already matched
    if (this.isProcessing || card.isFlipped || card.isMatched) {
      return;
    }

    // Prevent clicking if game is over
    if (this.attemptsLeft <= 0 || this.matchedPairs >= this.totalPairs) {
      return;
    }

    // Flip the card
    card.isFlipped = true;
    this.flippedCards.push(card);
    this.renderCards();

    // Check if two cards are flipped
    if (this.flippedCards.length === 2) {
      this.isProcessing = true;
      this.checkForMatch();
    }
  }

  private checkForMatch(): void {
    const [card1, card2] = this.flippedCards;

    if (card1.value === card2.value) {
      // Match found!
      card1.isMatched = true;
      card2.isMatched = true;
      this.matchedPairs++;
      this.flippedCards = [];
      this.isProcessing = false;
      this.renderCards();

      // Check for win
      if (this.matchedPairs >= this.totalPairs) {
        this.showMessage('You Won!', 'win');
      }
    } else {
      // No match - flip cards back after delay
      setTimeout(() => {
        card1.isFlipped = false;
        card2.isFlipped = false;
        this.flippedCards = [];
        this.attemptsLeft--;
        this.updateAttemptsDisplay();
        this.isProcessing = false;
        this.renderCards();

        // Check for loss
        if (this.attemptsLeft <= 0) {
          this.showMessage('Game Over!', 'lose');
        }
      }, 1000);
    }
  }

  private updateAttemptsDisplay(): void {
    this.attemptsDisplay.textContent = this.attemptsLeft.toString();
  }

  private showMessage(text: string, type: 'win' | 'lose'): void {
    this.messageText.textContent = text;
    this.gameMessage.className = `game-message visible ${type}`;
  }

  private hideMessage(): void {
    this.gameMessage.className = 'game-message';
    this.messageText.textContent = '';
  }
}

// Initialize game when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new CardMatchGame();
});
