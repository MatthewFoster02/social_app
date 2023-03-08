from fastapi.testclient import TestClient
import re

from main import app

baseURL = '/users'
pattern = r'^[0-9A-Fa-f]{24}$'

fake_users = [
    {
        '_id': '6407e5f24cbc1ea4165111de',
        'firstname': 'Matthew',
        'lastname': 'Foster',
        'username': 'maatty',
        'email': 'mattfoster02@outlook.com',
        'password': '$2b$12$VxglTPcTP./Xe.XEZn/qOuS7WiDRDagIlSnZkehMPS32NW.zRvuW2',
        'bio': 'It\'s a me Mario',
        'birthday': 30062002,
        'profile_pic': 'http://res.cloudinary.com/dphekriyz/image/upload/v1678237366/profile_pics/e1ydvozojlzhdzr353oj.jpg'
    },
    # {
    #     '_id': '1234',
    #     'firstname': 'Matthew',
    #     'lastname': 'Foster',
    #     'username': 'maatty',
    #     'email': 'mattfoster02@outlook.com',
    #     'password': '$2b$12$VxglTPcTP./Xe.XEZn/qOuS7WiDRDagIlSnZkehMPS32NW.zRvuW2',
    #     'bio': 'It\'s a me Mario',
    #     'birthday': 30062002,
    #     'profile_pic': 'http://res.cloudinary.com/dphekriyz/image/upload/v1678237366/'
    # },
]

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
                'password': '$2b$12$VxglTPcTP./Xe.XEZn/qOuS7WiDRDagIlSnZkehMPS32NW.zRvuW2',
                'bio': 'It\'s a me Mario',
                'birthday': 12345678,
                'profile_pic': 'http://res.cloudinary.com/dphekriyz/image/upload/v1678237366/profile_pics/e1ydvozojlzhdzr353oj.jpg'
            }
        )
        assert response.status_code == 201
        res_data = response.json()
        id = res_data['_id']
        del res_data['_id']
        assert re.match(pattern, id) # Checking Valid MongoDB ObjectID
        assert res_data == {
            'firstname': 'Matthew',
            'lastname': 'Foster',
            'username': 'maatty',
            'email': 'mattyfoster02@gmail.com',
            'password': '$2b$12$VxglTPcTP./Xe.XEZn/qOuS7WiDRDagIlSnZkehMPS32NW.zRvuW2',
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