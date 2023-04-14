import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";

import postsAPI from "../apiHandlers/posts.js";
import './HomeHeader.css';

const HomeHeader = () => 
{
    const [apiError, setApiError] = useState();
    let navigate = useNavigate();

    const {
        handleSubmit
    } = useForm();

    const createPost = async (content) =>
    {


        const post_res = await postsAPI.createPost(content, "");
        // Handle post result
        // Navigate to home page
    }

    const onErrors = (errors) => console.error(errors);

    return (
        <div className="wrapperHH">
            <h2 className="titleLogin">
                Home
            </h2>
            <div class="form">
                <form onSubmit={handleSubmit(createPost, onErrors)}>
                    <div className="make-post">
                        <input
                            type="text"
                            placeholder="Who are you looking for?"
                            className="add-post"
                        />
                        <button className="post">
                            Post
                        </button>
                    </div>
                </form>
                <button className="gpt">
                    Assistant
                </button>
            </div>
        </div>
    );
}
export default HomeHeader;
