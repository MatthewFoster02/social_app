import axios from 'axios';

const baseURL = 'http://127.0.0.1:8000/users';

class UsersAPIConnection
{
    register(body)
    {
        return axios.post(baseURL + '/register', body);
    }
    
    login(body)
    {
        return axios.post(baseURL + '/login', body);    
    }

    getUser(id)
    {
        return axios.get(baseURL + `/${id}`);
    }
    
    getUsers(query)
    {
        return axios.get(baseURL + `/?query=${query}`);
    }
    
    update(id, body, token)
    {
        return axios.patch(baseURL + `/${id}`, body, {headers: {Authorization: `Bearer ${token}`}});
    }

    delete(id, token)
    {
        return axios.delete(baseURL + `/${id}`, {headers: {Authorization: `Bearer ${token}`}});
    }
}
export default new UsersAPIConnection;
