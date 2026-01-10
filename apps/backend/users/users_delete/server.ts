import app from './app';

const PORT = process.env.PORT || 3002;

app.listen(PORT, () => {
  console.log(`Users Delete Microservice running on port ${PORT}`);
});
