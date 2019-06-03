const width = 18
const squares = []
let pacman = null
const ghosts = []
let gameLost = false

const walls = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 35, 38, 39, 41, 42, 43, 46, 47, 48, 50, 51, 54, 57, 59, 61, 64, 66, 68, 71, 72, 73, 74, 75, 79, 82, 86, 87, 88, 89, 90, 95, 102, 107, 108, 110, 111, 113, 114, 116, 117, 119, 120, 122, 123, 125, 144, 145, 146, 147, 148, 149, 150, 151, 152, 153, 154, 155, 156, 157, 158, 159, 160, 161, 168, 169, 170, 171, 172, 173, 180, 182, 183, 184, 186, 187, 188, 189, 190, 191, 193, 194, 195, 197, 198, 204, 205, 208, 209, 215, 216, 218, 219, 220, 229, 230, 231, 233, 234, 242, 243, 251, 252, 254, 255, 256, 258, 259, 260, 261, 262, 263, 265, 266, 267, 269, 270, 273, 278, 279, 284, 287, 288, 294, 299, 305, 306, 307, 308, 309, 310, 311, 312, 313, 314, 315, 316, 317, 318, 319, 320, 321, 322, 323]

const prison = [169, 170, 171, 172, 187, 188, 189, 190]



function paintDecoration(){
  walls.forEach(wall => squares[wall].classList.add('wall'))
  prison.forEach(cell => squares[cell].classList.add('prison'))
  squares.forEach( (cell, index) => {
    //if there is only 1 class defined, we know its grid-item, therefore it is an empty cell
    if(squares[index].classList.length === 1) {
      squares[index].classList.add('pill')
      squares[index].innerHTML = '<i class="fas fa-dot-circle"></i>'
    }
  })
}

function createWallArray(){
  const wallSquares = squares.reduce( (total,square,index) => {
    return square.classList.contains('wall') ? total.concat(index) : total //include it if there is a wall class
  },[])
  return wallSquares.toString().replace(/,/g,', ')
}

function init() {
  //grab the parent div for the Grid
  const grid = document.querySelector('.grid')

  //create the grid with width*width number of squares
  for (let i = 0; i < width * width; i++) {
    const square = document.createElement('div')
    square.classList.add('grid-item')
    //square.innerText = i
    square.addEventListener('click', e => e.target.classList.toggle('wall'))
    squares.push(square)
    grid.append(square)
  }


  pacman = new Player('pacman',135)
  ghosts.push(new Ghost('binky',206))
  ghosts.push(new Ghost('pinky',207))
  ghosts.forEach(ghost => ghost.startMoving())
  paintDecoration()
  window.addEventListener('keydown',handleKeyDown)
}

function handleKeyDown(e){
  //dont do anything if the game is already lost
  if(gameLost) return
  //apply the new direction into pacmans direction parameter so it can be picked up next interval
  switch (e.key) {
    case 'ArrowRight':
      pacman.direction = rightMove(pacman.location) ? 'right' : pacman.direction
      break
    case 'ArrowLeft':
      pacman.direction = leftMove(pacman.location) ? 'left' : pacman.direction
      break
    case 'ArrowUp':
      pacman.direction = upMove(pacman.location) ? 'up' : pacman.direction
      break
    case 'ArrowDown':
      pacman.direction = downMove(pacman.location) ? 'down' : pacman.direction
      break
  }
  if(!pacman.intId && pacman.direction) pacman.startMoving()
}

function rightMove(currentSquare){
  if(currentSquare % width === width - 1) return currentSquare - width + 1 //returns the square at the start of the row
  if(squares[currentSquare + 1].classList.contains('wall')) return null //no move if the square is a wall
  return currentSquare + 1
}
function leftMove(currentSquare){
  if(currentSquare % width === 0) return currentSquare + width - 1
  if(squares[currentSquare - 1].classList.contains('wall')) return null //no move if the square is a wall
  return currentSquare - 1
}
function upMove(currentSquare){
  if(currentSquare - width < 0) return currentSquare -= width
  if(squares[currentSquare - width].classList.contains('wall')) return null //no move if the square is a wall
  return currentSquare - width
}
function downMove(currentSquare){
  if(currentSquare + width > width * width) return currentSquare += width
  if(squares[currentSquare + width].classList.contains('wall')) return null //no move if the square is a wall
  return currentSquare + width
}

function initiateLoss(){
  ghosts.forEach(ghost => ghost.stopMoving())
  pacman.death()
  gameLost = true
  //TODO further loss functionality, scoreboard, message etc
}

