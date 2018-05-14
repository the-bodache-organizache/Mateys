#!/usr/bin/env node

const { db, Widget } = require('../server/db');

const seed = async () => {
  await db.sync({ force: true });
  console.log('db synced!');
  console.log('Seeding widgets');

  const widgets = await Promise.all([
    Widget.create({name: 'cannon', command: 'Load the cannon!', ready: true, imageUrl: '/widget-images/cannon.png'}),
    Widget.create({name: 'poopDeck', command: 'Swab the poop deck!', ready: true}),
    Widget.create({name: 'sails', command: 'Raise the sails!', ready: true}),
    Widget.create({name: 'parrot', command: "Shut the parrot up!", ready: true}),
    Widget.create({name: 'anchor', command: 'Raise the anchor!', ready: true, imageUrl: '/widget-images/anchor.png'}),
    Widget.create({name: 'oars', command: 'Man the oars!', ready: true, imageUrl: '/widget-images/oar.png'}),
    Widget.create({name: 'fish', command: 'Go fishing!', ready: true}),
    Widget.create({name: 'plank', command: 'Walk the plank!', ready: true, imageUrl: '/widget-images/plank.png'}),
    Widget.create({name: 'cody', command: 'Pet Cody!', ready: true, imageUrl: '/widget-images/pirate-cody.png'}),
    Widget.create({name: 'duel', command: 'Duel!', ready: true}),
    Widget.create({name: 'treasure', command: 'Grab the treasure!', ready: true}),
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
