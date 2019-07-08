import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Container } from './components';
import './App.css';

export default () => {
  return (
    <BrowserRouter>
      <div className="App">
        <header className="App-header">
          <Container/>
        </header>
        <div className="App-footer">
          <span>This is me on </span>
          <a href="https://github.com/EDToaster">github</a>
          <span> and </span>
          <a href="https://uoft.dev">uoft.dev</a>
        </div>
      </div>
    </BrowserRouter>
  );
}
