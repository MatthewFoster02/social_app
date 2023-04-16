import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';

import postsAPI from '../apiHandlers/posts.js';
import Post from "./Post.js";

const DisplayPosts = ({props}) => 
{
    let navigate = useNavigate();
    const { id } = props;
    const [apiError, setApiError] = useState();
    const [posts, setPosts] = useState([]);
    const [isPending, setIsPending] = useState(true);

    useEffect(() =>
    {
        async function fetchPosts()
        {
            let res_posts = null;
            if(id == null)
            {
                res_posts = await postsAPI.getPostsNoQuery(1);
            }
            else
            {
                res_posts = await postsAPI.getPostsByQuery(id, 1);
            }
            console.log(res_posts);
            if(res_posts['statusText'] === 'OK')
            {
                const posts = await res_posts['data'];
                setPosts(posts.posts);
                console.log(posts);
                setIsPending(false);
            }
            else
            {
                let errors = await res_posts['data'];
                console.log(errors);
                setApiError(errors['detail']);
            }
        }
        fetchPosts();
    }, [id]);

    return (
        <div className="wrapperDP">
            {
                posts && posts.map((el) =>
                {
                    return (
                        <Post key={el._id} post = {el} />
                    )
                }
                )
            }
        </div>
    );
}
export default DisplayPosts;
