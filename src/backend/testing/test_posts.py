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
            "_id": "643b3e370b611ee82b522ae0",
			"author": "6408c06a8fde09a588c963ce",
			"content": "Paw-some news! My furry bestie is the cutest pup in the park! 🐾🐶❤️ Whether we're sniffing flowers or chasing squirrels, my dog's tail never stops wagging. Life is simply better with a four-legged friend by your side. #DogLove #ParkPals 🌳",
			"date_posted": 1681604151774,
			"likes": 0,
			"comments": None,
            "author_profile_pic": "http://res.cloudinary.com/dphekriyz/image/upload/v1681894373/profile_pics/faoavl7rj8aan0vxhppx.jpg",
            "author_username": "Maatty",
            "comment": False,
            "likers": []
        }

def test_get_all_specific_author():
    with TestClient(app) as client:
        response = client.get(
            baseURL + f"?userID=6408c06a8fde09a588c963ce"
        )
        assert response.status_code == 200
        posts = response.json()['posts']
        assert posts[0] == {
            "_id": "643b3e370b611ee82b522ae0",
			"author": "6408c06a8fde09a588c963ce",
			"content": "Paw-some news! My furry bestie is the cutest pup in the park! 🐾🐶❤️ Whether we're sniffing flowers or chasing squirrels, my dog's tail never stops wagging. Life is simply better with a four-legged friend by your side. #DogLove #ParkPals 🌳",
			"date_posted": 1681604151774,
			"likes": 0,
			"comments": None,
            "author_profile_pic": "http://res.cloudinary.com/dphekriyz/image/upload/v1681894373/profile_pics/faoavl7rj8aan0vxhppx.jpg",
            "author_username": "Maatty",
            "comment": False,
            "likers": []
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
            baseURL + "/643b3e370b611ee82b522ae0"
        )
        assert response.status_code == 200
        assert response.json() == {
            "_id": "643b3e370b611ee82b522ae0",
			"author": "6408c06a8fde09a588c963ce",
			"content": "Paw-some news! My furry bestie is the cutest pup in the park! 🐾🐶❤️ Whether we're sniffing flowers or chasing squirrels, my dog's tail never stops wagging. Life is simply better with a four-legged friend by your side. #DogLove #ParkPals 🌳",
			"date_posted": 1681604151774,
			"likes": 0,
			"comments": None,
            "author_profile_pic": "http://res.cloudinary.com/dphekriyz/image/upload/v1681894373/profile_pics/faoavl7rj8aan0vxhppx.jpg",
            "author_username": "Maatty",
            "comment": False,
            "likers": []
        }

def test_get_by_id_error_404():
    with TestClient(app) as client:
        response = client.get(
            baseURL + "/fakePost"
        )
        assert response.status_code == 404
        assert response.json() == {'detail': 'Post with id: fakePost not found'}

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
            baseURL + "/comment/6441d62cb4364ef6e4701559"
        )
        assert response.status_code == 202
        assert response.json() == {'message': 'No comments'}

def test_get_all_comments_success():
    with TestClient(app) as client:
        response = client.get(
            baseURL + "/comment/6441d8ccb4364ef6e470155c"
        )
        assert response.status_code == 200
        comments = response.json()
        assert len(comments) == 1
        assert comments[0] == {
            "_id": "6441e181b4364ef6e470155d",
            "author": "6408c06a8fde09a588c963ce",
            "content": "It really is!",
            "date_posted": 1682039169136,
            "likes": 0,
            "comments": None,
            "author_profile_pic": "http://res.cloudinary.com/dphekriyz/image/upload/v1681894373/profile_pics/faoavl7rj8aan0vxhppx.jpg",
            "author_username": "Maatty",
            "comment": True,
            "likers": None
        }
