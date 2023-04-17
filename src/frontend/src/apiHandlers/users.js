import axios from 'axios';

let axiosConfig = axios.create({validateStatus: () => true});

const baseURL = 'http://127.0.0.1:8000/users';

class UsersAPIConnection
{
    register(body)
    {
        return axiosConfig.post(baseURL + '/register', body);
    }
    
    login(body)
    {
        return axiosConfig.post(baseURL + '/login', body);
    }

    getUser(id)
    {
        return axiosConfig.get(baseURL + `/${id}`);
    }
    
    getUsers(query)
    {
        return axiosConfig.get(baseURL + `/?query=${query}`);
    }
    
    update(id, body, token)
    {
        console.log(body);
        return axiosConfig.patch(baseURL + `/${id}`, body, {headers: {'Content-Type': 'multipart/form-data', Authorization: `Bearer ${token}`}});
    }

    delete(id, token)
    {
        return axiosConfig.delete(baseURL + `/${id}`, {headers: {Authorization: `Bearer ${token}`}});
    }
}
export default new UsersAPIConnection();
