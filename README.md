# Social Chating React App.

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).
This is a frontend code for chat app. if you want to run this app on your local envirement, follow the following
instruction.

## Instructions to run the application in local envirement.

1.clone the repository into your local computer.

2.create .env file in root directory and add the following variable in to it. 

    REACT_APP_PUBLIC_FOLDER=http://localhost:3000/img/
    REACT_APP_API_URL=http://localhost:5000/api/
    REACT_APP_API_SOCKET_URL=http://localhost:5000/
    REACT_APP_AWS_URL=http://localhost:3000/img/
    
make sure that chat app server side application running on port 5000. you can get backend code related to this app by [click here.](https://github.com/sachintha-chathuranga/Chat-App-Backend)

3.run the command `npm install`. this will install all the dependency.

4.run the command `npm start`.


5.To clear the cache
rm -rf node_modules/.cache
