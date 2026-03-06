docker compose down --remove-orphans	-v --rmi local
docker container prune -f
docker volume prune -a -f
docker compose up