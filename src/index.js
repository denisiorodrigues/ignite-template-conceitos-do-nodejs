const express = require('express');
const cors = require('cors');

 const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

 const users = [];

function checksExistsUserAccount(request, response, next) {
  
  const {username} = request.headers;

  const user = users.find((user) => user.username === username);

  if(!user){
    return response.status(404).json({erro: "User not found!"})
  }

  request.user = user;

  next();
}

app.post('/users', (request, response) => {
  const { name, username } = request.body;

  users.push({
    id: uuidv4(),
    name,
    username,
    todos: []
  })

  return response.status(201).send();
});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  const {user} = request;

  return response.json(user.todos);
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  
  const {user} = request;
  const { title, dedline } = request.body;

  const todo = {
    id : uuidv4(),
    title,
    dedline,
    done:false,
    dedline: new Date(dedline),
    create_at: new Date()
  }

  user.todos.push(todo);

  return response.status(201).json(todo);

});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  const {user} = request;
  const {title, deadline} = request.body;
  const {id} = request.params;

  const todo = user.todos.find((todo) => todo.id === id);

  if(!todo){
    return response.status(404).json({erro: "Todo não encontrado"})
  }
  
  todo.title = title;
  todo.deadline = deadline;

  return response.status(201).send();
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  const {user} = request;
  const {id} = request.params;

  const todo = user.todos.find((todo) => todo.id === id);

  todo.done = true;

  return response.status(201).send();
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  const {user} = request;
  const {id} = request.params;

  const todo = user.todos.find((todo) => todo.id === id);

  if(!todo){
    return response.status(400).json({erro: "Todo not found!"})
  }

  const indexOFtodo = user.todos.indexOf(todo);
  user.todos.splice(indexOFtodo, 1);

  return response.send();
});

module.exports = app;