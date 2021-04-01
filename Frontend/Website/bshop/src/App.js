import logo from './logo.svg';
import './App.css';
import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Switch, Route, Link, Redirect, NavLink } from "react-router-dom";
import CustomNavbar from './Navbar';
import './themes.css';
import HomePage from './HomePage';
import Login from './login';
import Register from './register';

function App() {
  //for the themes, the first character is either l (light) or d (dark), the second one is the number of the theme selected (for those shops that have their own custom theme)
  const [theme, setThemeVar] = useState('l0'); //l = light, 0 = main theme
  useEffect(() => {
    let mode = localStorage.getItem('mode');
    if (!mode)
      mode = 'l';
    setMode(mode);
  }, [])

  const setMode = (mode) => {
    setThemeVar(mode + theme[1]);
    document.documentElement.setAttribute('data-theme', mode + theme[1]);
    localStorage.setItem('mode', mode);
  }

  const setTheme = (themeNum) => {
    setThemeVar(theme[0] + themeNum);
    document.documentElement.setAttribute('data-theme', theme[0] + themeNum);
  }

  return (
    <div className="App">
      <CustomNavbar setMode={setMode} theme={theme} />
      <div style={{ marginTop: "56px" }} >
        <Router>
          <Switch>
            <Route exact path='/' component={HomePage} />
            <Route exact path='/login' component={Login} />
            <Route exact path='/register' component={Register} />
          </Switch>
        </Router>
      </div>
    </div>
  );
}

export default App;
