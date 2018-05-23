/* eslint-env mocha,chai */

const {expect} = require('chai');
const request = require('supertest');
const {db, Rooms} = require('../../db');
const app = require('../../app');

describe('Room routes', () => {
  beforeEach(async () => {
    await db.sync({force: true})
    await Rooms.create({name: 'The Flaming Barge'});
    await Rooms.create({name: 'The Wandering Plank'});
    await Rooms.create({name: 'The Bobbing Dingy'});
  });

  describe('/api/rooms', async () => {
    it('GET Retrieves all the rooms in the DB', async () => {
      await request(app)
        .get('/api/rooms')
        .expect(200)
        .then(res => {
          expect(res.body).to.be.an('array');
          expect(res.body.length).to.be.equal(3);
          expect(res.body[0].name).to.be.equal('The Flaming Barge');
        });
    });

  

  }) // end describe('/api/rooms')
}) // end describe('Room routes')