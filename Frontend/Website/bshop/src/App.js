import logo from './logo.svg';
import './App.css';
import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Switch, Route, Link, Redirect, NavLink } from "react-router-dom";
import CustomNavbar from './Navbar';
import './themes.css';
import HomePage from './HomePage';
import ProfilePage from './ProfilePage';
import Login from './login';
import Register from './register';
//import LoginStore from './loginstore';
import RegisterStore from './registerStore';
import Shop from './Shop';
import PageFooter from './PageFooter';
import EditShop from './EditShop';
import LoadingPage from './LoadingPage';
import ItemsList from './ItemsList';
import Items from './Items';
import AddItem from './AddItem';

function App() {
  //for the themes, the first character is either l (light) or d (dark), the second one is the number of the theme selected (for those shops that have their own custom theme)
  const [theme, setThemeVar] = useState('l0'); //l = light, 0 = main theme
  const [triggerNavbarUpdate, setTriggerNavUpdate] = useState(false);
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
      <CustomNavbar setMode={setMode} theme={theme} triggerNavbarUpdate={triggerNavbarUpdate} setTriggerNavUpdate={setTriggerNavUpdate} />
      <div className="page-holder" >
        <Router>
          <Switch>
            <Route exact path='/' component={LoadingPage} />
             <Route path="/profile" render={(props) => <ProfilePage triggerNavbarUpdate={triggerNavbarUpdate} setTriggerNavUpdate={setTriggerNavUpdate} {...props} />} /> 
            <Route exact path='/login' component={Login} />
            <Route exact path='/register' component={Register} />
            {/* <Route exact path='/loginstore' component={LoginStore} /> */}
            <Route exact path='/registerstore' component={RegisterStore} />
            <Route exact path = '/store/:id/itemslist' component={ItemsList} />
            <Route exact path='/store/:id/AddItem' component={AddItem} />
            <Route path='/store/:id/edit-info' component={EditShop} />
            <Route path='/store/:id' component={Shop} /> 
            
          </Switch>
        </Router>
        <PageFooter />
      </div>
    </div>
  );
}

export default App;
