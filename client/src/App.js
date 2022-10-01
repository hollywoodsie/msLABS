import React from 'react';
import './app.css';
import { Routes, Route } from 'react-router-dom';

import { Container } from '@material-ui/core';
import AddPost from './WebSock';
import Posts from './Posts';

function App() {
  return (
    <>
      <Container>
        <Routes>
          <Route path="/" element={<AddPost />} />
          <Route path="/posts" element={<Posts />} />
        </Routes>
      </Container>
    </>
  );
}

export default App;
