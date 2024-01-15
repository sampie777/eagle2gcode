# Docker file, thanks to: https://dzone.com/articles/how-to-dockerize-reactjs-app
# Build stage
FROM oven/bun:1 as build

RUN mkdir /app
WORKDIR /app

# install app dependencies
COPY package.json /app
COPY bun.lockb /app
RUN bun install --frozen-lockfile --production

# add app
COPY . /app

# build app
RUN bun run build

# Package stage
FROM nginx:1.21.3-alpine

# nginx configuration
#COPY docker/nginx/default.conf /etc/nginx/conf.d/default.conf

COPY --from=build /app/dist /usr/share/nginx/html

CMD ["nginx", "-g", "daemon off;"]
