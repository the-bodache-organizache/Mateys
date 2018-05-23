/* eslint-env mocha,chai */

const {expect} = require('chai')
const {db, Widget} = require('./index')

describe('Widget model test', () => {
  beforeEach(() => {
    return db.sync({force: true})
  })

  describe('data validations', () => {
    describe('name check', () => {
      let widget

      beforeEach(async () => {
        widget = await Widget.create({
          name: 'Test Widget Alpha',
          command: 'Press the widget!',
        })
      })

      it('has a name', () => {
        expect(widget.name).to.equal('Test Widget Alpha')
      })

      it('has a command', () => {
        expect(widget.command).to.equal('Press the widget!')
      })

      it('has a ready value of false', () => {
        expect(widget.ready).to.equal(true)
      })

      it('has the default imageUrl', () => {
        expect(widget.imageUrl).to.equal('/widget-images/cody.png')
      })
    }) // end describe('name check')
  }) // end describe('data validations')
}) // end describe('Widget model test')
