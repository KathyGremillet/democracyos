export NODE_PATH=.
yes | ./bin/dos-db drop
./bin/dos-db load rules lib/fixtures/rules-roles.json
./bin/dos-db load rules lib/fixtures/rules-activities.json
./bin/dos-db load rules lib/fixtures/rules-locations.json
./bin/dos-db load user lib/fixtures/users.json
./bin/dos-db load tag lib/fixtures/tags.json
./bin/dos-db load topic lib/fixtures/topics.json
