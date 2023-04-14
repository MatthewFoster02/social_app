import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";

import users from "../apiHandlers/users.js";
import './Search.css';
import search from '../images/search-gray.svg';

const Search = () => 
{
    const [apiError, setApiError] = useState();
    let navigate = useNavigate();

    const {
        handleSubmit
    } = useForm();

    const searchByString = async (query) =>
    {
        const query_res = await users.getUsers(query);
        // Handle query
        // Navigate to results of search
    }

    const onErrors = (errors) => console.error(errors);

    return (
        <div className="wrapperSearch">
            <h2 className="titleLogin">
                Search
            </h2>
            <form onSubmit={handleSubmit(searchByString, onErrors)}>
                <div className="searchbar">
                    <input 
                        type="text"
                        placeholder="Who are you looking for?"
                        className="searchbarStyle"
                    />
                    <button className="search">
                        <img className="mag-glass" src={search} />
                    </button>
                </div>
            </form>
        </div>
    );
}
export default Search;
