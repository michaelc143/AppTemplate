FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Install system dependencies (if needed for building wheels or libs)
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .
RUN pip install --upgrade pip && pip install --no-cache-dir -r requirements.txt

# Copy only necessary code
COPY . .

# Expose the port your app runs on
EXPOSE 5000

# Default command to run your app
CMD ["python", "api/api.py"]
