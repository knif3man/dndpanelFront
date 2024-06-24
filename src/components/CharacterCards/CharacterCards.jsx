import {  useEffect, useState } from "react"
import CharCard from "./../charCard/charCard"
import './CharacterCards.css'
import backend from '../../urls'


const CharacterCards = (props) =>{

    return(
        <>
            <section className='characterCards'>
                {props.charlist.map(char => 
                    <CharCard key={char.char_name} selectedCards={props.selectedCards} setSelectedCards={props.setSelectedCards}  CharName={char.char_name} charlist={props.charlist} setisAdminPanelOpen={props.setisAdminPanelOpen} isAdminPanelOpen={props.isAdminPanelOpen} setShowChars={props.setShowChars} setisCharsheet={props.setisCharsheet} setCharname={props.setCharname} gm={props.gm}/>
                )}

                
            </section>
        </>
    )
}

export default CharacterCards