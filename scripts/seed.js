#!/usr/bin/env node

const { db, User, Widget } = require('../server/db');

const seed = async () => {
  await db.sync({ force: true });
  console.log('db synced!');

  const users = await Promise.all([
    User.create({ email: 'cody@email.com', password: '123' }),
    User.create({ email: 'grace@hopper.com', password: '123', isAdmin: true })
  ]);
  console.log(`seeded ${users.length} users`);
  console.log('email: ', users[0].email, ' password: 123');
  console.log('email: ', users[1].email, ' password: 123');

  console.log('Seeding widgets');

  const widgets = await Promise.all([
    Widget.create({name: 'cannon', command: 'The cannon needs to be loaded!', ready: true}),
    Widget.create({name: 'poopDeck', command: 'Quickly, Swab the poop deck!', ready: true}),
    Widget.create({name: 'sails', command: 'Raise the sails!', ready: true}),
    Widget.create({name: 'scurvy', command: "Argg! You're getting scurvy Matey!", ready: true}),
    Widget.create({name: 'anchor', command: 'Raise the anchor, time to set sail!', ready: true}),
    Widget.create({name: 'oars', command: 'Row, row, row your boat', ready: true}),
    Widget.create({name: 'fish', command: 'My stomach is grumbling!', ready: true}),
    Widget.create({name: 'plank', command: 'Time to walk the plank you scurvy dog!', ready: true})
  ]);

  console.log(`seeded successfully`);
};

seed()
  .catch(err => {
    console.error(err.message);
    console.error(err.stack);
    process.exitCode = 1;
  })
  .then(() => {
    console.log('closing db connection');
    db.close();
    console.log('db connection closed');
  });

console.log('seeding...');
