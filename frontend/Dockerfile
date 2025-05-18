# Build stage
FROM node:18 AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Production stage
FROM node:18-slim

WORKDIR /app

# Only copy the build output and necessary files
COPY --from=build /app/build ./build
COPY --from=build /app/package*.json ./

RUN npm install --omit=dev

EXPOSE 3000

CMD ["npx", "serve", "-s", "build", "-l", "3000"]