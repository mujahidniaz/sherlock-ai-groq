# Use the official Python image from the Docker Hub
FROM python
# Set the working directory
WORKDIR /app
RUN mkdir /data
# Copy the requirements file into the container
COPY . .

# Install the dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application code into the container


# Expose port 8000
EXPOSE 8000

# Command to run the application
CMD ["python", "app.py"]
