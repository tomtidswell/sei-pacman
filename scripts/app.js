const width = 18
const squares = []
let binky = null
//const walls = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,92,93,94,95]
const walls = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 35, 38, 39, 41, 42, 43, 46, 47, 48, 50, 51, 54, 57, 59, 61, 64, 66, 68, 71, 72, 73, 74, 75, 79, 80, 81, 82, 86, 87, 88, 89, 90, 95, 98, 99, 102, 107, 108, 110, 111, 113, 114, 116, 117, 119, 120, 122, 123, 125, 144, 145, 146, 148, 149, 150, 151, 152, 153, 154, 155, 156, 157, 159, 160, 161, 168, 173, 180, 182, 183, 184, 186, 191, 193, 194, 195, 197, 198, 204, 205, 208, 209, 215, 216, 218, 219, 220, 229, 230, 231, 233, 234, 242, 243, 251, 252, 254, 255, 256, 258, 259, 260, 261, 262, 263, 265, 266, 267, 269, 270, 273, 278, 279, 284, 287, 288, 294, 299, 305, 306, 307, 308, 309, 310, 311, 312, 313, 314, 315, 316, 317, 318, 319, 320, 321, 322, 323]



let playerIndex = 135

function paintWalls(){
  walls.forEach(wall => squares[wall].classList.add('wall'))
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

  squares[playerIndex].classList.add('player')
  window.addEventListener('keydown',handleKeyDown)
  paintWalls()
  binky = new Ghost('Binky',190)
}

function handleKeyDown(e){
  let allowedMove = null
  switch (e.key) {
    case 'ArrowRight':
      allowedMove = rightMove(playerIndex)
      break
    case 'ArrowLeft':
      allowedMove = leftMove(playerIndex)
      break
    case 'ArrowUp':
      allowedMove = upMove(playerIndex)
      break
    case 'ArrowDown':
      allowedMove = downMove(playerIndex)
      break
    default:
      return
  }
  if(allowedMove) playerIndex = allowedMove
  moveSprite('player',playerIndex)
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

function createWallArray(){
  const wallSquares = squares.reduce( (total,square,index) => {
    return square.classList.contains('wall') ? total.concat(index) : total //include it if there is a wall class
  },[])
  return wallSquares.toString().replace(/,/g,', ')
}

function moveSprite(spriteClass,spriteIndex){
  console.log('moving', spriteClass)
  squares.forEach(square => square.classList.remove(spriteClass))
  squares[spriteIndex].classList.add(spriteClass)
}

window.addEventListener('DOMContentLoaded', init)

class Ghost{
  constructor(name,square){
    this.name = name
    this.square = square
    this.toPacman = ['Up','Down','Left','Right']
    this.intId = null
  }
  startMoving(){
    if(!this.intId){
      this.intId = setInterval( ()=>this.moveRandom(), 500)
    }
  }
  stopMoving(){
    clearInterval(this.intId)
    this.intId = null
  }
  moveRandom(){
    let allowedMove = null
    while(!allowedMove){
      const direction = this.toPacman[Math.floor(Math.random()*this.toPacman.length)]
      switch(direction) {
        case 'Right':
          allowedMove = rightMove(this.square)
          break
        case 'Left':
          allowedMove = leftMove(this.square)
          break
        case 'Up':
          allowedMove = upMove(this.square)
          break
        case 'Down':
          allowedMove = downMove(this.square)
          break
      }
    }
    if(allowedMove) this.square = allowedMove
    moveSprite('binky',this.square)
  }
}
