import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";

import useAuth from '../hooks/useAuth.js';
import postsAPI from "../apiHandlers/posts.js";
import '../style/HomeHeader.css';

const HomeHeader = () => 
{
    const { auth } = useAuth();
    const [apiError, setApiError] = useState();
    let navigate = useNavigate();

    const {
        register: registerPost, handleSubmit: handleSubmitPost, formState: { errorsPost }
    } = useForm();

    const {
        register: registerGPT, handleSubmit: handleSubmitGPT, formState: { errorsGPT }
    } = useForm();

    const createPost = async (content) =>
    {
        if(!auth?.username)
        {
            setApiError('Need to be logged in to create a post...');
            return;
        }
        const post_res = await postsAPI.createPost(
            {
                'author': auth.id,
                'content': content.post,
                'date_posted': Date.now(),
                'likes': 0,
                'author_profile_pic': auth.profile_pic,
                'author_username': auth.username,
                'comment': false
            }, auth.token);
        if(post_res['status'] === 201)
        {
            const postData = await post_res['data'];
            navigate(`/post/${postData._id}`, { replace: true });
        }
        else
        {
            let errors = await post_res['data'];
            console.log(errors);
            setApiError(errors['detail']);
        }
    }

    const onErrors = (errors) => console.error(errors);

    // GPT API / create post osttoggle
    const toggleGPT = () =>
    {
        const formPost = document.getElementById('post-form');
        const formGPT = document.getElementById('gpt-form');
        const switchBtn = document.getElementById('toggle');

        formPost.classList.toggle('no-display');
        formGPT.classList.toggle('no-display');

        switchBtn.innerHTML === 'Assistant' ? switchBtn.innerHTML = 'Post' : switchBtn.innerHTML = 'Assistant';
    }

    const askGPT = async (prompt) =>
    {
        const promptTxt = "Social media post on: " + prompt.gpt;
        const txtArea = document.getElementById('post');

        const response = await postsAPI.getGPTResponse({'prompt': promptTxt.toString()});
        const gpt_response = await response['data'];
        console.log(gpt_response);
        toggleGPT();
        txtArea.value = gpt_response;
    }

    return (
        <div className="wrapperHH">
            <h2 className="titleLogin">
                Home
            </h2>
            <div className="form">
                <form onSubmit={handleSubmitPost(createPost, onErrors)} id="post-form">
                    <div className="add-post">
                        <div className="input">
                            <textarea
                                placeholder="What are you going to post?"
                                className="make-post"
                                cols="40"
                                rows="7"
                                resize="none"
                                name="post"
                                id="post"
                                {...registerPost('post', { required: '*Post content required'})}
                            >
                            </textarea>
                            <span className="err">
                                {
                                    errorsPost?.post && errorsPost.post.message
                                }
                            </span>
                        </div>
                        <button className="btn-hh">
                            Post
                        </button>
                    </div>
                </form>
                <form onSubmit={handleSubmitGPT(askGPT, onErrors)} id="gpt-form" className="no-display">
                    <div className="add-post">
                        <div className="input">
                            <textarea
                                placeholder="Enter prompt for GPT..."
                                className="make-post"
                                cols="40"
                                rows="7"
                                resize="none"
                                name="gpt"
                                id="gpt"
                                {...registerGPT('gpt', { required: '*Prompt required'})}
                            >
                            </textarea>
                            <span className="err">
                                {
                                    errorsGPT?.gpt && errorsGPT.gpt.message
                                }
                            </span>
                        </div>
                        <button className="btn-hh">
                            Ask
                        </button>
                    </div>
                </form>
                <button className="btn-hh" onClick={toggleGPT} id="toggle">
                    Assistant
                </button>
            </div>
            {
                apiError && (
                    <div className='error-alert'>
                            <span>{apiError}</span>
                    </div>
                )
            }
        </div>
    );
}
export default HomeHeader;
