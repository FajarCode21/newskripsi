import machineSeed from "./machineSeed.js";
import userSeed from "./userSeed.js";
import ticketSeed from "./ticketSeed.js";

const seed = async () => {
  try {
    console.log("Seeding...");
    await machineSeed();
    await userSeed();
    await ticketSeed();
  } catch (error) {
    console.error("Error seeding", error);
  }
};

seed();
