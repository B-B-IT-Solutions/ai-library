docker-compose down --remove-orphans	-v
docker container prune -f
docker volume prune -a -f
docker-compose up