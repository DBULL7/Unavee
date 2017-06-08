import React, { Component } from 'react'
import { VictoryPie, VictoryAnimation, VictoryLabel } from 'victory'

class NeedComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: 0,
    }
  }

  componentDidMount() {
    const num = this.round(this.props.percentile)
    this.setInterval = setInterval(this.helper(num), 2000)
  }

  round(data) {
    if (data) {
      let test = Math.round(data * 100)
      return test
    }
  }

  helper(data) {
    this.setState({data: data+1})
  }

  render() {
    if(this.round() === this.state.data){
      clearInterval(this.setInterval)
    }
    return (
      <div className="needs">
        <p className='need-title'>{this.props.name}</p>
        <VictoryPie
          className='victory-pie'
          animate={{duration: 1000}}
          width={400} height={400}
          data={[{x: 1, y: this.state.data}, {x: 2, y: 100 - this.state.data}]}
          innerRadius={120}
          cornerRadius={25}
          labels={() => null}
          style={{
            data: { fill: (d) => {
              const color = d.y > 30 ? "green" : "red";
              return d.x === 1 ? color : "transparent";
            }
           }
          }}
        />
        <VictoryAnimation duration={1000} data={this.state.data}>
            {(newProps) => {
              return (
                <VictoryLabel
                  className='watson-percentage'
                  textAnchor="middle" verticalAnchor="middle"
                  x={100} y={100}
                  text={`${Math.round(this.props.percentile * 100)}%`}
                  style={{ fontSize: 32 }}
                />
              );
            }}
          </VictoryAnimation>
      </div>
    )
  }
}

export default NeedComponent
