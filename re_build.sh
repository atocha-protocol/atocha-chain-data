docker-compose down
rm -rf .data
yarn codegen
yarn build
docker-compose up
