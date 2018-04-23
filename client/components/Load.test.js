/* eslint-env mocha,chai */

import {expect} from 'chai'
import React from 'react'
import enzyme, {shallow} from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import Load from './Load'

const adapter = new Adapter()
const disableLifecycleMethods = true
enzyme.configure({
  adapter,
  disableLifecycleMethods
})

const Test = () => <div>test</div>

describe('Load', () => {
  const resolves = () => Promise.resolve('Oh yeah')

  it('initializes loaded state to false', () => {
    const Loader = Load(Test)
    const wrapper = shallow(<Loader load={resolves} />)
    expect(wrapper.state().loaded).to.equal(false)
  })
})
