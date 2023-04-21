import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";

import users from "../apiHandlers/users.js";
import '../style/Search.css';
import search from '../images/search-gray.svg';
import ProfilePreview from "./ProfilePreview.js";

const Search = () => 
{
    const [apiError, setApiError] = useState();
    const [profiles, setProfiles] = useState([]);
    const [isPending, setIsPending] = useState(false);

    const {
        register, handleSubmit, watch
    } = useForm();

    const searchByString = async (query) =>
    {
        setIsPending(true);
        setProfiles([]);
        const query_res = await users.getUsers(query.search);
        if(query_res['statusText'] === 'OK')
        {
            const profileData = await query_res['data'];
            setProfiles(profileData.slice(0, 3));
            setIsPending(false);
            setApiError(null);
        }
        else
        {
            const errors = await query_res['data']
            console.log(errors);
            setApiError(errors['detail']);
            setProfiles([]);
            setIsPending(false);
        }
    }
    
    const searchValue = watch('search');
    useEffect(() => {
        if (searchValue === '') {
            setProfiles([]);
            setApiError(null);
        }
    }, [searchValue, watch]);


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
                        autoComplete="off"
                        name="search"
                        id="search"
                        {...register('search', { required: '*Some text required for search'})}
                    />
                    <button className="search">
                        <img className="mag-glass" src={search} alt="" />
                    </button>
                </div>
            </form>
            {
                apiError && (
                    <div className='error-alert'>
                            <span>{apiError}</span>
                    </div>
                )
            }
            <div className="search-results">
                {
                    isPending && <div>
                        <h2>Loading Profiles...</h2>
                    </div>
                }
                {
                    profiles && profiles.map((el) =>
                    {
                        return (
                            <ProfilePreview key={el._id} profile={el} />
                        )
                    })
                }
            </div>
        </div>
    );
}
export default Search;
