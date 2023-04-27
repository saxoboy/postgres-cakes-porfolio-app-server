<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

Para realizar una búsqueda que ignore las tildes, diéresis y otros acentos, puedes utilizar la función unaccent que provee PostgreSQL.

Primero, debes asegurarte de que la extensión unaccent esté instalada en tu base de datos. Para hacerlo, puedes ejecutar la siguiente consulta en la consola de PostgreSQL:

```
SELECT name, setting FROM pg_settings WHERE name = 'unaccent';
```

Si el resultado es una fila con el valor on en la columna setting, significa que la extensión está instalada. Si no, deberás instalarla ejecutando lo siguiente:

```
CREATE EXTENSION IF NOT EXISTS unaccent;
```