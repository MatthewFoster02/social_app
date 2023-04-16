import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';

import postsAPI from '../apiHandlers/posts.js';
import Post from "./Post.js";

const DisplayPosts = ({props}) => 
{
    let navigate = useNavigate();
    const { id } = props;
    const [posts, setPosts] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isPending, setIsPending] = useState(true);

    useEffect(() =>
    {
        async function fetchPosts()
        {
            let res_posts = null;
            if(id == null)
            {
                res_posts = await postsAPI.getPostsNoQuery(page);
            }
            else
            {
                res_posts = await postsAPI.getPostsByQuery(id, page);
            }
            if(res_posts['statusText'] === 'OK')
            {
                const posts = await res_posts['data'];
                setPosts(posts.posts);
                setTotalPages(posts.totalPages);
                setIsPending(false);
            }
        }
        fetchPosts();
    }, [id]);

    const nextPage = () =>
    {
        if(page == totalPages) return;

        setPage(page + 1);
    }

    const previousPage = () =>
    {
        if(page == 1) return;

        setPage(page - 1);
    }

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
