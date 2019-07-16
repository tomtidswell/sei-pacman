// TODO
// Add fruit/sweeties which can be collected
// Add clockwise logic for ghosts
// Allow level progression

const ghosts = []
let pacman = null
let scoreboard = null
let messages = null
let game = null

//TODO - auto level progression
const levelData = [
  //Level 0 - This is a medium difficulty level
  {
    name: 'level0',
    prison: [160, 161, 162, 177, 178, 179],
    bigPills: [53, 65, 225, 233],
    walls: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 33, 36, 37, 39, 40, 41, 43, 44, 45, 47, 48, 51, 54, 56, 58, 60, 62, 64, 67, 68, 69, 70, 71, 75, 77, 81, 82, 83, 84, 85, 90, 96, 101, 102, 104, 105, 107, 108, 110, 112, 113, 115, 116, 118, 136, 137, 138, 140, 141, 142, 143, 144, 145, 146, 147, 148, 150, 151, 152, 159, 163, 170, 172, 173, 174, 176, 180, 182, 183, 184, 186, 187, 193, 194, 196, 197, 203, 204, 206, 207, 208, 216, 217, 218, 220, 221, 224, 229, 234, 237, 238, 239, 241, 242, 244, 245, 246, 247, 248, 250, 251, 253, 254, 255, 271, 272, 273, 274, 275, 276, 277, 278, 279, 280, 281, 282, 283, 284, 285, 286, 287, 288]
  },
  //Level 1 - this is a pretty hard level!!!!
  {
    name: 'level1',
    prison: [160, 161, 162, 177, 178, 179],
    bigPills: [53, 65, 225, 233],
    walls: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 33, 34, 36, 37, 38, 40, 41, 43, 44, 46, 47, 48, 50, 51, 55, 58, 60, 63, 67, 68, 70, 72, 75, 77, 80, 82, 84, 85, 86, 87, 99, 100, 101, 102, 103, 104, 106, 107, 108, 109, 110, 111, 112, 113, 114, 116, 117, 118, 119, 120, 121, 133, 134, 135, 140, 141, 142, 143, 144, 145, 146, 147, 148, 153, 154, 155, 159, 163, 167, 168, 169, 170, 171, 172, 174, 175, 176, 180, 181, 182, 184, 185, 186, 187, 188, 189, 193, 194, 196, 197, 201, 202, 203, 204, 205, 206, 207, 217, 218, 219, 220, 221, 227, 228, 229, 230, 231, 237, 238, 239, 240, 241, 243, 244, 248, 249, 251, 252, 253, 254, 255, 271, 272, 273, 274, 275, 276, 277, 278, 279, 280, 281, 282, 283, 284, 285, 286, 287, 288]
  }
]

window.addEventListener('DOMContentLoaded', ()=>{
  //begin the initialisation once fonts have loaded
  document.fonts.ready.then(()=> init())
})


function init() {
  document.querySelector('body').classList.add('ready')
  game = new GameDefinition('.grid', 17, levelData)
  pacman = new Player('pacman',127)
  ghosts.push(new Ghost('binky',160,53,2))
  ghosts.push(new Ghost('pinky',162,65,6))
  ghosts.push(new Ghost('stinky',177,240,10))
  ghosts.push(new Ghost('clyde',179,252,14))
  game.paintDecoration() //draw the decorations once we initialised the sprites
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
}

// Move rules:
// 1. Can not move into a wall tile
// 2. Can not move up into a prison tile, but can move left/down/right into a prison tile

