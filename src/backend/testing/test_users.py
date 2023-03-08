from fastapi.testclient import TestClient
import re

from main import app

baseURL = '/users'
id_pattern = r'^[0-9A-Fa-f]{24}$'
password_pattern = r'^\$2[aby]\$[0-9]{2}\$[./A-Za-z0-9]{53}$'

id_new_user = ''

# Testing register route

def test_register_success():
    with TestClient(app) as client:
        response = client.post(
            baseURL + "/register",
            json={
                'firstname': 'Matthew',
                'lastname': 'Foster',
                'username': 'maatty',
                'email': 'mattyfoster02@gmail.com',
                'password': 'password',
                'bio': 'It\'s a me Mario',
                'birthday': 12345678,
                'profile_pic': 'http://res.cloudinary.com/dphekriyz/image/upload/v1678237366/profile_pics/e1ydvozojlzhdzr353oj.jpg'
            }
        )
        assert response.status_code == 201
        res_data = response.json()
        id = res_data['_id']
        id_new_user = id
        password = res_data['password']
        del res_data['_id']
        del res_data['password']
        assert re.match(id_pattern, id) # Checking Valid MongoDB ObjectID
        assert re.match(password_pattern, password) # checking valid password hash
        assert res_data == {
            'firstname': 'Matthew',
            'lastname': 'Foster',
            'username': 'maatty',
            'email': 'mattyfoster02@gmail.com',
            'bio': 'It\'s a me Mario',
            'birthday': 12345678,
            'profile_pic': 'http://res.cloudinary.com/dphekriyz/image/upload/v1678237366/profile_pics/e1ydvozojlzhdzr353oj.jpg'
        } # Checking other fields


def test_register_email_exists():
    with TestClient(app) as client:
        response = client.post(
            baseURL + "/register",
            json={
                'firstname': 'Matthew',
                'lastname': 'Foster',
                'username': 'maatty',
                'email': 'mattfoster02@outlook.com',
                'password': '$2b$12$VxglTPcTP./Xe.XEZn/qOuS7WiDRDagIlSnZkehMPS32NW.zRvuW2',
                'bio': 'It\'s a me Mario',
                'birthday': 30062002,
                'profile_pic': 'http://res.cloudinary.com/dphekriyz/image/upload/v1678237366/'
            })
        assert response.status_code == 409
        assert response.json() == {"detail": "User with email mattfoster02@outlook.com already exists"}

# Testing get user by ID
# def test_get_user_success():
#     with TestClient(app) as client:
#         response = client.get(f'{baseURL}/6407e5f24cbc1ea4165111de')
#         assert response.status_code == 200
#         res_data = response.json()
#         password = res_data['password']
#         del res_data['password']
#         assert re.match(password_pattern, password) # checking valid password hash
#         assert res_data == {
#             '_id': '6407e5f24cbc1ea4165111de',
#             'firstname': 'Matthew',
#             'lastname': 'Foster',
#             'username': 'maatty',
#             'email': 'mattfoster02@outlook.com',
#             'bio': 'It\'s a me Mario',
#             'birthday': 30062002,
#             'profile_pic': 'http://res.cloudinary.com/dphekriyz/image/upload/v1678237366/profile_pics/e1ydvozojlzhdzr353oj.jpg'
#         } # Checking other fields

# def test_get_user_404():
#     with TestClient(app) as client:
#         response = client.get(baseURL + '/fakeid')
#         assert response.status_code == 404
#         assert response.json() == {'detail': 'User with id: fakeid not found'}

