import React, { Component } from 'react'

class Favorites extends Component {
  constructor(props) {
    super(props)
    this.state = {
      favorites: [],
      signedIn: false
    }
  }

  componentWillMount() {
    if(!this.props.loginUser.name) {
      return
    }
    const { id } = this.props.loginUser
    fetch(`/api/v1/${id}/favorites`)
      .then(res => res.json())
        .then(data => {
          console.log(data)
          this.setState({ signedIn: true, favorites: data })
        })
  }

  deleteFavorite(favoriteID) {
    fetch(`/api/v1/${this.props.loginUser.id}/${favoriteID}`, {
      method: 'DELETE'
    })
  }

  conditionalRender() {
    if(!this.state.signedIn) {
      return <div>Not Signed In</div>
    }
    let favorites = this.state.favorites.map(favorite => {
      const { name, picture, id, title, organizations } = favorite
      return (
        <article className='favorites-card' key={id}>
          <div>
            <img src={`${picture}`}/>
          </div>
          <div className='favorites-card-info'>
            <button onClick={() => {this.deleteFavorite(id)}}>Delete</button>
            <p>{name}</p>
            <p>{title}</p>
            <p>{organizations}</p>
            <button>See More</button>
          </div>
        </article>
      )
    })
    return (
      <section>
        {favorites}
      </section>
    )
  }

  render() {
    return (
      <section>
        {this.conditionalRender()}
      </section>
    )
  }
}

export default Favorites
