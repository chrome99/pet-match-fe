import React, { useState } from "react";
import { Button, Modal, Form, Alert } from "react-bootstrap";
import axios from "axios";
import "./Home.css";

interface LogInModalProps {
  modal: boolean;
  setModal: React.Dispatch<React.SetStateAction<boolean>>;
}
function LogInModal({ modal, setModal }: LogInModalProps) {
  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [alert, setAlert] = useState("");

  function login() {
    axios
      .post("http://localhost:8080/login", {
        email: emailInput,
        password: passwordInput,
      })
      .then(() => {
        console.log("Login Successful!");
        closeModal();
      })
      .catch((error) => {
        if (error.response) {
          setAlert(error.response.data);
        } else {
          setAlert(error.message);
        }
      });
  }

  function resetValues() {
    setEmailInput("");
    setPasswordInput("");
    setAlert("");
  }

  function closeModal() {
    resetValues();
    setModal(false);
  }

  return (
    <Modal show={modal} onHide={() => closeModal()}>
      <Modal.Header closeButton>
        <Modal.Title>Log In</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3" controlId="formEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
            />
          </Form.Group>
          <Form.Group className={`text-center`} controlId="formAlert">
            <Alert
              variant="danger"
              dismissible={true}
              show={alert ? true : false}
              onClose={() => setAlert("")}
            >
              {alert}
            </Alert>
          </Form.Group>
          <Form.Group className="text-center" controlId="formBtn">
            <Button
              variant="primary"
              type="submit"
              onClick={(e) => {
                e.preventDefault();
                login();
              }}
            >
              Sign In
            </Button>
          </Form.Group>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default LogInModal;
