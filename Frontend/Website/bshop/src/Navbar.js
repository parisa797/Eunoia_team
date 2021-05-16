import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import { Form, FormControl } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Navbar.css';
import './Search.css';
import { useEffect, useState } from 'react';
import CloseIcon from '@material-ui/icons/Close';
import SearchBar from './SearchBar';

function CustomNavbar(props) {
  const [profile, setProfile] = useState(null);
  const [dropVis, setDropVis] = useState(false);
  const [showNavOptions,setShowNavOptions] = useState(window.location.pathname !== "/login" && window.location.pathname !== "/register" )
  useEffect(() => {
    console.log(window.location.pathname)
    if(window.location.pathname === "/login" || window.location.pathname === "/register"){
      return;
    }
    if (!localStorage.getItem("token")) {
      setProfile(null);
      return;
    }
    //set profile if exists
    fetch("http://eunoia-bshop.ir:8000/users/profile", {
      method: 'GET',
      headers: {
        "Authorization": "Token " + localStorage.getItem('token')
      }
    }).then(
      res => {
        if (res.status === 200) {
          return res.json()
        }
        return null;
      }
    ).then(
      res => {
        if (res === null)
          return;
        if (!(res?.urls?.length > 0)) {
          res.urls = [{ uploaded_file: "/profile.png" }];
          res.files = [-1];
        }
        setProfile(res)
      }
    )
      .catch(e => console.log(e));
  }, [props.triggerNavbarUpdate])

  const logout = () => {
    localStorage.removeItem("username")
    localStorage.removeItem("token")
    localStorage.removeItem("role")
    localStorage.removeItem("shops")
    window.location.replace("/");
  }

  window.onclick = function (event) {
    if (!event.target.matches('.nav-dropdown-toggle')) {
      if (dropVis)
        setDropVis(false)
    }
    if (!event.target.matches('.dropdown-toggle')) {
      var dropdowns = document.getElementsByClassName("dropdown-menu");
      var i;
      for (i = 0; i < dropdowns.length; i++) {
        var openDropdown = dropdowns[i];
        if (openDropdown.classList.contains('show')) {
          openDropdown.classList.remove('show');
        }
      }
    }
  }

  return (
    <Navbar fixed="top" className='custom-nav navbar-default'>
      <div className="nav-upper mr-auto">
        <Navbar.Brand ><a href="/">Bshop</a><div className="btn" data-testid="nav-theme-toggle" onClick={() => props.setMode(props.theme[0] === 'l' ? 'd' : 'l')}> {props.theme[0] === 'l' ? '☀' : '🌙'}</div></Navbar.Brand>
        {showNavOptions && <Nav className="">
          {!profile ?
            <Nav.Link href="/login" data-testid="no-profile" className="no-profile">ورود / ثبت نام</Nav.Link>
            :
            <div className="nav-profile">
              <img data-testid="nav-prof-img" className="image btn nav-dropdown-toggle" src={profile && profile.urls && profile.urls.length > 0 ? profile.urls[0].uploaded_file : "/profile.png"} alt="profile" onClick={() => setDropVis(!dropVis)} />
              <div className="dropdown" hidden={!dropVis} data-testid="nav-dropdown" >
                <CloseIcon className="drop-exit" onClick={() => setDropVis(!dropVis)} />
                <div className="dropprofile drop-item" >
                  <div className="img-parent">
                    <img data-testid="dropdown-img" src={profile && profile.urls && profile.urls.length > 0 ? profile.urls[0].uploaded_file : "/profile.png"} alt="profile" />
                  </div>
                  <div className="prof-info">
                    <p className="name" data-testid="dropdown-fullname" >{profile?.FirstName || profile.LastName ? (profile?.FirstName + " " + profile?.LastName) : "بدون نام"}</p>
                    <p className="username" data-testid="dropdown-username" >{profile?.user_name}</p>
                  </div>
                  <a href="/profile" className="drop-continue">
                    مشاهده پروفایل
            </a>
                </div>
                <div className="drop-break"></div>
                <div className="drop-item drop-a a" href="#" >
                  کیف پول
          </div>
                <div className="drop-item drop-a a" href="#" >
                  گزارش خرید
          </div>
                <div className="drop-item drop-a a" onClick={() => logout()} >
                  خروج
          </div>
              </div>
            </div>
          }
        </Nav>}
      </div>
       <Navbar.Toggle aria-controls="basic-navbar-nav" />
      {/* <Navbar.Collapse className="justify-content-end" id="basic-navbar-nav"> */}
      {showNavOptions &&
      // <Form inline className="search-form">
      //   <FormControl type="text" placeholder="جستجو..." className=" mr-sm-2" className="search-bar" />
        // </Form>
        <div className="search search-form">
        <SearchBar id="nav"/>
        </div>
      }
      {/* </Navbar.Collapse> */}
    </Navbar>
  )
}

export default CustomNavbar;