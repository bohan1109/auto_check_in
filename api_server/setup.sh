#!/bin/bash
set -e
mkdir -p /home/ubuntu/auto_check_in/api_server/logs
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

for i in {0..25..5}; do
    CRON_JOB="$i 18 * * * docker exec api_server_web_1 python /usr/src/backend/check_out_script.py"
    if ! crontab -l 2>/dev/null | grep -qF "$CRON_JOB"; then
        (crontab -l 2>/dev/null; echo "$CRON_JOB") | crontab -
    fi
done

CRON_JOB_RANDOMIZE="0 0 * * * docker exec api_server_web_1 python /usr/src/backend/randomized_check_in_times.py"
if ! crontab -l 2>/dev/null | grep -qF "$CRON_JOB_RANDOMIZE"; then
    (crontab -l 2>/dev/null; echo "$CRON_JOB_RANDOMIZE") | crontab -
fi

CRON_JOB_CHECK_IN="3 9 * * * docker exec api_server_web_1 python /usr/src/backend/check_in_script.py >> /home/ubuntu/auto_check_in/api_server/logs/check_in.log 2>&1"
(crontab -l 2>/dev/null; echo "$CRON_JOB_CHECK_IN") | crontab -

CRON_JOB_CHECK_OUT="30 18 * * * docker exec api_server_web_1 python /usr/src/backend/check_out_script.py >> /home/ubuntu/auto_check_in/api_server/logs/check_out.log 2>&1"
(crontab -l 2>/dev/null; echo "$CRON_JOB_CHECK_OUT") | crontab -

echo "set crontap completed"

echo "Setup completed."
