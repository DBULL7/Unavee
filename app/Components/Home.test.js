import React from 'react';
import { mount, shallow } from 'enzyme';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import Home from './Home';
import HomeContainer from './HomeContainer';
import fetchMock from 'fetch-mock'

const databaseResponse = {name: 'Jhun',
                          organization: 'Turing',
                          title: 'Instructor',
                          location: 'Denver',
                          picture: 'none',
                          LinkedIn: 'lit',
                          twitter: 'fire'
                        }

fetchMock.get('/api/v1/yung@jhun.com', {
  body: [databaseResponse]
})

const mockStore = configureMockStore()({
  loginUser: []
})

describe('Home Component tests', () => {
  it('should mount without crashing', () => {
    const wrapper = mount(<Provider store={mockStore}><HomeContainer/></Provider>)
  })

  it('should have a state input of empty strings',  async () => {
    function resolveAfter2Seconds() {
      return new Promise(resolve => {
        setTimeout(() => {
          resolve();
        }, 1000);
      });
    }

    const wrapper = mount(<Provider store={mockStore}><HomeContainer/></Provider>)
    const home = wrapper.find(Home)
    // const { input, searched, search } = home.node.state
    expect(home.node.state.input).toEqual('')
    expect(home.node.state.searched).toEqual(false)
    expect(home.node.state.search).toEqual('')
    const searchBar = wrapper.find('.home-search-bar')
    const searchButton = wrapper.find('#search-button')
    searchBar.simulate('change', { target: { value: 'yung@jhun.com'}})
    expect(home.node.state.input).toEqual('yung@jhun.com')
    expect(home.node.state.search).toEqual('')
    searchButton.simulate('click')
    await resolveAfter2Seconds()
    expect(home.node.state.input).toEqual('')
    expect(home.node.state.searched).toEqual(true)
    expect(home.node.state.search).toEqual('yung@jhun.com')
  })
})
