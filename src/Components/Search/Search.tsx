import React, { useState, useRef } from "react";
import "./Search.css";
import SearchForm from "./SearchForm";
import PetsCollection from "./PetsCollection";
import { IPet } from "../Pet/PetProfile";
import { server } from "../../App";
import { Spinner } from "react-bootstrap";
import { MyAlert } from "../../Utils/MyForm";

function Search() {
  const [pets, setPets] = useState<IPet[] | null>(null);
  const [pagesCount, setPagesCount] = useState(0);
  const [spinner, setSpinner] = useState(false);
  const [alert, setAlert] = useState("");
  const [activePage, setActivePage] = useState(1);
  const queryRef = useRef("");

  function getPetsByQuery(
    query: string,
    setSubmitting: (isSubmitting: boolean) => void
  ) {
    queryRef.current = query;
    getPets(1, setSubmitting);
  }

  function getPets(
    page: number,
    setSubmitting?: (isSubmitting: boolean) => void
  ) {
    //replace the first instance of & with ?
    let query = queryRef.current + "&page=" + page;
    query = query.replace("&", "?");
    if (!setSubmitting) {
      setSpinner(true);
    }
    server
      .get("pet" + query)
      .then((response) => {
        //response.data returns two fields: "result" with pets data, and "count" with query count (all pets available for query)
        response.data.result.map((pet: any) => {
          return (pet.id = pet._id);
        });
        setActivePage(page);
        setPagesCount(Math.ceil(response.data.count / 30)); //30 pets per page
        setPets(response.data.result);
      })
      .catch((error) => {
        if (error.response) {
          setAlert(error.response.data);
        } else {
          setAlert(error.message);
        }
      })
      .finally(() => {
        if (setSubmitting) {
          setSubmitting(false);
        } else {
          setSpinner(false);
        }
      });
  }

  return (
    <div id="searchPage">
      <SearchForm getPetsByQuery={getPetsByQuery} />
      <div className="spinnerDiv mb-3">
        <MyAlert alert={alert} setAlert={setAlert} />
        <Spinner
          animation="border"
          role="status"
          className={spinner ? "" : "d-none"}
        />
      </div>
      {pets ? (
        <PetsCollection
          pets={pets}
          pages={pagesCount}
          getMorePets={getPets}
          activePage={activePage}
        />
      ) : null}
    </div>
  );
}

export default Search;
