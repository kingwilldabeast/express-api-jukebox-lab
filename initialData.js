//all in one seed file

const {db, Track} = require('./server'); // Import the connection utilities and model


const resetCollections = async () => {
    try {
        await Track.deleteMany({});
        console.log('All collection reset');
    } catch (error) {
        console.error('Error resetting collections:', error);
    }
};

const main = async () => {

  await resetCollections();   

  const trackArray = [
    {
      title: 'Love',
      artist: "Mark Zeppling",
    },
    {
      title: 'Hate',
      artist: "Bob Marley",
    },
  ]

  const tracks = await Track.insertMany(trackArray)
  console.log('Created tracks!')
  
}

const run = async () => {
  await main();
  db.close(); // Close the connection

};

run()