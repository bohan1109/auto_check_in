#!/bin/bash
set -e

echo "Updating system..."
sudo apt-get update

echo "Installing Docker..."
sudo apt-get install -y docker.io

echo "Starting Docker service and setting it to start on boot..."
sudo systemctl start docker
sudo systemctl enable docker

echo "Adding ubuntu user to the docker group..."
sudo usermod -aG docker ubuntu

echo "Installing Docker Compose..."
sudo apt-get install -y docker-compose

echo "Changing directory and starting Docker Compose..."
cd /home/ubuntu/auto_check_in/api_server
sudo docker-compose up --build -d

echo "Setup completed."
