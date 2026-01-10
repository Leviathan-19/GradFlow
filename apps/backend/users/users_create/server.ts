import app from './app';

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Users Create Microservice running on port ${PORT}`);
});
