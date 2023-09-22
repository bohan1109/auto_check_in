#!/bin/bash

# 更新系統
sudo apt-get update

# 安裝Docker
sudo apt-get install -y docker.io

# 啟動Docker服務並設置為開機啟動
sudo systemctl start docker
sudo systemctl enable docker

# 將ubuntu用戶添加到docker組
sudo usermod -aG docker ubuntu

# 安裝Docker Compose
sudo apt-get install -y docker-compose
cd /home/ubuntu/auto_check_in/api_server

sudo docker-compose up --build -d

echo "Setup completed."
