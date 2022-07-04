NC-Games Project

I will be building an API for the purpose of accessing application data programmatically. The intention here is to mimic the building of a real world backend service (such as reddit) which should provide this information to the front end architecture.

SETUP

These databases require .env.test and env.development files.
The dotenv package loads the variables defined in the .env file in the current working directory and sets them as environment variables.

In order to use this repo, you will need to install .env files yourself. These should be similar to the .env-example file provided.

See below for the files created and their requirede content.

.env.test - PGDATABASE=nc_games_test
.env.development - PGDATABASE=nc_games
