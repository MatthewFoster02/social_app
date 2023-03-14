from fastapi.testclient import TestClient

from main import app

baseURL = '/posts'

# Testing getting all posts
def test_get_all_no_query():
    with TestClient(app) as client:
        response = client.get(
            baseURL
        )
        assert response.status_code == 200
        posts = response.json()['posts']
        assert posts[0] == {
            "_id": "640be4999ad12d55bbb6804a",
			"author": "6408c06a8fde09a588c963ce",
			"content": "Matty's second post",
			"date_posted": 5500,
			"likes": 1000,
			"comments": None
        }

def test_get_all_specific_author():
    with TestClient(app) as client:
        response = client.get(
            baseURL + f"?userID=640bedd4f9aaa06b8a255831"
        )
        assert response.status_code == 200
        posts = response.json()['posts']
        assert posts[0] == {
            "_id": "640bee2070f109d62fc5dce1",
			"author": "640bedd4f9aaa06b8a255831",
			"content": "This is a test post",
			"date_posted": 7000,
			"likes": 2000000,
			"comments": None
        }

def test_get_all_specific_author_error_404():
    with TestClient(app) as client:
        response = client.get(
            baseURL + f"?userID=fakeID"
        )
        assert response.status_code == 404
        assert response.json() == {'detail': 'User with id: fakeID not found'}        

# Testing get by ID route
def test_get_by_id_success():
    with TestClient(app) as client:
        response = client.get(
            baseURL + "/640be4999ad12d55bbb6804a"
        )
        assert response.status_code == 200
        assert response.json() == {
            "_id": "640be4999ad12d55bbb6804a",
            "author": "6408c06a8fde09a588c963ce",
            "content": "Matty's second post",
            "date_posted": 5500,
            "likes": 1000,
            "comments": None
        }

def test_get_by_id_error_404():
    with TestClient(app) as client:
        response = client.get(
            baseURL + "/fakePost"
        )
        assert response.status_code == 404
        assert response.json() == {'detail': 'Post with id: fakePost not found'}

# Testing likes route
def test_like_post_404():
    with TestClient(app) as client:
        response = client.patch(
            baseURL + "/like/fakePost"
        )
        assert response.status_code == 404
        assert response.json() == {'detail': 'Post with id: fakePost not found'}

def test_like_post():
    with TestClient(app) as client:
        response = client.get(
            baseURL + "/640d1c713b00ed399996e46f"
        )
        json_data = response.json()
        likes = json_data['likes']
        likes += 1 # Increase the previous like count to compare after calling like route

        res = client.patch(
            baseURL + '/like/640d1c713b00ed399996e46f'
        )
        assert res.status_code == 200
        assert res.json() == {
            "_id": "640d1c713b00ed399996e46f",
            "author": "6408c06a8fde09a588c963ce",
            "content": "Matty's First post",
            "date_posted": 2002,
            "likes": likes,
            "comments": []
        }

# Testing get all comments
def test_get_comments_404():
    with TestClient(app) as client:
        response = client.get(
            baseURL + "/comment/fakePost"
        )
        assert response.status_code == 404
        assert response.json() == {'detail': 'Post with id: fakePost not found'}

def test_get_all_comments_no_comment():
    with TestClient(app) as client:
        response = client.get(
            baseURL + "/comment/640be4999ad12d55bbb6804a"
        )
        assert response.status_code == 200
        assert response.json() == {'message': 'No comments'}

def test_get_all_comments_success():
    with TestClient(app) as client:
        response = client.get(
            baseURL + "/comment/6410f93ba8311c9ced4da2da"
        )
        assert response.status_code == 200
        comments = response.json()
        assert len(comments) == 1
        assert comments[0] == {
            "_id": "6410f9aea8311c9ced4da2db",
            "author": "6408c06a8fde09a588c963ce",
            "content": "bRILLIANT",
            "date_posted": 420,
            "likes": 2,
            "comments": None
        }
