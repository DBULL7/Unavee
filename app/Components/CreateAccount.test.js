import React from 'react';
import { mount, shallow } from 'enzyme';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import CreateAccount from './CreateAccount';
import CreateAccountContainer from './CreateAccountContainer';
import fetchMock from 'fetch-mock'

const response = {id: 1}


fetchMock.post('api/v1/users/new', {
  body: response
})

const mockStore = configureMockStore()({
  loginUser: {}
})


describe('Create Account Tests', () => {

  it('should mount without crashing', () => {
    const wrapper = mount(<Provider store={mockStore}><CreateAccountContainer/></Provider>)
  })

  it('should have state of empty strings', () => {
    const wrapper = mount(<Provider store={mockStore}><CreateAccountContainer/></Provider>)
    const state = wrapper.find(CreateAccount)
    expect(state.node.state.name).toEqual('')
    expect(state.node.state.email).toEqual('')
    expect(state.node.state.password).toEqual('')
    expect(state.node.state.retypedPassword).toEqual('')
    expect(state.node.state.emailTaken).toEqual(false)
  })

  it('should should create an account', () => {
    const wrapper = mount(<Provider store={mockStore}><CreateAccountContainer history={'http://localhost:3000/'}/></Provider>)
    const state = wrapper.find(CreateAccount)

    const name = wrapper.find('.create-account-input-name')
    const email = wrapper.find('.create-account-input-email')
    const password = wrapper.find('.create-account-input-password')
    const retypedPassword = wrapper.find('.create-account-input-retypedPassword')
    const button = wrapper.find('#create-account-button')
    name.simulate('change', { target: { value: 'Jhun'}})
    email.simulate('change', { target: { value: 'yung@jhun.com'}})
    password.simulate('change', { target: { value: 'lit'}})
    retypedPassword.simulate('change', { target: { value: 'lit'}})
    expect(state.node.state.name).toEqual('Jhun')
    expect(state.node.state.password).toEqual('lit')
    button.simulate('click')
    expect(state.node.state.emailTaken).toEqual(false)
  })


  it.skip('should prevent bad data from being submitted', () => {
    const wrapper = mount(<Provider store={mockStore}><CreateAccountContainer history={'http://localhost:3000/'}/></Provider>)
    const state = wrapper.find(CreateAccount)

    const name = wrapper.find('.name')
    const email = wrapper.find('.email')
    const password = wrapper.find('.password')
    const retypedPassword = wrapper.find('.retypedPassword')
    const button = wrapper.find('#create-account-button')
    name.simulate('change', { target: { value: 'Jhun'}})
    email.simulate('change', { target: { value: 'yungjhun'}})
    password.simulate('change', { target: { value: 'lit'}})
    retypedPassword.simulate('change', { target: { value: 'lit'}})
    expect(state.node.state.name).toEqual('Jhun')
    expect(state.node.state.password).toEqual('lit')
    button.simulate('click')
    // expect(fetchMock.called()).toEqual(false)
    email.simulate('change', { target: { value: 'yung@jhun.com'}})
    button.simulate('click')
    expect(fetchMock.called()).toEqual(true)
  })
})
