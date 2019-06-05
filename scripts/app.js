const ghosts = []
let pacman = null
let scoreboard = null
let messages = null
let game = null

const walls = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 33, 36, 37, 39, 40, 41, 43, 44, 45, 47, 48, 51, 54, 56, 58, 60, 62, 64, 67, 68, 69, 70, 71, 75, 77, 81, 82, 83, 84, 85, 90, 96, 101, 102, 104, 105, 107, 108, 110, 112, 113, 115, 116, 118, 136, 137, 138, 140, 141, 142, 143, 144, 145, 146, 147, 148, 150, 151, 152, 159, 163, 170, 172, 173, 174, 176, 180, 182, 183, 184, 186, 187, 193, 194, 196, 197, 203, 204, 206, 207, 208, 216, 217, 218, 220, 221, 224, 229, 234, 237, 238, 239, 241, 242, 244, 245, 246, 247, 248, 250, 251, 253, 254, 255, 271, 272, 273, 274, 275, 276, 277, 278, 279, 280, 281, 282, 283, 284, 285, 286, 287, 288]

const prison = [160, 161, 162, 177, 178, 179]

document.fonts.ready.then(()=>{
  //fade in the screen once the fonts have loaded
  document.querySelector('body').classList.add('ready')
})

function init() {
  game = new LevelBuilder('.grid', 17, walls, prison)
  pacman = new Player('pacman',127)
  ghosts.push(new Ghost('binky',178,1000))
  ghosts.push(new Ghost('pinky',178,3000))
  ghosts.push(new Ghost('stinky',178,4500))
  ghosts.push(new Ghost('clyde',178,6000))
  scoreboard = new ScoreboardDefinition('.scoreboard')
  messages = new MessageBar('.message-overlay')
  window.addEventListener('keydown',handleKeyDown)
}

function handleKeyDown(e){
  //dont do anything if the game is already lost
  if(game.lost) return
  //if pacman isnt movable, and the spacebar is pressed, start the game
  if(e.keyCode === 32 && !pacman.movable){
    game.startRound()
    e.preventDefault()
  }
  //if pacman isnt movable, return
  if(!pacman.movable) return
  //apply the new direction into pacmans direction parameter so it can be picked up next interval
  switch (e.key) {
    case 'ArrowRight':
      pacman.direction = rightMove(pacman.location) ? 'right' : pacman.direction
      e.preventDefault()
      break
    case 'ArrowLeft':
      pacman.direction = leftMove(pacman.location) ? 'left' : pacman.direction
      e.preventDefault()
      break
    case 'ArrowUp':
      pacman.direction = upMove(pacman.location) ? 'up' : pacman.direction
      e.preventDefault()
      break
    case 'ArrowDown':
      pacman.direction = downMove(pacman.location) ? 'down' : pacman.direction
      e.preventDefault()
      break
  }
  if(!pacman.intId && pacman.direction) pacman.startMoving()
}

function rightMove(currentSquare){
  if(currentSquare % game.gridWidth === game.gridWidth - 1) return currentSquare - game.gridWidth + 1 //returns the square at the start of the row
  if(game.squares[currentSquare + 1].classList.contains('wall')) return null //no move if the square is a wall
  if(game.squares[currentSquare + 1].classList.contains('prison')) return null //no move if the square is a prison
  return currentSquare + 1
}
function leftMove(currentSquare){
  if(currentSquare % game.gridWidth === 0) return currentSquare + game.gridWidth - 1
  if(game.squares[currentSquare - 1].classList.contains('wall')) return null //no move if the square is a wall
  if(game.squares[currentSquare - 1].classList.contains('prison')) return null //no move if the square is a prison
  return currentSquare - 1
}
function upMove(currentSquare){
  if(currentSquare - game.gridWidth < 0) return currentSquare -= game.gridWidth
  if(game.squares[currentSquare - game.gridWidth].classList.contains('wall')) return null //no move if the square is a wall
  if(game.squares[currentSquare - game.gridWidth].classList.contains('prison')) return null //no move if the square is a prison
  return currentSquare - game.gridWidth
}
function downMove(currentSquare){
  if(currentSquare + game.gridWidth > game.gridWidth * game.gridWidth) return currentSquare += game.gridWidth
  if(game.squares[currentSquare + game.gridWidth].classList.contains('wall')) return null //no move if the square is a wall
  if(game.squares[currentSquare + game.gridWidth].classList.contains('prison')) return null //no move if the square is a prison
  return currentSquare + game.gridWidth
}

