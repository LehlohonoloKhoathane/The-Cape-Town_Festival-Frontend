FROM node:20 as build-stage
WORKDIR /app


# Install dependencies and build the Vue.js application
RUN npm install
RUN npm run build

FROM nginx:latest

# Copy the built files from the build-stage
COPY --from=build-stage /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

LABEL authors="Lehlohonolo Khoathane"

