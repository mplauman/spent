FROM node:carbon

# Create the app directory
WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

ARG GIT_COMMIT=unspecified
LABEL git_commit=$GIT_COMMIT
COPY . .

EXPOSE 8080
CMD [ "npm", "start" ]

