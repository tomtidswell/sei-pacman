const width = 18
const squares = []
let pacman = null
let binky = null
let pinky = null
let gameLost = false

const walls = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 35, 38, 39, 41, 42, 43, 46, 47, 48, 50, 51, 54, 57, 59, 61, 64, 66, 68, 71, 72, 73, 74, 75, 79, 82, 86, 87, 88, 89, 90, 95, 102, 107, 108, 110, 111, 113, 114, 116, 117, 119, 120, 122, 123, 125, 144, 145, 146, 148, 149, 150, 151, 152, 153, 154, 155, 156, 157, 159, 160, 161, 168, 169, 170, 171, 172, 173, 180, 182, 183, 184, 186, 187, 188, 189, 190, 191, 193, 194, 195, 197, 198, 204, 205, 208, 209, 215, 216, 218, 219, 220, 229, 230, 231, 233, 234, 242, 243, 251, 252, 254, 255, 256, 258, 259, 260, 261, 262, 263, 265, 266, 267, 269, 270, 273, 278, 279, 284, 287, 288, 294, 299, 305, 306, 307, 308, 309, 310, 311, 312, 313, 314, 315, 316, 317, 318, 319, 320, 321, 322, 323]

const prison = [169, 170, 171, 172, 187, 188, 189, 190]

function paintDecoration(){
  walls.forEach(wall => squares[wall].classList.add('wall'))
  prison.forEach(cell => squares[cell].classList.add('prison'))
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
    square.innerText = i
    square.addEventListener('click', e => e.target.classList.toggle('wall'))
    squares.push(square)
    grid.append(square)
  }

  window.addEventListener('keydown',handleKeyDown)
  paintDecoration()
  pacman = new Player('pacman',135)
  binky = new Ghost('binky',206)
  pinky = new Ghost('pinky',207)
  binky.startMoving()
  pinky.startMoving()
  //squares[pacman.location].classList.add('pacman', 'right')
}

