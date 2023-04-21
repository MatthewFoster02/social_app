import axios from "axios";

let axiosConfig = axios.create({validateStatus: () => true});

const baseURL = 'http://127.0.0.1:8000/posts';

class PostsAPIConnection
{
    createPost(body, token)
    {
        return axiosConfig.post(baseURL + '/', body, {headers: {Authorization: `Bearer ${token}`}});
    }

    getPostsNoQuery(page)
    {
        return axiosConfig.get(baseURL + `/?page=${page}`);
    }

    getPostsByQuery(query, page)
    {
        return axiosConfig.get(baseURL + `/?userID=${query}&page=${page}`);
    }
    
    getPostByID(id)
    {
        return axiosConfig.get(baseURL + `/${id}`);
    }

    delete(id, token, comment)
    {
        return axiosConfig.delete(baseURL + `/${id}?comment=${comment}`, {headers: {Authorization: `Bearer ${token}`}});
    }

    like(id, body)
    {
        return axiosConfig.patch(baseURL + `/like/${id}`, body);
    }

    unlike(id, body)
    {
        return axiosConfig.patch(baseURL + `/unlike/${id}`, body);
    }

    comment(id, body, token)
    {
        return axiosConfig.post(baseURL + `/comment/${id}`, body, {headers: {Authorization: `Bearer ${token}`}});
    }

    getComments(id)
    {
        return axiosConfig.get(baseURL + `/comment/${id}`);
    }

    getGPTResponse(body)
    {
        return axiosConfig.post(baseURL + '/gpt', body);
    }

    updatePostPictures(body)
    {
        return axiosConfig.patch(baseURL + '/update-pic', body);
    }
}
export default new PostsAPIConnection();
