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

  describe('GET /api/rooms', async () => {
    it('Retrieves all the rooms in the DB', async () => {
      await request(app)
        .get('/api/rooms')
        .expect(200)
        .then(res => {
          expect(res.body).to.be.an('array');
          expect(res.body.length).to.be.equal(3);
          expect(res.body[0].name).to.be.equal('The Flaming Barge');
        });
    });
  }); // end describe('/api/rooms')
  
  describe('POST /api/rooms', async () => {
    const name = "The Bloomin' Onion";

    it('Responds with the created room a new room in the DB', async () => {
      await request(app)
        .post('/api/rooms')
        .send(name)
        .expect(200)
        .then(res => {
          expect(res.body).to.be.an('object');
          expect(res.body.name).to.be.equal("The Bloomin' Onion");
        });
          
          it('The created room can be retrieved from the DB', async () => {
            await request(app)
              .get('/api/rooms')
              .expect(200)
              .then(res => {
                expect(res.body).to.be.an('array');
                expect(res.body.length).to.be.equal(4);
                expect(res.body[3].name).to.be.equal("The Bloomin' Onion");
              });
          });
    });
  }); // end decribe('POST /api/rooms')
}); // end describe('Room routes')
