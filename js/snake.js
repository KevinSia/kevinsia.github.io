const Snake = {
  init(){
    Snake.offBlink()

    const $snakeBox = $('#snake-game .border-box')
    // get original position of snake for start to 'restart'

    // dynamic?
    const totalUnit = 10

    const snakeBoxOffset = $snakeBox.offset()

    this.boxLimit = {
      left: snakeBoxOffset.left + 2,
      right: snakeBoxOffset.left + $snakeBox.width() - 2,
      top: snakeBoxOffset.top + 2,
      bottom: snakeBoxOffset.top + $snakeBox.height() - 2
    }
    this.$snakeHead = Snake.head()
    this.hUnit = $snakeBox.width() / totalUnit
    this.vUnit = $snakeBox.height() / totalUnit
    // init moving direction
    this.movingDir = {
      top: 0,
      left: -this.vUnit,
      currentDir: 'left'
    }
    this.intervalId = null
  },

  onBlink(){
    $('#snake-game .border-box').addClass('blink');
  },

  offBlink(){
    $('#snake-game .border-box').removeClass('blink');
  },

  reset(){
    const $snakeBox = $('#snake-game .border-box')
    $snakeBox.empty().html("<div id='snake-head' class='snake'></div>" +
      "<div class='snake-body snake'></div>" +
      "<div id='snake-tail' class='snake'></div>"
    )
    Snake.init()
    Snake.offBlink()
  },

  setKeypressEvent(){
    $('body').on("keydown.moveSnake", function(event){
      let key = event.which
      if (key >= 37 && key <= 40){
        let dir = Snake.checkKeyDirection(key)
        if(Snake.shouldChangeDirection(dir)){ Snake.changeDirection(dir) }
        event.preventDefault()
      } else {
        return false
      }
    })
  },

  start(callback){
    console.log('game start')

    if(typeof callback === "function") {
      callback()
    } else if(this.intervalId != null) {
      return false
    }

    $('#snake-start').text("Stop").addClass('red').removeClass('blue')
    Snake.setKeypressEvent()

    this.intervalId = setInterval(function(){
      // should refactor to (incrementInternal -> checkHit -> move/render)
      let hit = Snake.checkHit()
      if(!hit){
        Snake.move()
      } else {
        Snake.stop()
        Snake.onBlink()
      }
    }, 500)
  },

  stop(callback){
    console.log('game stop')

    $('#snake-start').text("Start").addClass('blue').removeClass('red')
    clearInterval(this.intervalId)
    this.intervalId = null
    $('body').off("keydown.moveSnake")
  },

  checkHit(){
    let snakeOffset = this.$snakeHead.offset()
    let resultTop = this.movingDir.top + snakeOffset.top
    let resultLeft = this.movingDir.left + snakeOffset.left
    let outH = (resultTop < this.boxLimit.top || resultTop > this.boxLimit.bottom)
    let outV = (resultLeft < this.boxLimit.left || resultLeft > this.boxLimit.right)

    // keep track of positioning with JSON (coordinates) => (element)
    // construct inside move()

    // if head hits body, return false

    if(outH || outV) {
      console.log('hit box')
      return true
    } else {
      return false
    }
  },


  isRunning(){
    return this.intervalId != null
  },

  move(){
    let prevOffset = this.$snakeHead.offset()
    let nextOffset = {
      top: prevOffset.top + Snake.movingDir.top,
      left: prevOffset.left + Snake.movingDir.left
    }

    $('.snake').each(function(idx, elm){
      $elm = $(elm)

      prevOffset = $elm.offset()
      $elm.offset(nextOffset)
      nextOffset = prevOffset
    })
  },

  bodies(){
    return $('#snake-game .snake-body')
  },

  head(){
    return $('#snake-game #snake-head')
  },

  tail(){
    return $('#snake-game #snake-tail')
  },

  shouldChangeDirection(direction){
    let currentDir = this.movingDir.currentDir
    return (
      (direction === 'left' || direction === 'right') &&
      (currentDir === 'up' || currentDir === 'down')
    ) ||
    (
      (direction === 'up' || direction === 'down') &&
      (currentDir === 'left' || currentDir === 'right')
    )
  },

  changeDirection(direction){
    switch(direction){
      case 'left':
        this.movingDir.top = 0
        this.movingDir.left = -this.hUnit
        break
      case 'right':
        this.movingDir.top = 0
        this.movingDir.left = this.hUnit
        break
      case 'up':
        this.movingDir.top = -this.vUnit
        this.movingDir.left = 0
        break
      case 'down':
        this.movingDir.top = this.vUnit
        this.movingDir.left = 0
        break
      default:
        console.log('Unknown direction')
        return false
    }
    this.movingDir.currentDir = direction
  },

  checkKeyDirection(keyNo){
    // 37-left 38-up 39-right 40-down
    switch(keyNo) {
      case 37:
        return 'left'
      case 38:
        return 'up'
      case 39:
        return 'right'
        break
      case 40:
        return 'down'
        break
      default:
        return null
    }
  }
}

$(document).ready(function(){
  Snake.init()
  let alreadyStarted = false

  $('#snake-start').on('click.startSnake', function(){
    $this = $(this)
    if(Snake.isRunning()){
      Snake.stop()
    } else if (alreadyStarted){
      console.log('restart')
      Snake.reset()
      Snake.start()
    } else {
      Snake.start()
      alreadyStarted = true
    }
  })
})
