#Build Stage
FROM node:18-alpine AS build
WORKDIR /frontend
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
 
# Production Stage
FROM nginx:stable-alpine AS production
COPY --from=build /frontend/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]