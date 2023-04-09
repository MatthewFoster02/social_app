import axios from "axios";

const baseURL = 'http://127.0.0.1:8000/posts';

class PostsAPIConnection
{
    createPost(body, token)
    {
        return axios.post(baseURL + '/', body, {headers: {Authorization: `Bearer ${token}`}});
    }

    getPostsByQuery(query, page)
    {
        return axios.get(baseURL + `/?userID=${query}&page=${page}`);
    }
    
    getPostByID(id)
    {
        return axios.get(baseURL + `/${id}`);
    }

    delete(id, token, comment)
    {
        return axios.delete(baseURL + `/${id}?comment=${comment}`, {headers: {Authorization: `Bearer ${token}`}});
    }

    like(id)
    {
        return axios.patch(baseURL + `/like/${id}`);
    }

    comment(id, body, token)
    {
        return axios.post(baseURL + `/comment/${id}`, body, {headers: {Authorization: `Bearer ${token}`}});
    }

    getComments(id)
    {
        return axios.get(baseURL + `/comment/${id}`);
    }
}
export default new PostsAPIConnection;