window.addEventListener('DOMContentLoaded', init)

class Player {
  constructor(name,index){
    this.location = index
    this.movable = false
    this.startSquare = index
    this.previousLocation = null
    this.name = name
    this.intId = null
    this.direction = null
    this.availableMoves = {}
    this.dead = false
    game.addSprite(this.name, this.location, 'start')
  }
  startMoving(){
    //dont allow pacman to move if he is dead
    if(this.dead) return
    //make sure he is movable
    this.movable = true
    //dont allow to start moving if there is already a timer running
    if(!this.intId){
      this.intId = setInterval( ()=>{
        this.move()
      }, 300)
      this.move()
    }
  }
  stopMoving(){
    clearInterval(this.intId)
    this.intId = null
    //make sure he is movable
    this.movable = false
    //reset the movement direction so it doesnt start moving when resumed for the next round
    this.direction = null
  }
  move(){
    //dont allow pacman to move if he is dead
    if(this.dead) return

    //set the location history
    this.previousLocation = this.location

    //potential moves of the sprite
    this.availableMoves.right = rightMove(this.location)
    this.availableMoves.left = leftMove(this.location)
    this.availableMoves.up = upMove(this.location)
    this.availableMoves.down = downMove(this.location)

    //whichever direction has been asked for, validate it it possible, if it is, apply it
    switch (this.direction) {
      case 'right': if(this.availableMoves.right) this.location = this.availableMoves.right
        break
      case 'left': if(this.availableMoves.left) this.location = this.availableMoves.left
        break
      case 'up': if(this.availableMoves.up) this.location = this.availableMoves.up
        break
      case 'down': if(this.availableMoves.down) this.location = this.availableMoves.down
        break
    }
    //check if pacman should die in the new location, if so, dont move there
    this.checkDead()
    if(!this.dead && this.location !== this.previousLocation){
      game.addSprite(this.name, this.location, `${this.name}-${this.direction}`)
      game.removeSprite(this.name, this.previousLocation)
      this.eat()
    }
  }
  eat(){
    //dont eat if we're standing still
    if(this.location === this.previousLocation) return
    //if the square contains a pill and its not already been eaten
    if(game.squares[this.location].classList.contains('pill') && !game.squares[this.location].classList.contains('eaten')) game.pillEaten(this.location)
  }
  checkDead(){
    //if pacman is already dead, we dont need to check it again
    if(this.dead) return
    //check if pacman is on the same square as a ghost
    ghosts.forEach(ghost => {
      if(ghost.square === this.location) game.initiateLoss()
    })
  }
  restart(){
    this.stopMoving()
    if(game.lost) return
    this.dead = false
    this.location = this.startSquare
    game.addSprite(this.name, this.location, 'start')
    //as long as the timer isnt already going, start pacman moving after the given delay
    if(!this.intId) setTimeout( ()=> this.startMoving(), this.startDelay)
  }
  death(){
    this.stopMoving()
    this.dead = true
    //apply the class, and then remove pacman after a timeout, to allow the animation to run
    //pacman can die either at this.location or at this.previousLocation
    game.squares[this.location].classList.add('dead')
    if(this.previousLocation) game.squares[this.previousLocation].classList.add('dead')
    setTimeout( ()=> {
      game.squares[this.location].classList.remove('pacman', 'pacman-up', 'pacman-down', 'pacman-left', 'pacman-right', 'dead')
      if(this.previousLocation) game.squares[this.previousLocation].classList.remove('pacman', 'pacman-up', 'pacman-down', 'pacman-left', 'pacman-right', 'dead')
    }, 2000)
  }
}

