import React from 'react'
import { VictoryChart, VictoryBar } from 'victory'

export const Graph = (props) => {
  const data = []
  const data2 = []
  console.log(props);
  props.props.map(obj => data.push(obj))
  data.forEach(trait => {
    let test = {name: trait.name, amount: Math.round(trait.percentile * 100)}
    data2.push(test)
  })
  return (
    <div className='victory-graph'>
      <div className='graph-container'>
        <VictoryChart domainPadding={15}>
          <VictoryBar data={data2} x="name" y="amount"
            animate={{ onLoad: { duration: 500 } }}
            style={{ data: { width: 10}}}
          />
        </VictoryChart>
      </div>
    </div>
  )
}
