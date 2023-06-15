# Keystone

## Setup Dev Environment

Before you begin, ensure docker-compose is installed and **Python 3.10** is active.

```shell
docker-compose -f dev/docker-compose.yml up postgres
make venv
make install
manage.py migrate
manage.py createaccount 'My account Name'
# enter ID for Account created and printed in previous step when prompted
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
    - A transaction can count against a User, Team, and Account quota
      - All users of an account can't do work that exceeds the Account quota
      - If a user has a quota, they can't do work that exceeds their quota
      - If a user doesn't have a quota, they can't do work if it puts the account over
      - Do users have a choice of charging work against a team quota?
      - If a user is a part of multiple teams it doesn't seem right to charge all teams
    - Quotas are optional for Users and Teams
- Keep Account/Team/User in keystone app, and move the rest to arch app
    - There could also be a Vault and AIT app added to the service
    - Each product app in this service would have its own Quota schema
- 