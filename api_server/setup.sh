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

sudo timedatectl set-timezone Asia/Taipei
echo "set-timezone Asia/Taipei"

sudo docker image prune -a -f
echo "remove idle images"
crontab -r
echo "remove crontab"
for i in {30..55..5}; do
    CRON_JOB="$i 8 * * * docker exec api_server_web_1 python /usr/src/backend/check_in_script.py"
    if ! crontab -l 2>/dev/null | grep -qF "$CRON_JOB"; then
        (crontab -l 2>/dev/null; echo "$CRON_JOB") | crontab -
    fi
done

CRON_JOB="00 9 * * * docker exec api_server_web_1 python /usr/src/backend/check_in_script.py"
if ! crontab -l 2>/dev/null | grep -qF "$CRON_JOB"; then
    (crontab -l 2>/dev/null; echo "$CRON_JOB") | crontab -
fi

for i in {0..30..5}; do
    CRON_JOB="$i 18 * * * docker exec api_server_web_1 python /usr/src/backend/check_out_script.py"
    if ! crontab -l 2>/dev/null | grep -qF "$CRON_JOB"; then
        (crontab -l 2>/dev/null; echo "$CRON_JOB") | crontab -
    fi
done

echo "set crontap"

echo "Setup completed."
