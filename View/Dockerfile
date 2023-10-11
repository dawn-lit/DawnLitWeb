FROM node:18

# set a directory for the app
WORKDIR /usr/src/app

# copy all the files to the container
COPY package.json ./

# install dependencies
RUN npm install

# copy everything
COPY . .

# create a production build
RUN npm run build

# copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# copy production build
COPY /dist/angular-frontend /usr/share/nginx/html