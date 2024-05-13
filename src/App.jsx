import { useState,useEffect, useRef } from 'react'
import { Square } from './components/SquareBoard'
import './App.css'
import styled from 'styled-components'


const TurnBlue = styled.div`
    background-color: blue;
    height: 10vh;
    width: 50%;
    border-radius: 5px;
    margin-top: 8px;
  `;
  const TurnRed = styled.div`
    background-color: red;
    height: 10vh;
    width: 50%;
    border-radius: 5px;
    margin-top: 8px;
  `;






const getDictMoves = () => {
  let dictMoves = {
    0:(i,j)=> [i,j-1],
    1:(i,j)=> [i,j+1],
    2:(i,j)=> [i-1,j-1],
    3:(i,j)=> [i+1,j+1],
    4:(i,j)=> [i-1,j],
    5:(i,j)=> [i+1,j],
    6:(i,j)=> [i-1,j+1],
    7:(i,j)=> [i+1,j-1]
  }
   return dictMoves
}

const processMatriz = (matriz,position,attempts) =>{
    if(position!=-1){
      let i = Math.floor(position["pos"]/3)
      let j = Math.abs((i*3)-position["pos"])
      matriz.current[i][j] = position["value"];
      attempts.current = attempts.current + 1;
    }
  }
 

  const validationLimit = (range) => {
    return range[0]>=0 && range[0]<=2 && range[1]>=0 && range[1] <=2
  }


  const validationValue = (matriz,range,i,j) => {
    return matriz.current[range[0]][range[1]] === matriz.current[i][j]
  }

const findWinner = (matriz,position) =>{
  let dictMoves = getDictMoves()
  let iStaticPosition = Math.floor(position["pos"]/3)
  let jStaticPosition = Math.abs((iStaticPosition*3)-position["pos"])
  let i = iStaticPosition
  let j = jStaticPosition
  let stopper = 1;
  let isFollowing = true
  let range = null
  let road = []
  let brotherDictionary = {
    cont:0
  };
  for(let w =0;w<8;w++){
    road.push([[iStaticPosition],[jStaticPosition]])
    while(stopper<=2 && isFollowing){
      if(stopper===1){
        range = dictMoves[w](parseInt(iStaticPosition),parseInt(jStaticPosition))
      }else{
        range = dictMoves[w](parseInt(i),parseInt(j))
      }
      
      if(validationLimit(range) && validationValue(matriz,range,iStaticPosition,jStaticPosition)){
          brotherDictionary["cont"] += 1  
          i = range[0]
          j = range[1]
          road.push(range)
          if(stopper===2 || brotherDictionary["cont"]===2){
            return road;
          }
          stopper += 1
      }else{
        isFollowing = false;
      }
    }
    checkBrother(brotherDictionary,w)
    stopper = 1
    isFollowing = true;
    road = []
  }
}


const checkBrother = (brotherDictionary,w) =>{
  let index = w + 1;
  if(index%2===0){
    brotherDictionary["cont"] = 0
  }
}


function App() {
  const [turn,setTurn] = useState(Math.round(Math.random()))  
  const refMatriz = useRef([[null,null,null],[null,null,null],[null,null,null]])
  const [winner,setWinner] = useState("none")
  const [array,setArray] = useState(Array(9).fill(null))
  const [positionLastInserted,setPosition] = useState(-1)
  const attempts = useRef(0)
  const [stop,setStop] = useState(false)

  useEffect(()=>{
          processMatriz(refMatriz,positionLastInserted,attempts)
          let response = findWinner(refMatriz,positionLastInserted)
          if(response!=undefined){
            setWinner(turn===0?" Azul gana ":" Rojo gana")
            setStop(true)
          }

          if(attempts.current===9){
            setWinner("EMPATE !")
          }
  },[positionLastInserted])


  const changePosition = (pos,className) =>{
    setPosition({
      pos,
      value:className
    })
  }

  return (
    <>
      {
        winner!="none"
        ?<div className='container-winner'>
          <p>{winner}</p>
        </div>
        :""
      }
      <div className='game-board'>
        {
          array.map((item,index)=>{
            return <Square
                key={index}
                setTurnBoard={() => setTurn(Math.abs(turn-1))}
                turnBoard={turn}
                identifier={index}
                setWinnerBoard={(value)=> setWinner(value)}
                changeLast={changePosition}  
                finishGame={stop}
                >
              </Square>
          })
        }
      </div>
      {
        (turn==0)
        ?<TurnRed></TurnRed>
        :<TurnBlue></TurnBlue>
      }
      <span className='span-turn'>Turno</span>
    </>
  )
}

export default App
