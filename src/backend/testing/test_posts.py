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
            "_id": "6408c0c28fde09a588c963cf",
			"author": "6408c06a8fde09a588c963ce",
			"content": "Matty's first post",
			"date_posted": 5500,
			"likes": 1000,
			"comments": None
        }

def test_get_all_specific_author():
    with TestClient(app) as client:
        response = client.get(
            baseURL + f"?userID=640bdda103de9a1aac3df9cf"
        )
        assert response.status_code == 200
        posts = response.json()['posts']
        assert posts[0] == {
            "_id": "640be67a9ad12d55bbb6804b",
			"author": "640bdda103de9a1aac3df9cf",
			"content": "This is a test post",
			"date_posted": 7000,
			"likes": 2000000,
			"comments": None
        }

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
