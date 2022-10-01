import React, { useRef, useState } from 'react';
import FormControl from '@material-ui/core/FormControl';
import Card from '@material-ui/core/Card';

import CardContent from '@material-ui/core/CardContent';
import Select from '@material-ui/core/Select';
import { MenuItem } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import InputLabel from '@material-ui/core/InputLabel';
import Button from '@material-ui/core/Button';

const Posts = () => {
  const [messages, setMessages] = useState([]);
  const socket = useRef();
  const [connected, setConnected] = useState(false);
  const [isNotSelected, setIsNotSelected] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('');

  function connect() {
    socket.current = new WebSocket('ws://localhost:5000');

    socket.current.onopen = () => {
      setConnected(true);
      const message = {
        event: 'connection',
        selectedCategory,
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
  const categories = ['animals', 'tech', 'trash'];
  const handleChange = (e) => {
    setSelectedCategory(e.target.value);
    setIsNotSelected(false);
  };
  if (!connected) {
    return (
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Select category</InputLabel>
        <Select value={selectedCategory} onChange={handleChange} sx={{ mb: 2 }}>
          {categories?.map((categories) => {
            return (
              <MenuItem key={categories} value={categories}>
                {categories}
              </MenuItem>
            );
          })}
        </Select>
        <Button
          variant="text"
          color="primary"
          onClick={connect}
          disabled={isNotSelected}
        >
          Subscribe
        </Button>
      </FormControl>
    );
  }

  return (
    <div className="center">
      <div className="messages">
        {messages.map((mess) => (
          <div key={mess.id}>
            {mess.event === 'connection' ? (
              <div className="connection_message">
                You are following {mess.selectedCategory} category now!
              </div>
            ) : (
              <div className="message">
                <Card sx={{ minWidth: 275 }}>
                  <CardContent>
                    <Typography
                      sx={{ fontSize: 14 }}
                      color="text.secondary"
                      gutterBottom
                    >
                      {mess.category}
                    </Typography>
                    <Typography variant="h5" component="div">
                      {mess.messageName}
                    </Typography>
                    <Typography sx={{ mb: 1.5 }} color="text.secondary">
                      {mess.message}
                    </Typography>
                    <Typography variant="body2">{mess.username}</Typography>
                  </CardContent>
                  {/* <CardActions>
                      <Button size="small">Learn More</Button>
                    </CardActions> */}
                </Card>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Posts;
