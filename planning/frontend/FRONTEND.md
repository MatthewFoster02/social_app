# Frontend Structure

### Relationship diagram between components (Basic/High Level)
![FrontendStructure](https://github.com/MatthewFoster02/social_app/blob/main/planning/frontend/frontendstructure.png)

The above diagram shows a simple version of the structure of the frontend application. Created in React, the application is wrapped by the AuthProvider component which allows for user information to be stored and shared among components. 

Then there is page level components which are an entire page to themselves, login etc., there is also subcomponents which make up the various pages, examples of these include Post. (Individual post element).

The frontend needs to interact with the backend to retrieve user/post information, add users/posts etc. To this end there is a package with two API handler classes, one for posts and one for users. Using axios these classes provide methods to the rest of the application where each end point of the API in the backend can be reached. This abstracts the setting up of the API call to these methods, rather than doing so in every single react component.

# Design files from Adobe Xd

## Home Page Logged Out
![HomePageLoggedOut](https://github.com/MatthewFoster02/social_app/blob/main/planning/frontend/Web%201920%20%E2%80%93%201.png)
## Home Page Logged In
![HomePageLoggedIn](https://github.com/MatthewFoster02/social_app/blob/main/planning/frontend/Web%201920%20%E2%80%93%202.png)
## Profile Page
![ProfilePage](https://github.com/MatthewFoster02/social_app/blob/main/planning/frontend/Web%201920%20%E2%80%93%203.png)
## Post Display
![PostDisplay](https://github.com/MatthewFoster02/social_app/blob/main/planning/frontend/Web%201920%20%E2%80%93%204.png)