function moveSprite(spriteClass, spriteIndex, spriteVariant, spriteVariant2){
  squares.forEach(square => {
    if(square.classList.contains(spriteClass))
      square.classList.remove(spriteClass, 'right', 'left', 'up', 'down')
  })
  squares[spriteIndex].classList.add(spriteClass, spriteVariant)
  if(spriteVariant2) squares[spriteIndex].classList.add(spriteVariant2)
}

window.addEventListener('DOMContentLoaded', init)

class Player {
  constructor(name,index){
    this.location = index
    this.name = name
    this.intId = null
    this.direction = null
    this.availableMoves = {}
    this.dead = false
    moveSprite(this.name, this.location, 'start')
  }
  startMoving(){
    //dont allow pacman to move if he is dead
    if(this.dead) return
    //dont allow to start moving if there is already a timer running
    if(!this.intId){
      this.intId = setInterval( ()=> this.move(), 300)
      this.move()
    }
  }
  stopMoving(){
    clearInterval(this.intId)
    this.intId = null
  }
  move(){
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
    if(!this.dead) moveSprite('pacman', this.location, pacman.direction)
  }
  checkDead(){
    ghosts.forEach(ghost => {
      if(ghost.square === this.location){
        initiateLoss()
      }
    })
  }
  death(){
    this.stopMoving()
    this.dead = true
    //the location has now changed due to the move logic, when compared to the DOM, so we cant use moveSprite to add the death class to pacman. Instead we can loop through the squares and apply the class
    squares.forEach(square => square.classList.contains('pacman') ? square.classList.add('dead') : false)
  }
}


class Ghost{
  constructor(name,square){
    this.name = name
    this.square = square
    this.bias = []
    this.allDirections = ['up','right','down','left']
    this.direction = null
    this.intId = null
    this.stepCounter = 0
    this.stepHistory = []
    this.availableMoves = {}
    this.mode = {}
    this.killer = false
  }
  startMoving(){
    if(!this.intId){
      this.intId = setInterval( ()=>this.move(), 700)
      moveSprite(this.name,this.square,'right')
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
    const pacmanColumn = pacman.location%width
    const pacmanRow = Math.floor(pacman.location/width)
    const ghostColumn = this.square%width
    const ghostRow = Math.floor(this.square/width)
    const horizontalDifference = ghostColumn-pacmanColumn
    const rowDifferential = ghostRow-pacmanRow
    //wipe the bias to recalculate it, and only add the direction to the bias if it is not zero. Add either left/right because the column (horizontal) difference is greater. Add either up/down because the row (vertical) difference is greater
    this.bias = []
    if (horizontalDifference > 0) this.bias.push('left')
    if (horizontalDifference < 0) this.bias.push('right')
    if (rowDifferential > 0) this.bias.push('up')
    if (rowDifferential < 0) this.bias.push('down')
  }
  move(){
    //increase the move stepCounter
    this.stepCounter++

    // generate the direction bias to influence the direction of travel, and work out what the available moves are
    this.calcDirectionBias()
    this.calcAvailableMoves()

    //understand if we are in a special mode of operation, run the appropriate method
    let newSquare = null
    switch(this.calcMode()) {
      case 'obstacle':
        newSquare = this.obstacleModeMove()
        break
      default:
        newSquare = this.noModeMove()
    }

    //check we made a choice, then make the move and apply to the object parameters
    if(newSquare){
      //identify the new direction based on the newSquare variable
      this.direction = Object.keys(this.availableMoves).filter(direction => this.availableMoves[direction] === newSquare )[0]
      //apply the new square
      this.square = newSquare
      //console.log('Chose:', this.direction, this.square)
      //add the square to the loaction history
      this.addStep(this.square)
      // check to see if that move killed pacman
      if(this.killedPacman()){
        initiateLoss()
      } else {
        //move to the square, by moving the sprite
        moveSprite(this.name, this.square, 'right')
      }
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
    let anticlockwiseDirections = []
    if (this.direction === 'down') anticlockwiseDirections = ['right','down','left','up']
    if (this.direction === 'right') anticlockwiseDirections = ['up','right','down','left']
    if (this.direction === 'up') anticlockwiseDirections = ['left','up','right','down']
    if (this.direction === 'left') anticlockwiseDirections = ['down','left','up','right']

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
  killedPacman(){
    this.killer = this.square === pacman.location
    return this.killer
  }
  oppositeDirection(direction){
    switch(direction){
      case 'up': return 'down'
      case 'down': return 'up'
      case 'left': return 'right'
      case 'right': return 'left'
    }
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