function handleKeyDown(e){
  //dont do anything if the game is already lost
  if(gameLost) return
  //apply the new direction into pacmans direction parameter so it can be picked up next interval
  switch (e.key) {
    case 'ArrowRight':
      pacman.direction = rightMove(pacman.location) ? 'right' : pacman.direction
      console.log('now travelling right')
      break
    case 'ArrowLeft':
      pacman.direction = leftMove(pacman.location) ? 'left' : pacman.direction
      console.log('now travelling left')
      break
    case 'ArrowUp':
      pacman.direction = upMove(pacman.location) ? 'up' : pacman.direction
      console.log('now travelling up')
      break
    case 'ArrowDown':
      pacman.direction = downMove(pacman.location) ? 'down' : pacman.direction
      console.log('now travelling down')
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
  pacman.stopMoving()
  pinky.stopMoving()
  binky.stopMoving()
}



function moveSprite(spriteClass, spriteIndex, spriteVariant){
  //console.log('moving', spriteClass)
  squares.forEach(square => {
    if(square.classList.contains(spriteClass))
      square.classList.remove(spriteClass, 'right', 'left', 'up', 'down')
  })
  squares[spriteIndex].classList.add(spriteClass, spriteVariant)
}

window.addEventListener('DOMContentLoaded', init)

class Player {
  constructor(name,index){
    this.location = index
    this.name = name
    this.intId = null
    this.direction = null
    this.availableMoves = {}
    this.isDead = false
    moveSprite(this.name, this.location, 'start')
  }
  startMoving(){
    if(!this.intId){
      this.intId = setInterval( ()=>this.move(), 300)
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
      case 'right':
        if (this.availableMoves.right){
          moveSprite('pacman',this.availableMoves.right,pacman.direction)
          this.location = this.availableMoves.right
        }
        break
      case 'left':
        if (this.availableMoves.left){
          moveSprite('pacman',this.availableMoves.left,pacman.direction)
          this.location = this.availableMoves.left
        }
        break
      case 'up':
        if (this.availableMoves.up){
          moveSprite('pacman',this.availableMoves.up,pacman.direction)
          this.location = this.availableMoves.up
        }
        break
      case 'down':
        if (this.availableMoves.down){
          moveSprite('pacman',this.availableMoves.down,pacman.direction)
          this.location = this.availableMoves.down
        }
        break
    }
  }
}


class Ghost{
  constructor(name,square){
    this.name = name
    this.square = square
    this.bias = ['up','down','left','right']
    this.biasMultiplier = null
    this.allDirections = ['up','down','left','right']
    this.intId = null
    this.availableMoves = {}
  }
  startMoving(){
    if(!this.intId){
      this.intId = setInterval( ()=>this.move(), 1000)
    }
    this.move()
  }
  stopMoving(){
    clearInterval(this.intId)
    this.intId = null
  }
  calcDirectionBias(newDirections){
    //const allDirections = ['Up','Down','Left','Right']
    //if provided, set the directions to the newDirections array
    if (newDirections) {
      this.bias = newDirections
      return
    }
    //work out how far away the ghost is from pacman
    const pacmanColumn = pacman.location%width
    const pacmanRow = Math.floor(pacman.location/width)
    const ghostColumn = this.square%width
    const ghostRow = Math.floor(this.square/width)
    const columnDifferential = ghostColumn-pacmanColumn
    const rowDifferential = ghostRow-pacmanRow
    this.biasMultiplier = []
    //console.log('Pacman coords:', pacman.location, pacmanColumn, pacmanRow)
    //console.log('My coords:', this.square, ghostColumn, ghostRow)
    //console.log('Coord differential:', this.square-pacman.location, columnDifferential, rowDifferential)
    if(Math.abs(columnDifferential) > width/3) console.log(`${this.name}: I'm a long way horizontally`)
    if(Math.abs(rowDifferential) > width/2) console.log(`${this.name}: I'm a long way vertically`)
    //now determine which coordinate is largest in order to remove that direction from the available directions of travel. Use Math.abs() to convert - to +
    if(Math.abs(columnDifferential) > Math.abs(rowDifferential)){
      //remove either left/right because the column (horizontal) difference is greater
      if (columnDifferential > 0){
        // remove right and duplicate left if pacman is a long way away, to increase the likelihood of moving in that direction
        this.bias = this.allDirections.filter( dir => dir !== 'right')
        if(Math.abs(columnDifferential) > width/3) this.biasMultiplier.push('left')
      } else {
        // remove left and duplicate right if pacman is a long way away, to increase the likelihood of moving in that direction
        this.bias = this.allDirections.filter( dir => dir !== 'left')
        if(Math.abs(columnDifferential) > width/3) this.biasMultiplier.push('right')
      }
    } else {
      //remove either up/down because the row (vertical) difference is greater
      if (rowDifferential > 0){
        // remove down and duplicate up if pacman is a long way away, to increase the likelihood of moving in that direction
        this.bias = this.allDirections.filter( dir => dir !== 'down')
        if(Math.abs(rowDifferential) > width/3) this.biasMultiplier.push('up')
      } else {
        // remove up and duplicate down if pacman is a long way away, to increase the likelihood of moving in that direction
        this.bias = this.allDirections.filter( dir => dir !== 'up')
        if(Math.abs(rowDifferential) > width/3) this.biasMultiplier.push('down')
      }
    }
  }
  move(){
    //first generate a new direction bias to influence the direction of travel
    this.calcDirectionBias()

    //add the potential moves into the object
    this.availableMoves.right = rightMove(this.square)
    this.availableMoves.left = leftMove(this.square)
    this.availableMoves.up = upMove(this.square)
    this.availableMoves.down = downMove(this.square)

    const possibleMoves = []
    //add into the array the moves that are possible, and included in the bias
    this.allDirections.forEach(direction => {
      if(this.availableMoves[direction] && this.bias.includes(direction)){
        possibleMoves.push(direction)
      }
    })

    //if there is no square that it is possible to move into, stay still, if there is, choose from the list randomly
    if(possibleMoves.length === 0){
      //stay still
      console.log(`${this.name}: I'm better off where I am. I'm staying put.`)
    } else {
      //move to the best square, by assigning the new square and then moving the sprite
      //console.log('possible:',possibleMoves, 'bias:',this.bias)
      this.square = this.availableMoves[possibleMoves[Math.floor(Math.random()*possibleMoves.length)]]
      moveSprite(this.name,this.square,'right')
    }
    //finally check to see if that move killed pacman
    if(this.killedPacman()) initiateLoss()
  }
  killedPacman(){
    return this.square === pacman.location
  }
}
