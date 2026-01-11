import app from './app';

const PORT = process.env.PORT || 3006;

app.listen(PORT, () => {
  console.log(`Auth Login Microservice running on port ${PORT}`);
});
