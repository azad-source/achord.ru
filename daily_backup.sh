#!/usr/bin/env bash
DATE=`date +"%Y-%m-%d_%H-%M-%S"`
cd `dirname $0`
docker exec pianosheet_db_1 pg_dump -U postgres pianosheet > ./docker/postgres/backups/$DATE.sql