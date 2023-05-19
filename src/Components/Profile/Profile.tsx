import React, { useState, useContext } from "react";
import {
  UserContext,
  UserContextType,
  IUser,
  IUpdateUser,
} from "../../Contexts/UserContext";
import { Form, Alert, Button, Spinner, Row, Col, Fade } from "react-bootstrap";
import { server } from "../../App";
import "./Profile.css";

function Profile() {
  const { user, changeUser } = useContext(UserContext) as UserContextType;

  const [firstNameInput, setFirstNameInput] = useState(user?.firstName);
  const [lastNameInput, setLastNameInput] = useState(user?.lastName);
  const [emailInput, setEmailInput] = useState(user?.email);
  const [phoneInput, setPhoneInput] = useState(user?.phone);
  const [passwordInput, setPasswordInput] = useState("");
  const [verPasswordInput, setVerPasswordInput] = useState("");
  const [bioInput, setBioInput] = useState(user?.bio);

  const [alert, setAlert] = useState("");
  const [spinner, setSpinner] = useState(false);
  const [confirmPass, setConfirmPass] = useState(false);
  const [confirmPassDisabled, setConfirmPassDisabled] = useState(true);

  function saveChanges() {
    if (!user) return; //unnecessary double check so typescript will leave me alone (user?)

    if (passwordInput !== verPasswordInput) {
      setAlert("Passwords do not Match");
      return;
    }

    //some fields cannot be empty strings
    if (
      firstNameInput === "" ||
      lastNameInput === "" ||
      phoneInput === "" ||
      emailInput === ""
    ) {
      setAlert("Empty Field");
      return;
    }

    const updateQuery: IUpdateUser = {
      firstName: firstNameInput !== user.firstName ? firstNameInput : undefined,
      lastName: lastNameInput !== user.lastName ? lastNameInput : undefined,
      phone: phoneInput !== user.phone ? phoneInput : undefined,
      email: emailInput !== user.email ? emailInput : undefined,
      bio: bioInput !== user.bio ? bioInput : undefined,
      password: passwordInput !== "" ? passwordInput : undefined,
    };

    //bio can be erased, so if empty string - set to null
    if (bioInput === "") {
      updateQuery.bio = null;
    }

    //if all values are undefined, alert "no changes"
    if (Object.values(updateQuery).every((val) => val === undefined)) {
      setAlert("No Changes Made");
      return;
    }

    setAlert("");
    setSpinner(true);

    server
      .put("user/" + user.id, updateQuery, {
        headers: { "x-access-token": user.token },
      })
      .then((response) => {
        const updatedUser: IUser = {
          id: user.id,
          firstName: response.data.firstName,
          lastName: response.data.lastName,
          phone: response.data.phone,
          email: response.data.email,
          password: response.data.password,
          bio: response.data.bio,
          admin: user.admin,
          token: user.token,
          pets: user.pets,
        };
        changeUser(updatedUser);

        setSpinner(false);
      })
      .catch((error) => {
        if (error.response) {
          setAlert(error.response.data);
        } else {
          setAlert(error.message);
        }
        setSpinner(false);
      });
  }

  function updatePasswordInput(value: string) {
    if (value) {
      setConfirmPass(true);
    } else {
      setConfirmPass(false);
      setVerPasswordInput("");
    }
    setPasswordInput(value);
  }

  return (
    <div id="profileContainer">
      <div className="heading">Profile</div>
      <Form>
        <h1>User Information</h1>
        <Row>
          <Col>
            <Form.Group className="mb-3" controlId="formFName">
              <Form.Label>First Name</Form.Label>
              <Form.Control
                type="input"
                value={firstNameInput}
                onChange={(e) => setFirstNameInput(e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group className="mb-3" controlId="formLName">
              <Form.Label>Last Name</Form.Label>
              <Form.Control
                type="input"
                value={lastNameInput}
                onChange={(e) => setLastNameInput(e.target.value)}
              />
            </Form.Group>
          </Col>
        </Row>
        <Form.Group className="mb-3" controlId="formBio">
          <Form.Label>Bio</Form.Label>
          <Form.Control
            as="textarea"
            value={bioInput}
            onChange={(e) => setBioInput(e.target.value)}
          />
        </Form.Group>

        <h1>Communication & Security</h1>
        <Row>
          <Col>
            <Form.Group className="mb-3" controlId="formEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group className="mb-3" controlId="formPhone">
              <Form.Label>Phone Number</Form.Label>
              <Form.Control
                type="tel"
                value={phoneInput}
                onChange={(e) => setPhoneInput(e.target.value)}
              />
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col>
            <Form.Group className="mb-3" controlId="formPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                value={passwordInput}
                onChange={(e) => updatePasswordInput(e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group className="mb-3" controlId="formConfirmPassword">
              <Fade
                in={confirmPass}
                onEntering={() => setConfirmPassDisabled(false)}
                onExited={() => setConfirmPassDisabled(true)}
              >
                <div>
                  <Form.Label>Confirm Password</Form.Label>
                  <Form.Control
                    disabled={confirmPassDisabled}
                    type="password"
                    value={verPasswordInput}
                    onChange={(e) => setVerPasswordInput(e.target.value)}
                  />
                </div>
              </Fade>
            </Form.Group>
          </Col>
        </Row>

        <Form.Group className={`text-center mb-3`} controlId="formAlert">
          <Alert
            variant="danger"
            dismissible={true}
            show={alert ? true : false}
            onClose={() => setAlert("")}
          >
            {alert}
          </Alert>
        </Form.Group>

        <Form.Group className="text-center mb-3" controlId="formBtn">
          <Button
            variant="warning"
            type="submit"
            onClick={(e) => {
              e.preventDefault();
              saveChanges();
            }}
          >
            <Spinner
              id="submitSpinner"
              className={spinner ? "" : "d-none"}
              as="span"
              animation="border"
              size="sm"
              role="status"
              aria-hidden="true"
            />
            Save Changes
          </Button>
        </Form.Group>
      </Form>
    </div>
  );
}

export default Profile;