class Ghost{
  constructor(name, square, startDelay){
    this.name = name
    this.startSquare = square
    this.square = square
    this.bias = []
    this.allDirections = ['up','right','down','left']
    this.direction = 'down'
    this.intId = null
    this.stepCounter = 0
    this.stepHistory = []
    this.availableMoves = {}
    this.mode = {}
    this.killedPacman = false
    this.startDelay = startDelay
  }
  clearSprite(location){
    //console.log('clearing:',this.name, location)
    game.removeSprite(this.name, location)
  }
  startMoving(){
    setTimeout(()=>{
      if(!this.intId) this.intId = setInterval( ()=>this.move(), 700)
    }, this.startDelay)
  }
  resetPosition(){
    //reset the position of the ghost, set a default direction and add the start square to the history
    this.square = this.startSquare
    this.direction = 'down'
    this.addStep(this.square)
    //draw the ghost
    game.addSprite(this.name, this.square, `${this.name}-${this.direction}`)
    //start the ghost in obstacle mode to navigate out of the prison
    this.modeSwitch('obstacle')
    //remove the most recent step - where the ghost is currently located
    if(this.stepHistory[1]){
      this.clearSprite(this.stepHistory[1])
    }
  }
  stopMoving(){
    clearInterval(this.intId)
    this.intId = null
  }
  calcAvailableMoves(){
    this.availableMoves.right = rightMove(this.square)
    this.availableMoves.left = leftMove(this.square)
    this.availableMoves.up = upMove(this.square)
    this.availableMoves.down = downMove(this.square)
  }
  calcDirectionBias(){
    //work out how far away the ghost is from pacman
    const pacmanColumn = pacman.location % game.gridWidth
    const pacmanRow = Math.floor(pacman.location / game.gridWidth)
    const ghostColumn = this.square % game.gridWidth
    const ghostRow = Math.floor(this.square / game.gridWidth)
    const horizontalDifference = ghostColumn-pacmanColumn
    const rowDifferential = ghostRow-pacmanRow
    //wipe the bias to recalculate it, and only add the direction to the bias if it is not zero. Add either left/right because the column (horizontal) difference is greater. Add either up/down because the row (vertical) difference is greater
    this.bias = []
    if (horizontalDifference > 0) this.bias.push('left')
    if (horizontalDifference < 0) this.bias.push('right')
    if (rowDifferential > 0) this.bias.push('up')
    if (rowDifferential < 0) this.bias.push('down')
  }
  move(forcedLocation){
    //set the newSquare to be the forced location only if one is passed in otherwise initialise it
    let newSquare = forcedLocation ? forcedLocation : null

    //increase the move stepCounter
    this.stepCounter++

    // generate the direction bias to influence the direction of travel, and work out what the available moves are
    this.calcDirectionBias()
    this.calcAvailableMoves()

    //understand if we are in a special mode of operation, run the appropriate method
    if(!newSquare){
      switch(this.calcMode()) {
        case 'obstacle':
          newSquare = this.obstacleModeMove()
          break
        default:
          newSquare = this.noModeMove()
      }
    }

    //check to see if this newSquare will kill pacman - if it will, stop play
    if(this.willKillPacman(newSquare)) game.initiateLoss()

    //if we didnt kill pacman, check we made a choice, then make the move and apply to the object parameters, but only if pacman is alive. If he's dead, dont move there because it will ruin the death animation
    if(newSquare && !this.killedPacman){
      //identify the new direction based on the newSquare variable
      this.direction = Object.keys(this.availableMoves).filter(direction => this.availableMoves[direction] === newSquare )[0]
      //apply the new square
      this.square = newSquare
      //console.log('Chose:', this.direction, this.square)
      //add the square to the loaction history
      this.addStep(this.square)

      //move to the square, by moving the sprite
      game.addSprite(this.name, this.square, `${this.name}-${this.direction}`)
      //we just added the new location to the history, remove the old sprite from history position #1
      this.clearSprite(this.stepHistory[1])
    }
  }
  noModeMove(){
    // the standard way to calculate the next move when we are not in a special mode
    let newSquare = null
    let newDirection = null

    //work out what the opposite direction is to the current direction of travel
    const cameFrom = this.oppositeDirection(this.direction)
    //add into the array the moves that are possible
    const possibleMoves = this.allDirections.filter(direction => this.availableMoves[direction])
    //decide if I'm at a junction. Grab the available moves, then remove the direction we just came from
    const crossroads = possibleMoves.filter(direction => direction !== cameFrom)

    //Log helper for giving the parameters required when assessing the best move to make
    //console.log('No mode move. Current direction:',this.direction ,'possible:',possibleMoves, 'bias:',this.bias, 'junction:', crossroads)

    //Decide what is best to do:
    // 1. If i'm at a junction, choose the direction which leads to pacman
    // 2. Continue in the same direction if possible
    // 3. If the only appropriate choice is away from pacman, go into obstacle mode
    // 4. Make a random choice

    // I'm at a junction and there are more than one moves available that arent where I came from, choose a direction at the junction which takes me towards pacman
    if(crossroads.length > 1){
      const biasJcnDirections = crossroads.filter(direction => this.bias.includes(direction))
      //console.log('Jcn based on bias', biasJcnDirections, biasJcnDirections.length)
      //decide if the junction options are in the bias or not
      if(biasJcnDirections.length > 0){
        newDirection = biasJcnDirections[Math.floor(Math.random() * biasJcnDirections.length)]
        //console.log('Jcn randomly chose:',newDirection)
        newSquare = this.availableMoves[newDirection]
      }
    }

    // 2. If I havent decided yet, see if I can continue in the direction I was already travelling in
    if(!newSquare && this.availableMoves[this.direction]){
      //console.log('Im going to continue')
      newSquare = this.availableMoves[this.direction]
    }

    // 3. If I havent decided yet and there is only 1 choice and it is away from pacman, go into obstacle mode
    if(!newSquare && crossroads.length === 1 && this.bias.includes(this.oppositeDirection(crossroads[0]))){
      //console.log('theres no good junction choice, so lets go into obstacle mode')
      this.modeSwitch('obstacle')
      //instead of skipping the turn, immediately run the obstacle logic
      newSquare = this.obstacleModeMove()
    }

    // 4. if I havent decided yet, make a random choice of the available directions
    if(!newSquare && possibleMoves.length !== 0){
      newDirection = possibleMoves[Math.floor(Math.random()*possibleMoves.length)]
      newSquare = this.availableMoves[newDirection]
      //console.log('Completely random:', newDirection)
    }

    //finally return the new square value. This should never be null because of item #4 above
    return newSquare
  }
  obstacleModeMove(){
    //obstacle mode requires the ghost to move anticlockwise around any obstacles
    //console.log('OPERATING IN OBSTACLE MODE')

    //to move in an anticlocwise direction, we need to identify the last direction of travel and choose the first available direction an index before our previous direction
    const anticlockwiseDirections = this.anticlockwiseDirections(this.direction)

    //the array items are listed in anticlockwise order, so find the first index that is allowed
    const direction = anticlockwiseDirections.find(direction => this.availableMoves[direction])
    //console.log('Obstacle navigation chose:', direction)
    return this.availableMoves[direction]
  }
  addStep(step){
    //add the new step to the start of the history, and see if we have more than 4 steps recorded
    this.stepHistory.unshift(step)
    while(this.stepHistory.length > 4){
      this.stepHistory.pop()
    }
  }
  willKillPacman(index){
    this.killedPacman = game.squares[index].classList.contains('pacman')
    return this.killedPacman
  }
  oppositeDirection(direction){
    switch(direction){
      case 'up': return 'down'
      case 'down': return 'up'
      case 'left': return 'right'
      case 'right': return 'left'
    }
  }
  anticlockwiseDirections(direction){
    if (direction === 'down') return ['right','down','left','up']
    if (direction === 'right') return ['up','right','down','left']
    if (direction === 'up') return ['left','up','right','down']
    if (direction === 'left') return ['down','left','up','right']
  }
  calcMode(){
    //if there is a mode defined, and it should end this turn, end it
    if(this.mode.name && this.mode.ends === this.stepCounter){
      console.log('ending mode')
      this.mode = {}
    }
    //if there is a mode active, return the name of it
    return this.mode.name
  }
  modeSwitch(mode){
    //if there isnt a mode in operation, set it to the new mode, and record the step number
    if(!this.mode.name){
      this.mode.name = mode
      this.mode.started = this.stepCounter
      this.mode.ends = this.stepCounter + 3
    }
    //TODO: future modes
    //case 'poison': this.mode = 'poison'
  }
}

