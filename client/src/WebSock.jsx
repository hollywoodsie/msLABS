import React, { useRef, useState } from 'react';
import TextField from '@material-ui/core/TextField';

import Card from '@material-ui/core/Card';
import { Button } from '@material-ui/core';
import CardContent from '@material-ui/core/CardContent';

import Typography from '@material-ui/core/Typography';

const AddPost = () => {
  const [messages, setMessages] = useState([]);
  const [value, setValue] = useState('');
  const [nameValue, setNameValue] = useState('');
  const socket = useRef();
  const [connected, setConnected] = useState(false);
  const [username, setUsername] = useState('');
  const [category, setCategory] = useState('');

  function connect() {
    socket.current = new WebSocket('ws://localhost:5000');

    socket.current.onopen = () => {
      setConnected(true);
      const message = {
        event: 'connection',
        username,
        category,
        id: Date.now(),
      };
      socket.current.send(JSON.stringify(message));
    };
    socket.current.onmessage = (event) => {
      const message = JSON.parse(event.data);
      setMessages((prev) => [message, ...prev]);
    };
    socket.current.onclose = () => {
      console.log('Socket закрыт');
    };
    socket.current.onerror = () => {
      console.log('Socket произошла ошибка');
    };
  }

  const sendMessage = async () => {
    const message = {
      username,
      messageName: nameValue,
      message: value,
      category,
      id: Date.now(),
      event: 'message',
    };
    socket.current.send(JSON.stringify(message));
    setValue('');
  };

  if (!connected) {
    return (
      <div className="center">
        <div className="form">
          <label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              type="text"
              placeholder="Enter username"
            />
          </label>
          <label>
            <input
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              type="text"
              placeholder="Enter category"
            />
          </label>
          <button onClick={connect}>Connect</button>
        </div>
      </div>
    );
  }

  return (
    <div className="center">
      <div>
        <div className="form">
          <TextField
            value={nameValue}
            onChange={(e) => setNameValue(e.target.value)}
            id="standard-textarea"
            label="Enter post name:"
            placeholder="Placeholder"
            margin="normal"
            multiline
          />

          <TextField
            value={value}
            onChange={(e) => setValue(e.target.value)}
            id="outlined-multiline-static"
            label="Text"
            multiline
            rows={4}
            defaultValue="Default Value"
            variant="outlined"
          />

          <Button variant="outlined" onClick={sendMessage}>
            Send post
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AddPost;
