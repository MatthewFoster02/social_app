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

    // GPT API stuff
    const toggleGPT = () =>
    {
        const formPost = document.getElementById('post-form');
        const formGPT = document.getElementById('gpt-form');
        const switchBtn = document.getElementById('toggle');

        formPost.classList.toggle('no-display');
        formGPT.classList.toggle('no-display');

        switchBtn.innerHTML === 'Assistant' ? switchBtn.innerHTML = 'Post' : switchBtn.innerHTML = 'Assistant';
    }

    return (
        <div className="wrapperHH">
            <h2 className="titleLogin">
                Home
            </h2>
            <div class="form">
                <form onSubmit={handleSubmit(createPost, onErrors)} id="post-form">
                    <div className="add-post">
                        <textarea 
                            placeholder="What are you going to post?"
                            className="make-post"
                            cols="70"
                            rows="4"
                            resize="none"
                            name="post"
                            id="post"
                        >
                        </textarea>
                        <button className="btn-hh">
                            Post
                        </button>
                    </div>
                </form>
                <form onSubmit={handleSubmit(createPost, onErrors)} id="gpt-form" className="no-display">
                    <div className="add-post">
                        <textarea 
                            placeholder="Enter prompt for GPT"
                            className="make-post"
                            cols="70"
                            rows="4"
                            resize="none"
                            name="post"
                            id="post"
                        >
                        </textarea>
                        <button className="btn-hh">
                            Ask
                        </button>
                    </div>
                </form>
                <button className="btn-hh" onClick={toggleGPT} id="toggle">
                    Assistant
                </button>
            </div>
        </div>
    );
}
export default HomeHeader;
