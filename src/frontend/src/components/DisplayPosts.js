import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';

import postsAPI from '../apiHandlers/posts.js';
import Post from "./Post.js";
import './DisplayPosts.css';

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
                console.log(posts);
                setPosts(posts.posts.reverse());
                setTotalPages(posts.total_pages);
                setIsPending(false);
                console.log('TOTAL PAGES: '+totalPages);
            }
        }
        fetchPosts();
    }, [id, page]);

    const nextPage = () =>
    {
        if(page === totalPages) return;

        setPage(page + 1);
    }

    const previousPage = () =>
    {
        if(page === 1) return;

        setPage(page - 1);
    }

    return (
        <div className="wrapperDP">
            {
                isPending && <div>
                    <h2>Loading Posts...</h2>
                </div>
            }
            {
                posts && posts.map((el) =>
                {
                    return (
                        <Post key={el._id} post = {el} />
                    )
                }
                )
            }
            <div className="page-chooser">
                <div className="page-location">
                    <h4>Showing page <span className="current-page">{page}</span> of <span className="total-pages">{totalPages}</span>.</h4>
                </div>
                <div className="page-navigation">
                    <button className="previous-page" onClick={previousPage}>Previous Page</button>
                    <button className="next-page" onClick={nextPage}>Next Page</button>
                </div>
            </div>
        </div>
    );
}
export default DisplayPosts;
