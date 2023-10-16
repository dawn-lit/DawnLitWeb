# build environment
FROM node:18 as node

# set a directory for the app
WORKDIR /app

# copy all the necessary files to the container
COPY ./src ./src
COPY ./angular.json ./
COPY ./nginx.conf ./
COPY ./package.json ./
COPY ./tsconfig.json ./
COPY ./tsconfig.app.json ./
COPY ./tsconfig.spec.json ./

# install dependencies
RUN npm install

# create a production build
RUN npm run build --prod

# copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# using nginx env
FROM nginx:alpine

# copy production build
COPY --from=node /app/dist/angular-frontend /usr/share/nginx/html