class LevelBuilder{
  constructor(gridClass, gridWidth, walls, prison){
    this.gridClass = gridClass
    this.grid = document.querySelector(this.gridClass)
    this.gridWidth = gridWidth
    this.walls = walls
    this.prison = prison
    this.squares = []
    this.lost = false
    this.totalPills = 0
    this.pillsRemaining = null
    this.paintGrid()
    this.paintDecoration()
  }
  startRound(){
    ghosts.forEach(ghost => ghost.resetPosition())
    messages.newSequence(['3','2','1','GO!',''],1000)
    setTimeout( ()=> ghosts.forEach(ghost => ghost.startMoving()), 3000)
    setTimeout( ()=> pacman.restart(), 3000)
  }
  initiateWin(){
    //check that we havent already lost the game
    if(game.lost) return
    //freeze the ghosts in place
    ghosts.forEach(ghost => ghost.stopMoving())
    messages.newSingle('Level Complete')
  }
  initiateLoss(){
    //check that we havent already lost the game
    if(game.lost) return
    //ensure pacman is dead
    pacman.death()
    scoreboard.updateLives(-1)
    //if there are more lives to lose, freeze the ghosts in place, otherwise they should endlessly move
    if(scoreboard.lives > 0){
      ghosts.forEach(ghost => ghost.stopMoving())
    } else {
      messages.newSingle('Game over')
      game.lost = true
    }
  }
  pillEaten(index){
    this.squares[index].classList.add('eaten')
    scoreboard.up()
    this.pillsRemaining--
    if (this.pillsRemaining === 0) this.initiateWin()
  }
  removeSprite(spriteClass, spriteIndex){
    //for the first step, there will not be an old sprite to remove
    if(!spriteIndex) return
    this.squares[spriteIndex].classList.remove(spriteClass, `${spriteClass}-left`, `${spriteClass}-right`, `${spriteClass}-up`, `${spriteClass}-down`)
  }
  addSprite(spriteClass, spriteIndex, spriteVariant, spriteVariant2){
    this.squares[spriteIndex].classList.add(spriteClass, spriteVariant)
    if(spriteVariant2) this.squares[spriteIndex].classList.add(spriteVariant2)
  }
  paintGrid(){
    //create the grid with width*width number of squares
    for (let i = 0; i < this.gridWidth * this.gridWidth; i++) {
      const square = document.createElement('div')
      square.classList.add('grid-item')
      //square.classList.add(`index${i}`)
      square.addEventListener('click', e => e.target.classList.toggle('wall'))
      this.squares.push(square)
      this.grid.append(square)
    }
  }
  paintDecoration(){
    this.walls.forEach(wall => this.squares[wall].classList.add('wall'))
    this.prison.forEach(cell => this.squares[cell].classList.add('prison'))
    this.squares.forEach( (cell, index) => {
      //if there is only 1 class defined, we know its grid-item, therefore it is an empty cell
      if(this.squares[index].classList.length === 1) {
        this.squares[index].classList.add('pill')
        this.squares[index].innerHTML = '<i class="fas fa-dot-circle"></i>'
        this.totalPills++
      }
    })
    this.pillsRemaining = this.totalPills
  }
  createWallArray(){
    const wallSquares = this.squares.reduce( (total,square,index) => {
      return square.classList.contains('wall') ? total.concat(index) : total //include it if there is a wall class
    },[])
    return wallSquares.toString().replace(/,/g,', ')
  }
}

