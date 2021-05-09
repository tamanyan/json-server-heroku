const jsonServer = require('json-server');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();
const port = process.env.PORT || 5000;
const authUser = {
  id: '1',
  username: 'taketo',
  displayName: 'Taketo Yoshida',
  email: 'taketo@test.com',
  profileImageUrl: '/users/1.png',
  description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry',
};

server.use(cookieParser());
server.use(cors());

server.post('/auth/signin', (req, res) => {
  res.cookie('token', 'dummy_token', {
    maxAge: 3600 * 1000,
    httpOnly: true,
    domain: 'localhost',
  });
  res.status(201).json(authUser);
});

server.post('/auth/signout', (req, res) => {
  res.cookie('token', '', {
    maxAge: 0,
    httpOnly: true,
    domain: 'localhost:3000',
  });
  res.status(200).json({
    message: 'Sign out successfully'
  });
});

server.post('/purchases', (req, res) => {
  if (req.cookies['token'] !== 'dummy_token')
    return res.status(401).send('Unauthorized');

  res.status(201).json({
    message: 'ok'
  });
});

server.get('/users/me', (req, res) => {
  if (req.cookies['token'] !== 'dummy_token')
    return res.status(401).send('Unauthorized');

  res.status(200).json(authUser);
});

server.use(middlewares);
server.use(router);
server.listen(port);
