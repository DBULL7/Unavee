import React, {Component} from 'react'
import { VictoryPie } from 'victory'
import NeedComponent from './NeedComponent'

export const WatsonData = (props) => {
  if (props.watson) {
    const {needs, personality} = props.watson
    let needContent = needs.map(need => {
      return (
      <NeedComponent {...need}/>
      )
    })
    let personalityContent = personality.map(trait => {
      return (
        <div className="personality">
          <p>{trait.name}</p>
          <p>{trait.percentile}</p>
        </div>
      )
    })
    return (
      <div className="watsonData">
        <article>
          <h3>Needs</h3>
          {needContent}
        </article>
        <article>
          <h3>Personality Analysis</h3>
          {personalityContent}
        </article>
      </div>
    )
  } else {
    return (
      <div></div>
    )
  }
}
