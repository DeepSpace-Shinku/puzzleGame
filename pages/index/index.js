// index.js
// 获取应用实例
const app = getApp()
var SIZE = 3;
var STEPS = 1;
var SOURCE = "chuihuamen"
var varDefaultBoard = defualtBoardGenerator(SIZE);
var varBoard;
var imageBoard;
var varBlankIndex;


Page({
  data: {
      
     h:'00',
     m:'00',
     s:'00',
  //存储计时器
   setInter:'',
   num:1,
  },
  onLoad: function(){
    this.sizeArrayGenerator(SIZE)
    shuffle(SIZE, STEPS)
    this.setData({
        board: varBoard,
        blankIndex: varBlankIndex,
        defualtBoard: varDefaultBoard,
        imageBoard: imageBoard
    })
    this.taskStart()
  },

  queryTime(){
    const that=this;
    var hou=that.data.h
    var min=that.data.m
    var sec=that.data.s
   
    that.data.setInter  = setInterval(function(){
        sec++
        if(sec>=60){
         sec=0
         min++
         if(min>=60){
           min=0
           hou++
           that.setData({
             h:(hou<10?'0'+min:min)
           })
         }else{
           that.setData({
             m:(min<10?'0'+min:min)
           })
         }
        }else{
          that.setData({
            s:(sec<10?'0'+sec:sec)
          })
        }
      
          var numVal = that.data.num + 1;
          that.setData({ num: numVal });
          console.log('setInterval==' + that.data.num);
    
      },1000)
  },
   
    taskStart(){
   
      this.queryTime()
    },
    taskEnd(){
   
   
      //清除计时器  即清除setInter
      var that = this;
      clearInterval(that.data.setInter)
     
    },
    onUnload: function () {
      //清除计时器  即清除setInter
      this.taskEnd()

  },

  sizeArrayGenerator: function(size) {
      var sizeArray = new Array(size)
      for (let i = 0; i < size; i += 1) {
          sizeArray[i] = i
      }
      this.setData({sizeArray: sizeArray})
  },


onClick: function(e)
{
    var row = e.target.dataset.row, col = e.target.dataset.col;
    var blankIndex = this.data.blankIndex
    var blankRow = oneDToRow(blankIndex, SIZE)
    var blankCol = oneDToCol(blankIndex, SIZE)
    if (!this.isNextTo(row, col, blankRow, blankCol)) return
    
    var tempBoard = swap(this.data.board, row, col, blankRow, blankCol)
    var tempImageBoard = swap(this.data.imageBoard, row, col, blankRow, blankCol)
    var newBlankIndex = twoDToOneD(row, col, SIZE)

    this.setData({
        board: tempBoard,
        imageBoard: tempImageBoard,
        blankIndex: newBlankIndex
    })


    if (isArrEqual(this.data.board, varDefaultBoard)) {
        wx.redirectTo({
            url: '../completed/completed'
          })
    }
    
},

isNextTo: function(r1, c1, r2, c2)
{
    if ((r1 == r2 + 1 || r1 == r2 - 1) && c1 == c2) return true
    if ((c1 == c2 + 1 || c1 == c2 - 1) && r1 == r2) return true
    return false
}
})

function imageBoardGenerator(source, board)
{
    var size = board.length
    var prefix = '../../resources/img/'
    var imageBoard = new Array(size)
    var row, col, cell;
    for (let i = 0; i < size; i += 1) {
        imageBoard[i] = new Array(size)
        for (let j = 0; j < size; j += 1) {
            cell = board[i][j]
            if (cell == lastIndex()) imageBoard[i][j] = prefix.concat("default.png")
            else {
                cell = parseInt(cell)
                row = oneDToRow(cell, SIZE), col = oneDToCol(cell, SIZE)
                imageBoard[i][j] = prefix.concat(source, "/", size.toString(), "/", row.toString(), col.toString(), ".jpg")
            }
        }
    }
    return imageBoard

}

function shuffle(size, steps) {
    // if (!(size == 3)) throw "Not Implemented exception";
    varBoard = boardCopy(varDefaultBoard);
    var prevBlankRow = -1, prevBlankCol = -1;
    var blankRow = size - 1, blankCol = size - 1;

    for (let i = 0; i < steps; i++) {
        var neigbhour = getARandomNeighbour(blankRow, blankCol, prevBlankRow, prevBlankCol, size);
        var row = neigbhour[0], col = neigbhour[1];
        varBoard = swap(varBoard, blankRow, blankCol, row, col);
        prevBlankRow = blankRow, prevBlankCol = blankCol;
        blankRow = row, blankCol = col;
      }
      imageBoard = imageBoardGenerator(SOURCE, varBoard)
      varBlankIndex =  twoDToOneD(row, col, size);
  }

  // Get a random neighbour that wasn't exchanged in the previous step
  function getARandomNeighbour(row, col, prevRow, prevCol, size)
  {
    var neighbours = new Array();
    if (row != 0 && !(row - 1 == prevRow && col == prevCol)) neighbours.push([row - 1, col]);
    if (row != size - 1 && !(row + 1 == prevRow && col == prevCol)) neighbours.push([row + 1, col]);
    if (col != 0 && !(row == prevRow && col - 1 == prevCol)) neighbours.push([row, col - 1]);
    if (col != size - 1 && !(row == prevRow && col + 1 == prevCol)) neighbours.push([row, col + 1]);
    return neighbours[Math.floor(Math.random() * neighbours.length)]
  }

  // Swap two elements in the board
  function swap(board, r1, c1, r2, c2) {
      var temp = board[r1][c1];
      board[r1][c1] = board[r2][c2];
      board[r2][c2] = temp;
      return board
  }

  // Generate the default board with the given size.
  function defualtBoardGenerator(size) {
      var defaultBoard = new Array(size)
      for (let i = 0; i < size; i += 1) {
          defaultBoard[i] = new Array(size)
          for (let j = 0; j < size; j += 1) {
              defaultBoard[i][j] = i * size + j
          }
      }
      return defaultBoard
  }

  // Copy the board.
  function boardCopy(board) {
    var size = board.length
    var newBoard = new Array(size)
    for (let i = 0; i < size; i += 1) {
        newBoard[i] = new Array(size)
        for (let j = 0; j < size; j += 1) {
            newBoard[i][j] = board[i][j]
        }
    }
    return newBoard
  }

  function oneDToRow(index, size) {
    return parseInt(index / size)
  }

  function oneDToCol(index, size) {
    return index % size
  }

  function twoDToOneD (row, col, size) {
      return row * size + col
  }

  // Return the 1D index of last cell of the given size
  function lastIndex(){
      return SIZE * SIZE - 1
  }


const isArrEqual = (arr1, arr2) => {
    for (let i = 0; i < arr1.length; i += 1) {
        for (let j = 0; j < arr1.length; j += 1) {
            if (arr1[i][j] != arr2[i][j]) return false
        }
    }
    return true
};