function rightMove(currentSquare){
  if(currentSquare % game.gridWidth === game.gridWidth - 1) return currentSquare - game.gridWidth + 1 //returns the square at the start of the row
  if(game.squares[currentSquare + 1].classList.contains('wall')) return null //no move if the square is a wall
  return currentSquare + 1
}
function leftMove(currentSquare){
  if(currentSquare % game.gridWidth === 0) return currentSquare + game.gridWidth - 1
  if(game.squares[currentSquare - 1].classList.contains('wall')) return null //no move if the square is a wall
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
  return currentSquare + game.gridWidth
}


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
    game.addSprite(this.name, this.location, `${this.name}-${this.direction}`)
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
    //if the square contains a big pill and its not already been eaten
    if(game.squares[this.location].classList.contains('big-pill') && !game.squares[this.location].classList.contains('eaten')) game.bigPillEaten(this.location)
  }
  checkDead(){
    //if pacman is already dead, we dont need to check it again
    if(this.dead) return
    //check if pacman is on the same square as a ghost
    ghosts.forEach(ghost => {
      //if pacman is on the same square as a ghost, he should die
      if(ghost.square.current === this.location && ghost.bias.inverted === 0) this.death()
      //if pacman hasnt eaten a big pill and is on the same square, the ghost should die
      if(ghost.square.current === this.location && ghost.bias.inverted > 0){
        scoreboard.up(100)
        ghost.resetPosition()
      }
    })
  }
  reset(){
    if(game.lost) return
    this.dead = false
    pacman.movable = true
    this.location = this.startSquare
    this.direction = null
    game.addSprite(this.name, this.location, 'start')
  }
  death(){
    //if pacman is already dead, we dont need to run this routine again
    if(this.dead) return
    //stop movement if pacman has lives left
    this.dead = true
    game.initiateLoss('pacman')
    //apply the class, and then remove pacman after a timeout, to allow the animation to run. Pacman can die either at this.location or at this.previousLocation
    game.squares[this.location].classList.add('dead')
    if(this.previousLocation) game.squares[this.previousLocation].classList.add('dead')
    setTimeout( ()=> {
      game.squares[this.location].classList.remove('pacman', 'pacman-up', 'pacman-down', 'pacman-left', 'pacman-right', 'dead')
      if(this.previousLocation) game.squares[this.previousLocation].classList.remove('pacman', 'pacman-up', 'pacman-down', 'pacman-left', 'pacman-right', 'dead')
    }, 2000)
  }
}

