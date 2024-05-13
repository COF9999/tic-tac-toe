import React,{ useEffect, useState } from "react";





function Svg({url,typeClass}){
    return <img src={url} className={typeClass} />
}



export function Square({turnBoard,setTurnBoard,identifier,changeLast,finishGame}){
    const [urlSvg,setUrlSvg] = useState("none")
    const [init,setInit] = useState(false)
    const [nameClass,setNameClass] = useState("none")
   

    const info = (route,className) =>{
        setUrlSvg(route)
        setTurnBoard()
        setInit(true)
        setNameClass(className)
        changeLast(identifier,className)
    }
    const setSquare = (e) => {
        if(!init && !finishGame){
            if(turnBoard==0){
              info("/src/assets/x-symbol.svg","red") 
            }else{
               info("/src/assets/circle-fill.svg","blue")
            }
        }
    }
    
    return (
        <>
        <div className="square-board one-square" id={identifier} onClick={(e)=> {
            setSquare(e)
        }}

            
        >
        {
            (urlSvg=="none")
            ?""
            :<Svg url={urlSvg} typeClass={nameClass}></Svg>
        }  
        </div>
        </>
    )
}