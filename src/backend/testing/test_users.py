# Only going to test errors and cases where users are not created/deleted and routes that are not protected

from fastapi.testclient import TestClient

from main import app

baseURL = '/users'

# Testing register route
def test_register_email_exists():
    with TestClient(app) as client:
        response = client.post(
            baseURL + "/register",
            json={
                'firstname': 'Matthew',
                'lastname': 'Foster',
                'username': 'maatty',
                'email': 'mattfoster02@outlook.com',
                'password': 'password',
                'bio': 'It\'s a me Mario',
                'birthday': 12345678,
                'profile_pic': 'http://res.cloudinary.com/dphekriyz/image/upload/v1678237366/profile_pics/e1ydvozojlzhdzr353oj.jpg'
            })
        assert response.status_code == 409
        assert response.json() == {"detail": "User with email mattfoster02@outlook.com already exists"}

# Testing get user by ID
def test_get_user_success():
    with TestClient(app) as client:
        response = client.get(f'{baseURL}/6408c06a8fde09a588c963ce')
        assert response.status_code == 200
        res_data = response.json()
        assert res_data == {
            '_id': '6408c06a8fde09a588c963ce',
            'firstname': 'Matthew',
            'lastname': 'Foster',
            'username': 'Maatty',
            'email': 'mattfoster02@outlook.com',
            'password': '$2b$12$X.LIahiJMJ9X0rl8nQpu6etUyrqMO0zLDYbG.UlKbMTMwrJAfyyK6',
            'bio': 'Hi there! My BIO!',
            'birthday': 1025388000000,
            'profile_pic': 'http://res.cloudinary.com/dphekriyz/image/upload/v1681894373/profile_pics/faoavl7rj8aan0vxhppx.jpg'
        } # Checking other fields

def test_get_user_404():
    with TestClient(app) as client:
        response = client.get(baseURL + '/fakeid')
        assert response.status_code == 404
        assert response.json() == {'detail': 'User with id: fakeid not found'}

# Testing login route
def test_login_email_not_existing():
    with TestClient(app) as client:
        response = client.post(
            baseURL + '/login',
            json={
                'email': 'pop@outlook.com',
                'password': 'crackTh1s'
            }
        )
        assert response.status_code == 401
        assert response.json() == {'detail': 'No account with entered email'}

def test_login_incorrect_password():
    with TestClient(app) as client:
        response = client.post(
            baseURL + '/login',
            json={
                'email': 'mattfoster02@outlook.com',
                'password': 'crackTh1s'
            }
        )
        assert response.status_code == 401
        assert response.json() == {'detail': 'Incorrect password'}

def test_login_success():
    with TestClient(app) as client:
        response = client.post(
            baseURL + '/login',
            json = {
                'email': 'mattfoster02@outlook.com',
                'password': 'Shercock'
            }
        )
        assert response.status_code == 200
        user = response.json()['user']
        assert user == {
            '_id': '6408c06a8fde09a588c963ce',
            'firstname': 'Matthew',
            'lastname': 'Foster',
            'username': 'Maatty',
            'email': 'mattfoster02@outlook.com',
            'password': '$2b$12$X.LIahiJMJ9X0rl8nQpu6etUyrqMO0zLDYbG.UlKbMTMwrJAfyyK6',
            'bio': 'Hi there! My BIO!',
            'birthday': 1025388000000,
            'profile_pic': 'http://res.cloudinary.com/dphekriyz/image/upload/v1681894373/profile_pics/faoavl7rj8aan0vxhppx.jpg'
        }

# Testing get user by query
def test_query_404():
    with TestClient(app) as client:
        response = client.get(f'{baseURL}?query=fakeUser')
        assert response.status_code == 404
        assert response.json() == {'detail': 'No users found matching fakeUser'}

def test_query_success():
    with TestClient(app) as client:
        response = client.get(f'{baseURL}?query=maat')
        assert response.status_code == 200
        res_data = response.json()
        assert len(res_data) == 2
        assert res_data[0] == {
            '_id': '6408c06a8fde09a588c963ce',
            'firstname': 'Matthew',
            'lastname': 'Foster',
            'username': 'Maatty',
            'email': 'mattfoster02@outlook.com',
            'password': '$2b$12$X.LIahiJMJ9X0rl8nQpu6etUyrqMO0zLDYbG.UlKbMTMwrJAfyyK6',
            'bio': 'Hi there! My BIO!',
            'birthday': 1025388000000,
            'profile_pic': 'http://res.cloudinary.com/dphekriyz/image/upload/v1681894373/profile_pics/faoavl7rj8aan0vxhppx.jpg'
        }
