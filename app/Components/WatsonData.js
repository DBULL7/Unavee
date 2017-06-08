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
        <article className='watson-groups'>
            <h3 className='needs-title'>Needs</h3>
          <div className='needs-content'>
            {needContent}
          </div>
        </article>
        <article className='watson-personality-analysis'>
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