class Ghost{
  constructor(name, square, homeSquare, startOnClock){
    this.name = name
    this.square = { current: square, start: square, history: [], home: homeSquare }
    this.bias = { directions: [], inverted: 0, targetName: '', targetLocation: '' }
    this.allDirections = ['up','right','down','left']
    this.startDirection = 'left'
    this.direction = this.startDirection
    this.stepCounter = 0
    this.availableMoves = {}
    this.mode = {}
    this.killedPacman = false
    this.startOnClock = startOnClock
  }
  clearSprite(location){
    game.removeSprite(this.name, location)
  }
  resetPosition(){
    //reset the position of the ghost, set a default direction and add the start square to the history
    this.bias.inverted = 0
    this.killedPacman = false
    this.square.current = this.square.start
    this.direction = this.startDirection
    this.addStep(this.square.current)
    //start the ghost with a target to navigate out of the prison
    this.bias.targetName = 'prison-exit'
    this.bias.targetLocation = 212
    //remove the most recent step - where the ghost is currently located
    if(this.square.history[1]){
      this.clearSprite(this.square.history[1])
    }
    //draw the ghost in its new position
    game.addSprite(this.name, this.square.current, `${this.name}-${this.direction}`)
  }
  calcAvailableMoves(){
    this.availableMoves.right = rightMove(this.square.current)
    this.availableMoves.left = leftMove(this.square.current)
    this.availableMoves.up = upMove(this.square.current)
    this.availableMoves.down = downMove(this.square.current)
  }
  calcTarget(){
    const theTarget = this.bias.targetName
    switch (theTarget) {
      case 'prison-exit':
        //if we reached the target, reset it to pacman
        if(this.square.current === this.bias.targetLocation){
          this.bias.targetName = 'pacman'
          this.bias.targetLocation = pacman.location
        }
        break
      case 'home-area':
        this.bias.targetLocation = this.square.home
        //if we reached the target, reset it to pacman
        if(this.square.current === this.bias.targetLocation){
          this.bias.targetName = 'pacman'
          this.bias.targetLocation = pacman.location
        }
        break
      case 'pacman':
        //update pacman's location
        this.bias.targetLocation = pacman.location
        break
      default:
        //as a safety, set pacman back to be the target
        this.bias.targetName = 'pacman'
        this.bias.targetLocation = pacman.location
    }
    if(theTarget !== this.bias.targetName) console.log(`${this.name} switched target from ${theTarget} to ${this.bias.targetName}`)
  }
  calcDirectionBias(){
    //work out how far away the ghost is from the target (pacman, home-area or prison-exit)
    const targetColumn = this.bias.targetLocation % game.gridWidth
    const targetRow = Math.floor(this.bias.targetLocation / game.gridWidth)
    const ghostColumn = this.square.current % game.gridWidth
    const ghostRow = Math.floor(this.square.current / game.gridWidth)
    const horizontalDifference = ghostColumn - targetColumn
    const rowDifferential = ghostRow - targetRow
    //wipe the bias to recalculate it, and only add the direction to the bias if it is not zero. Add either left/right because the column (horizontal) difference is greater. Add either up/down because the row (vertical) difference is greater
    this.bias.directions = []
    if (horizontalDifference > 0) this.bias.directions.push('left')
    if (horizontalDifference < 0) this.bias.directions.push('right')
    if (rowDifferential > 0) this.bias.directions.push('up')
    if (rowDifferential < 0) this.bias.directions.push('down')
  }
  checkBiasInversion(){
    if(this.bias.inverted > 0){
      const newDirections = []
      this.bias.directions.forEach(direction => newDirections.push(this.oppositeDirection(direction)))
      this.bias.directions = newDirections
      if(this.bias.inverted === 1) console.log(`${this.name} is now switching back to attacking pacman (ending bias inversion)`)
      this.bias.inverted--
    }
  }
  specialSprite(){
    //bias inversion lasts for 30 turns - when there are only 10 left, signal that it is ending by changing the sprite
    if(this.bias.inverted > 10) return `${this.name}-pilled`
    if(this.bias.inverted > 0) return `${this.name}-pilled-ending`
    return null
  }
  move(forcedLocation){
    //only move if the game clock is after the ghost's startOnClock
    if(game.clock < this.startOnClock) return

    //set the newSquare to be the forced location only if one is passed in otherwise initialise it
    let newSquare = forcedLocation ? forcedLocation : null
    //increase the move stepCounter
    this.stepCounter++

    // generate the direction bias to influence the direction of travel, and work out what the available moves are
    this.calcTarget()
    this.calcDirectionBias()
    this.checkBiasInversion() //when a big pill has been eaten
    this.calcAvailableMoves()


    //understand if we are in a special mode of movement, run the appropriate method
    if(!newSquare){
      switch(this.calcMode()) {
        case 'obstacle':
          newSquare = this.obstacleModeMove()
          break
        default:
          newSquare = this.noModeMove()
      }
    }

    //check to see if this newSquare will kill pacman - if it will, stop play. It returns a revised newSquare value just in case pacman killed the ghost
    newSquare = this.pacmanInteraction(newSquare)
    if(this.killedPacman){
      game.initiateLoss(this.name)
    }

    //if we didnt kill pacman, check we made a choice, then make the move and apply to the object parameters, but only if pacman is alive. If he's dead, dont move there because it will ruin the death animation
    if(newSquare && !this.killedPacman){
      //identify the new direction based on the newSquare variable
      this.direction = Object.keys(this.availableMoves).filter(direction => this.availableMoves[direction] === newSquare )[0]
      //as a backup, use the start direction in case the chosen move isnt available (warping back to the prison may cause this)
      if(!this.direction) this.direction = this.startDirection
      //apply the new square
      this.square.current = newSquare
      //console.log('Chose:', this.direction, this.square)
      //add the square to the loaction history
      this.addStep(this.square.current)

      //move to the square, by moving the sprite
      game.addSprite(this.name, this.square.current, `${this.name}-${this.direction}`, this.specialSprite())
      //we just added the new location to the history, remove the old sprite from history position #1
      this.clearSprite(this.square.history[1])
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
      const biasJcnDirections = crossroads.filter(direction => this.bias.directions.includes(direction))
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
    if(!newSquare && crossroads.length === 1 && this.bias.directions.includes(this.oppositeDirection(crossroads[0]))){
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
    const directionPreferenceOrder = this.anticlockwiseDirections(this.direction)

    //the array items are listed in anticlockwise order, so find the first index that is allowed
    const preferredDirection = directionPreferenceOrder.find(direction => this.availableMoves[direction])
    //console.log('Obstacle navigation chose:', direction)
    return this.availableMoves[preferredDirection]
  }
  addStep(step){
    //add the new step to the start of the history, and see if we have more than 4 steps recorded
    this.square.history.unshift(step)
    while(this.square.history.length > 4){
      this.square.history.pop()
    }
  }
  pacmanInteraction(index){
    let revisedIndex = index
    //will kill pacman if he is on the same square, and the bias is not inverted
    if(game.squares[index].classList.contains('pacman') && this.bias.inverted === 0){
      this.killedPacman = true
    }
    //if the bias is inverted and pacman is on this square, gain 100 points and fly back to the prison
    if(this.bias.inverted > 0 && game.squares[index].classList.contains('pacman')){
      this.resetPosition()
      revisedIndex = this.square.current //reset position changed this.square.current to the start position
      scoreboard.up(100)
    }
    return revisedIndex
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
      console.log(`${this.name} is ending ${this.mode.name} mode`)
      this.mode = {}
    }
    //if there is a mode active, return the name of it
    return this.mode.name
  }
  modeSwitch(mode){
    //if there isnt a mode in operation, set it to the new mode, and record the step number
    if(!this.mode.name){
      console.log(`${this.name} is starting ${mode} mode`)
      this.mode.name = mode
      this.mode.started = this.stepCounter
      this.mode.ends = this.stepCounter + 3
    }
    //TODO: future modes
    //case 'poison': this.mode = 'poison'
  }
}

class GameDefinition{
  constructor(gridClass, gridWidth, levelData){
    this.gridClass = gridClass
    this.grid = document.querySelector(this.gridClass)
    this.gridWidth = gridWidth
    this.levelData = levelData
    //this.levelId = level
    //this.walls = walls
    //this.prison = prison
    //this.bigPills = bigPills
    this.currentLevel = 0
    this.squares = []
    this.lost = false
    this.roundLost = false
    this.totalPills = 0
    this.pillsRemaining = null
    this.clock = 0
    this.intId = null
    this.turnInterval = 500
    this.paintGrid()
    //this.paintDecoration()
  }
  startMovement(){
    //each game turn runs the eachMove function
    if(!this.intId) this.intId = setInterval( ()=> this.eachMove() , this.turnInterval)
  }
  stopMovement(){
    clearInterval(this.intId)
    this.intId = null
    //make sure pacman isnt movable
    pacman.movable = false
    //reset the movement direction so it doesnt start moving when resumed for the next round
    pacman.direction = null
  }
  eachMove(){
    //this code is run for each game 'turn' - pacman and the ghosts are moved, the clock advanced, and a decision is made about what target mode the ghosts should operate in

    //GAME
    this.clock++
    //console.log(this.clock)

    //if pacman is dead but there are more lives remaining, skip the chance for the ghosts to move
    if(pacman.dead && scoreboard.lives > 0) return

    //PACMAN - pacman could die on his turn, and before the ghosts' turns so we need to check before they run
    pacman.move()
    if(pacman.dead){
      this.initiateLoss('post-pacman move logic')
    }

    //if pacman is dead but there are more lives remaining, skip the chance for the ghosts to move
    if(pacman.dead && scoreboard.lives > 0) return

    //GHOSTS - the switch targets is a game wide setting that determines if the ghosts target pacman or their home area (each quarter of the grid homes one ghost)
    this.switchGhostTargets()
    ghosts.forEach(ghost => ghost.move())
    if(pacman.dead){
      this.initiateLoss('post ghost move logic')
    }
  }
  switchGhostTargets(){
    //this mechanism should make the ghosts switch to target the four corners instead of pacman, but this should only last for 20 turns
    const shouldTargetHome = [40,80].includes(this.clock)
    const shouldTargetPacman = [60,100].includes(this.clock) //resets the target to pacman
    //if the current target is pacman, and we should be navigating home this turn, switch target
    if(shouldTargetHome) {
      console.log('All ghosts targetting home')
      ghosts.filter(ghost => ghost.bias.targetName === 'pacman').forEach(ghost => ghost.bias.targetName = 'home-area')
    }
    if(shouldTargetPacman) {
      console.log('All ghosts targetting pacman')
      ghosts.filter(ghost => ghost.bias.targetName === 'home-area').forEach(ghost => ghost.bias.targetName = 'pacman')
    }
  }
  startRound(){
    //reset the round variables
    this.clock = 0
    this.roundLost = false
    //reset the sprites
    pacman.reset()
    ghosts.forEach(ghost => ghost.resetPosition())
    messages.newSequence(['3','2','1','GO!',''],1000)
    setTimeout( ()=> this.startMovement(), 3000)
  }
  initiateWin(){
    //check that we havent already lost the game, or the round
    if(this.lost) return
    if(this.roundLost) return
    this.stopMovement()
    messages.newSingle('Level Complete')
  }
  initiateLoss(lossTrigger){
    //check that we havent already lost the game, or this round
    if(this.lost) return
    if(this.roundLost) return

    //set that the round has been lost
    this.roundLost = true

    console.log('Loss trigger:',lossTrigger)
    //ensure pacman is dead
    pacman.death()
    scoreboard.updateLives(-1)
    //if there are no more lives to lose set the game to lost, and signal game over. If there are more lives to lose, stop the ghosts from moving
    if(scoreboard.lives === 0){
      messages.newSingle('Game over')
      this.lost = true
    } else {
      this.stopMovement()
      messages.newSingle('Life lost - Press space to continue', 'small')
    }
  }
  pillEaten(index){
    this.squares[index].classList.add('eaten')
    scoreboard.up(1)
    this.pillsRemaining--
    if (this.pillsRemaining === 0) this.initiateWin()
  }
  bigPillEaten(index){
    this.squares[index].classList.add('eaten')
    scoreboard.up(10)
    console.log('Starting bias inversion')
    //initiate bias inversion for 30 clock counts
    ghosts.forEach(ghost => ghost.bias.inverted = 30)
  }
  addSprite(spriteClass, spriteIndex, spriteVariant, spriteVariant2){
    this.squares[spriteIndex].classList.add(spriteClass, spriteVariant)
    if(spriteVariant2) this.squares[spriteIndex].classList.add(spriteVariant2)
  }
  removeSprite(spriteClass, spriteIndex){
    //for the first step, there will not be an old sprite to remove
    if(!spriteIndex) return
    this.squares[spriteIndex].classList.remove(spriteClass, `${spriteClass}-pilled`, `${spriteClass}-pilled-ending`, `${spriteClass}-left`, `${spriteClass}-right`, `${spriteClass}-up`, `${spriteClass}-down`)
  }
  paintGrid(){
    //create the grid with width*width number of squares
    this.grid.innerHTML = '<div class="message-overlay"></div>'
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
    this.levelData[this.currentLevel].walls.forEach(wall => this.squares[wall].classList.add('wall'))
    this.levelData[this.currentLevel].prison.forEach(cell => this.squares[cell].classList.add('prison'))
    this.levelData[this.currentLevel].bigPills.forEach(bigPill => {
      this.squares[bigPill].classList.add('big-pill')
      this.squares[bigPill].innerHTML = '<i class="far fa-dot-circle"></i>'
    })
    this.squares.forEach( (cell, index) => {
      //if there is only 1 class defined, we know its grid-item, therefore it is an empty cell
      if(this.squares[index].classList.length === 1) {
        this.squares[index].classList.add('pill')
        this.squares[index].classList.add('index'+index)
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
  up(newPoints){
    this.score = this.score + newPoints
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
    this.newSingle('press space to begin', 'small')
  }
  newSequence(messages,timeBetween){
    messages.forEach( (message, index) => {
      setTimeout( () => this.newSingle(message), timeBetween * (index+1))
    })
  }
  newSingle(message, size){
    this.element.innerHTML = ''
    const childDiv = document.createElement('div')
    childDiv.innerText = message
    childDiv.classList.add('message')
    if(size) childDiv.classList.add(size)
    this.element.append(childDiv)
  }
}
