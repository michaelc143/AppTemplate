# Build and Push Docker Images

This GitHub Actions workflow automates the process of building Docker images for the frontend and backend components of your application and pushing them to Docker Hub.

**Note**: This requires having 2 secrets in your repository:

* DOCKER_HUB_USERNAME: Your DockerHub username
* DOCKER_HUB_ACCESS_TOKEN: Your PAT created within DockerHub

## Workflow Triggers

The workflow is triggered on pushes to the `main` branch.

```yaml
on:
  push:
    branches:
      - main
```

## Jobs

### Build and Push Frontend Docker Image

This job builds the Docker image for the frontend component of your application and pushes it to Docker Hub.

```yaml
build-and-push-frontend:
  runs-on: ubuntu-latest

  steps:
    - name: Checkout repository
      uses: actions/checkout@v3

    - name: Set up Docker Buildx
      uses: docker/setup-buildx-action@v3

    - name: Login to Docker Hub
      uses: docker/login-action@v3
      with:
        username: ${{ secrets.DOCKER_HUB_USERNAME }}
        password: ${{ secrets.DOCKER_HUB_ACCESS_TOKEN }}

    - name: Build and push frontend Docker image
      uses: docker/build-push-action@v5
      with:
        context: ./frontend
        push: true
        tags: yourDockerHubUsername/apptemplatefrontend:latest
```

### Build and Push Backend Docker Image

This job builds the Docker image for the backend component of your application and pushes it to Docker Hub.

```yaml
build-and-push-backend:
  runs-on: ubuntu-latest

  steps:
    - name: Checkout repository
      uses: actions/checkout@v3

    - name: Set up Docker Buildx
      uses: docker/setup-buildx-action@v3

    - name: Login to Docker Hub
      uses: docker/login-action@v3
      with:
        username: ${{ secrets.DOCKER_HUB_USERNAME }}
        password: ${{ secrets.DOCKER_HUB_ACCESS_TOKEN }}

    - name: Build and push backend Docker image
      uses: docker/build-push-action@v5
      with:
        context: ./backend
        push: true
        tags: yourDockerHubUsername/apptemplatebackend:latest
```
