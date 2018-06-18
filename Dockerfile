FROM node:carbon

ARG GIT_COMMIT=unspecified
LABEL git_commit=$GIT_COMMIT

# Create the app directory
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install --only=production
COPY ./build .
COPY ./views ./views

EXPOSE 8080
CMD [ "npm", "run", "serve" ]

