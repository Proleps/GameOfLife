class GameOfLife {
  constructor(props) {
    this.field = props.field || []
    this.row = +props.row
    this.col = +props.col
  }

  initField() {
    for(let i = 0; i < this.row; i++) {
      this.field[i] = []
      for(let j = 0; j < this.col; j++) {
        this.field[i][j] = Math.floor(Math.random() * 2)
      }
    }
  }
  cellIsLife(matr, x, y) {
    let countNeighbors = 0
  
    for(let i = x-1; i < x+2; i++) {
      for(let j = y-1; j < y+2; j++) {
        !!matr[(i + this.row) % this.row][(j + this.col) % this.col] && countNeighbors++
      }
    }
    if(!!matr[x][y]) {
      countNeighbors--
      if(countNeighbors>=2 && countNeighbors<=3) {
        return 1
      } else {
        return 0
      }
    } else if(countNeighbors == 3) {
      return 1
    } else {
      return 0
    }
  }
  newGeneration(prevGeneration) {
    return prevGeneration.map( (row, i, arr) => 
      row.map( ( _, j) =>
        this.cellIsLife(arr, i, j)
      )
    )
  }
  initLife(generation) {
    console.clear()
    console.table(generation)
    return setTimeout( () => this.initLife(this.newGeneration(generation)), 1000 )
  }

  init() {
    this.initLife(this.field)
  }
}


const fs = require('fs')
const readline = require('readline')

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

rl.question('Введите высоту и ширину через пробел, или укажите имя_файла.json: ', async (props) => {
  const params = props.split(' ')
  if (params.length == 1) {
    try {
      fs.readFile(params[0], 'utf-8', (err, data) => {
        if (err) throw err
        const field = JSON.parse(data)
        const life = new GameOfLife({
          field: field,
          row: field.length,
          col: field[0].length
        })
        life.init()
      })
    } catch (error) { console.log(error) }
  } else {
    if (!isNaN(params[0] + params[1])) {
      console.log(isNaN(params[1]))
      const life = new GameOfLife({
        row: params[0],
        col: params[1]
      })
      life.initField()
      life.init()
    } else {
      console.log('Ошибка ввода, одно из значений - не число')
    }
  }
  rl.close()
})