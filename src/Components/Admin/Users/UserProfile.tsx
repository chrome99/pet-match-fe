import React, { useEffect, useState, useContext } from "react";
import { server } from "../../../App";
import "./UserProfile.css";
import { Alert, Spinner, Button } from "react-bootstrap";
import {
  IUser,
  UserContext,
  UserContextType,
} from "../../../Contexts/UserContext";
import { IPet } from "../../Pet/PetProfile";
import PetsCollection from "../../Search/PetsCollection";

interface UserProfileProps {
  user: IUser;
  updateUserAdmin: (userToUpdate: IUser) => void;
}

function UserProfile({ user, updateUserAdmin }: UserProfileProps) {
  //user is the user who's data is being shown, currentUser is the connected admin user looking at the data
  const { user: currentUser } = useContext(UserContext) as UserContextType;
  const [alert, setAlert] = useState("");
  const [userPets, setUserPets] = useState<IPet[] | undefined | null>(
    undefined
  );

  useEffect(() => {
    if (user.pets.length === 0) {
      setUserPets(null);
      return;
    }

    server
      .get("pet/multiple?ids=" + user.pets.toString())
      .then((response) => {
        response.data.map((pet: any) => {
          return (pet.id = pet._id);
        });
        setUserPets(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [user.pets]);

  function changeAdmin() {
    if (!currentUser) return;

    server
      .post(
        "user/admin",
        { id: user.id, adminValue: !user.admin },
        {
          headers: {
            admin: currentUser.id,
            "x-access-token": currentUser.token,
          },
        }
      )
      .then((response) => {
        response.data.id = response.data._id;
        updateUserAdmin(response.data);
      })
      .catch((error) => {
        console.log(error.response.data);
      });
  }

  return (
    <div id="userProfile">
      <div id="userProfileHeading">
        <h1 className={user.admin ? "adminStyling" : ""}>
          {user.firstName} {user.lastName}
        </h1>
        {currentUser && user.id !== currentUser.id ? (
          <Button variant="warning" onClick={changeAdmin}>
            {user.admin ? "Remove From Admins" : "Add To Admins"}
          </Button>
        ) : (
          ""
        )}
      </div>
      <h3>Profile Details</h3>
      <div id="userInfo">
        <div>Email: {user.email}</div>
        <div>Phone: {user.phone}</div>
        <div>Bio: {user.bio}</div>
        <div>
          Admin: {user.admin ? <span className="adminStyling">Yes</span> : "No"}
        </div>
        <div>
          Pets Owned:{" "}
          {userPets === undefined
            ? "Loading..."
            : userPets === null
            ? "None"
            : userPets.map((pet, index, arr) => {
                if (index !== arr.length - 1) {
                  //if not last
                  return pet.name + ", ";
                } else {
                  //if last
                  return pet.name + ".";
                }
              })}
        </div>
      </div>
      <h3>Pets</h3>
      {userPets === undefined ? (
        <div className="spinnerDiv">
          <Spinner animation="border" role="status" />
        </div>
      ) : userPets === null ? (
        "This user currently does not own any pets."
      ) : (
        <div id="userPetsCollection">
          <PetsCollection pets={userPets} />
        </div>
      )}

      <Alert
        className="mb-0"
        variant="danger"
        dismissible={true}
        show={alert ? true : false}
        onClose={() => setAlert("")}
      >
        {alert}
      </Alert>
    </div>
  );
}

export default UserProfile;
