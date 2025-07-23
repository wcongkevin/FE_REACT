import React, { useEffect, useState } from 'react';
import { NavLink } from "react-router-dom";
import { Navbar, Nav, NavDropdown, Container, Image } from "react-bootstrap";
import { FRONT_STATIC_URL } from "../../helpers/constants";
import { loginConfig } from '../../config/loginConfig';
import "bootstrap/dist/css/bootstrap.min.css";
import "./Navigation.css";
import "../../routes/AppRoutes";

const Navigation: React.FC = () => {

  const [name, setName] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [profilePicture, setProfilePicture] = useState<string | null>(null);

  useEffect(() => {
    setName(sessionStorage.getItem("name"));
    setEmail(sessionStorage.getItem("user_email"));
    setProfilePicture(localStorage.getItem("profile"));
    // Check if user is already logged in
    if (sessionStorage.getItem("user")) {
      console.log('User is already logged in');
    } else {
      console.log('User is not logged in');
    }
  }, []);

  const handleSignOut = () => {
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("name");
    sessionStorage.removeItem("user_email");
    localStorage.removeItem("token");
    localStorage.removeItem("profile");
    window.location.href = `${loginConfig.SIGNOUT_URL}`;
  };

  return (
    <Navbar
      expand="sm"
      fixed="top"
      className="shadow-sm rounded navbar-position sticky-top"
      style={{ backgroundColor: "#f7fcff" }}
    >
      <Container fluid>
        <Navbar.Brand>
          <img src={`${FRONT_STATIC_URL}Logo.png`} alt="Logo" className="img" />{" "}
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarSupportedContent" />
        <Navbar.Collapse id="navbarSupportedContent">
          <Nav className="me-auto mb-2 mb-lg-0 ms-5">
            <Nav.Link
              as={NavLink}
              to="/file-upload"
              className="fontWeight"
            >
              File Upload
            </Nav.Link>
            <Nav.Link
              as={NavLink}
              to="/"
              className="fontWeight"
            >
              File Monitor
            </Nav.Link>
            <Nav.Link
              as={NavLink}
              to="/report"
              className="fontWeight"
            >
              Report
            </Nav.Link>
            <NavDropdown
              title="Operations"
              disabled
              id="navbarDropdown1"
              className="fontWeight"
            >
              <NavDropdown.Item
                as={NavLink}
                to="/operations/new-retailer-onboarding"
                disabled
              >
                New Retailer Onboarding
              </NavDropdown.Item>
              <NavDropdown.Item
                as={NavLink}
                to="/operations/modify-existing-retailer"
                disabled
              >
                Modify an Existing Retailer File
              </NavDropdown.Item>
              <NavDropdown.Item
                as={NavLink}
                to="/operations/raise-an-incident"
                disabled
              >
                Raise an Incident
              </NavDropdown.Item>
            </NavDropdown>
            <NavDropdown
              title="Help"
              id="navbarDropdown2"
              className="fontWeight"
            >
              <NavDropdown.Item as={NavLink} to="/help/webapp-wiki">
                webapp! wiki
              </NavDropdown.Item>
              <NavDropdown.Item as={NavLink} to="/help/contact-list">
                Contact list
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
          <Nav className="justify-content-start ml-5 mb-2 mb-lg-0">
            <NavDropdown
              title={<Image src={profilePicture} roundedCircle className="profile" />}
              id="navbarDropdown3"
              className="nav-link fontWeight"
              align="end"
            >
              <NavDropdown.Item disabled className="userDetails">
                <Image src={profilePicture} roundedCircle className="profile" />
                <p className="userName">
                  {name}
                  <br />
                  <i className="fas fa-envelope"></i> {email}
                </p>
              </NavDropdown.Item>
              <NavDropdown.Item onClick={handleSignOut} className="divider">
                <i className="fas fa-sign-out-alt"></i> Logout
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Navigation;
