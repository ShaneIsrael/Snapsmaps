docker-compose down && sleep 2

# Clear the database data completely
echo "resetting database data..."
rm -r db-data && mkdir db-data && sleep 1

[ ! "$(docker ps -a | grep postgres-db)" ] && docker-compose up -d postgres && sleep 1
until [ "`docker inspect -f {{.State.Running}} postgres-db`"=="true" ]; do
    echo "waiting for database to stand up..."
    sleep 5;
done;

echo "database is up, wait 25 seconds for it to complete standing up before migration..."
sleep 25;

npm i
npm run migrate && npm run local