# Keystone

## Setup Dev Environment

```shell
docker-compose -f dev/docker-compose.yml up postgres
make venv
make install
manage.py migrate
manage.py createorganization 'My Org Name'
# enter ID for Organization created and printed in previous step when prompted
# enter ADMIN for role when prompted
manage.py createsuperuser
pytest
manage.py runserver
```


## Add Dependencies

- Add dependencies to **pyproject.toml** which has separate lists for required and dev 
dependencies
- Then run:
```shell
make requirements.txt
make requirements-dev.txt
make install
```
This will generate lock files for prod and dev, run pip-sync in the project venv, 
and then ensure the project and its scripts are installed in edit mode without
over-writing the work of pip-sync.


## TODO / Questions

- Hierarchical quota assignment?
    - A transaction can count against a User, Team, and Org quota
      - All users of an Org can't do work that exceeds the Org quota
      - If a user has a quota, they can't do work that exceeds their quota
      - If a user doesn't have a quota, they can't do work if it puts the org over
      - Do users have a choice of charging work against a team quota?
      - If a user is a part of multiple teams it doesn't seem right to charge all teams
    - Quotas are optional for Users and Teams
- Keep Org/Team/User in keystone app, and move the rest to arch app
    - There could also be a Vault and AIT app added to the service
    - Each product app in this service would have its own Quota schema
- 