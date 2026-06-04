import machineSeed from './machineSeed.js';
import userSeed from './userSeed.js';

const seed = async () => {
  try {
    console.log('Seeding...');
    await machineSeed();
    await userSeed();
  } catch (error) {
    console.error('Error seeding', error);
  }
};

seed();
