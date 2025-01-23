// src/components/Header.jsx

import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import { FaSignInAlt, FaSignOutAlt } from 'react-icons/fa';
import { LinkContainer } from 'react-router-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useLogoutMutation } from '../slices/usersApiSlice';
import { logout } from '../slices/authSlice';

const Header = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [logoutApiCall] = useLogoutMutation();

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      navigate('/login');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <header>
      <Navbar bg="dark" variant="dark" expand="lg" collapseOnSelect>
        <Container>
          {/* Logo */}
          <LinkContainer to="/">
            <Navbar.Brand className="fw-bold text-uppercase">
              Digital time Capsule
            </Navbar.Brand>
          </LinkContainer>

          {/* Navbar Toggler */}
          <Navbar.Toggle aria-controls="basic-navbar-nav" />

          {/* Navbar Links */}
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto align-items-center">
              {/* Static Links */}
              <Nav.Link href="http://localhost:3001/view-capsule">
                View Capsule
              </Nav.Link>
              <Nav.Link href="http://localhost:3001/view-invitations">
                View Collaborations
              </Nav.Link>

              {userInfo ? (
                <>
                  <NavDropdown
                    title={
                      <span className="d-flex align-items-center">
                        
                        {userInfo.name}
                      </span>
                    }
                    id="username"
                    align="end"
                  >
                    <LinkContainer to="/profile">
                      <NavDropdown.Item>Profile</NavDropdown.Item>
                    </LinkContainer>
                    <NavDropdown.Item onClick={logoutHandler}>
                      Logout
                    </NavDropdown.Item>
                  </NavDropdown>
                </>
              ) : (
                <>
                 
                  <LinkContainer to="/login">
                    <Nav.Link className="d-flex align-items-center">
                      <FaSignInAlt className="me-1" />
                      Sign In
                    </Nav.Link>
                  </LinkContainer>
                  <LinkContainer to="/register">
                    <Nav.Link className="d-flex align-items-center">
                      <FaSignOutAlt className="me-1" />
                      Sign Up
                    </Nav.Link>
                  </LinkContainer>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;