class ScoreboardDefinition{
  constructor(scoreboardClass){
    this.score = 0
    this.highScore = 0
    this.lives = 3
    this.gameLost = false
    this.boardElement = document.querySelector(scoreboardClass)
    this.scoreElement = this.boardElement.querySelector('.score')
    this.livesElement = this.boardElement.querySelector('.lives')
    this.collectedElement = this.boardElement.querySelector('.collected')
    this.scoreElement.innerText = `Score ${this.score}`
    this.updateLives()
    this.collectedElement.innerText = 'Collected'
  }
  up(){
    this.score++
    this.scoreElement.innerText = `Score ${this.score}`
    //added in some high score functionality
    if (this.score > this.highScore) this.highScore = this.score
  }
  reset(){
    this.score = 0
    this.element.innerText = this.score
  }
  updateLives(change){
    if(change) this.lives += parseInt(change)
    this.livesElement.innerHTML = ''
    for (let i = 0; i < this.lives; i++) {
      const life = document.createElement('div')
      life.classList.add('pacman', 'grid-item')
      this.livesElement.append(life)
    }
  }
}

class MessageBar{
  constructor(messageBarClass){
    this.element = document.querySelector(messageBarClass)
  }
  newSequence(messages,timeBetween){
    messages.forEach( (message, index) => {
      setTimeout( () => this.newSingle(message), timeBetween * (index+1))
    })
  }
  newSingle(message){
    this.element.innerHTML = ''
    const childDiv = document.createElement('div')
    childDiv.innerText = message
    childDiv.classList.add('message')
    this.element.append(childDiv)
  }
}
