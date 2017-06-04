import React from 'react';
import { mount, shallow } from 'enzyme';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import LoginContainer from './LoginContainer';
import Login from './Login';
import fetchMock from 'fetch-mock'

const response = [
  {email: 'test', id: 1, password: 'test', name: 'test'}
]


fetchMock.post('api/v1/signin', {
  body: response
})

const mockStore = configureMockStore()({
  loginUser: []
})

describe('Login Compont Tests', () => {
  it('should mount without crashing', () => {
    const wrapper = mount(<Provider store={mockStore}><LoginContainer/></Provider>)
  })

  it('should have empty strings for states', () => {
    const wrapper = mount(<Provider store={mockStore}><LoginContainer/></Provider>)
    const login = wrapper.find(Login)
    const { email, password } = login.node.state
    expect(email).toEqual('')
    expect(password).toEqual('')
  })

  it('should not send an API request if input fields aren\'t filled', () => {
    const wrapper = mount(<Provider store={mockStore}><LoginContainer/></Provider>)
    const login = wrapper.find(Login)
    const email = wrapper.find('.login-email-input')
    const password = wrapper.find('.login-password-input')
    const loginButton = wrapper.find('.login-button')

    loginButton.simulate('click')
    expect(fetchMock.called()).toEqual(false)
    email.simulate('change', { target: { value: 'test'}})
    password.simulate('change', { target: { value: 'test'}})
    loginButton.simulate('click')
    expect(fetchMock.called()).toEqual(true)
  })
})
