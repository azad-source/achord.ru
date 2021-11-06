# pianosheet



### Docker

# просмотр списка контейнеров
docker ps

# просмотр списка образов
docker image ls
# удаление всех образов 
docker image ls -q | xargs -I {} docker image rm -f {}


# сборка всех контейнеров
docker-compose build
# сборка всех контейнеров без кеша
docker-compose build --no-cache

# Запуск всех контейнеров docker-compose
docker-compose up 
# Остановка контейнеров docker-compose
docker-compose stop

# запуск команд внутри контейнера с веб приложением

# создание файла миграций на основе моделей (классов)
docker exec -it pianosheet_web_1 python ./backend/manage.py makemigrations
# запуск миграции базы данных
docker exec -it pianosheet_web_1 python ./backend/manage.py migrate
# создание суперпользователя
docker exec -it pianosheet_web_1 python ./backend/manage.py createsuperuser
# подключение к БД
docker exec -it pianosheet_db_1 psql -h db -p 5432 -U posgres pianosheet

docker exec -it pianosheet_web_1 python ./backend/manage.py setup_previews
docker exec -it pianosheet_web_1 python ./backend/manage.py setup_info
docker exec -it pianosheet_web_1 python ./backend/manage.py setup_sheets



# подключение к базе данных 
docker exec -it pianosheet_db_1 psql -U posgres -d pianosheet

# просмотр всех подключенных volume
docker volume ls

# Удаление всех volume
docker volume prune



# Пример дампа
docker exec -it  <container>    pg_dump -U  <user>  --column-inserts <database> > <filename>
docker exec -it pianosheet_db_1 pg_dump -U postgres --column-inserts pianosheet > backup.sql