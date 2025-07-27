# Deploying to fly.io

the pg_url secret - such a pain - `postgres://user:secret@api-ros-db.internal:5432/api_quickbeans` - note the db_name.internal:port

Fly.io wanted to provision 2 machines with larger memory - had to run:

``` bash
$ fly scale count 1
```
