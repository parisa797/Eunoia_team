import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import { Form, FormControl } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Navbar.css';

function CustomNavbar(props) {
    return (
    <Navbar fixed="top" className='custom-nav'>
    <Navbar.Brand >Bshop</Navbar.Brand>
    <div className="btn" onClick={() => props.setMode(props.theme[0] === 'l'? 'd' : 'l')}> {props.theme[0] === 'l'? '☀' : '🌙'}</div>
    <Nav className="mr-auto">
      <Nav.Link href="/signin">منممم</Nav.Link>
    </Nav>
    <Navbar.Toggle aria-controls="basic-navbar-nav"/>
    <Navbar.Collapse className="justify-content-end"  id="basic-navbar-nav">
      <Form inline>
        <FormControl type="text" placeholder="جستجو..." className=" mr-sm-2" style={{direction:"rtl"}} />
        <div className="btn" type="submit" >Submit</div>
      </Form>
    </Navbar.Collapse>
  </Navbar>
  )
}

export default CustomNavbar;