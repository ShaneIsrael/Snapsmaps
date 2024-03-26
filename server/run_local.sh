mkdir db-data

[ ! "$(docker ps -a | grep postgres-db)" ] && docker-compose up -d postgres && sleep 1

until [ "`docker inspect -f {{.State.Running}} postgres-db`"=="true" ]; do
    echo "waiting for database to stand up..."
    sleep 5;
done;

sleep 10;

npm i

npm run migrate && npm run local