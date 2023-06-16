# Keystone

## Setup Dev Environment

### Pre-requisites

- Ensure docker-compose is installed
- Ensure postgres is installed. We'll use docker, but we need the lib for psycopg
    - `brew install postgresql@14`
- Check nothing else is running on port 5432 (shut down any other postgres instances)
    - Brew might be sneaky and try to run postgres on its own
- Install python 3.10.12 `pyenv install 3.10.12`

### Local install

```shell
git clone git@git.archive.org:webgroup/keystone.git
cd keystone
pyenv local 3.10.12
# in new tab
docker-compose -f dev/docker-compose.yml up postgres
# back to original tab
make venv
rm .python-version
make install
source venv/bin/activate
manage.py migrate
manage.py createaccount 'My account Name'
# enter ID for Account created and printed in previous step when prompted
# enter ADMIN for role when prompted
manage.py createsuperuser
make test
manage.py runserver
```


## Add Dependencies

- Add dependencies to **pyproject.toml** which has separate lists for required and dev 
dependencies
- Then run:
```shell
rm requirements.txt requirements-dev.txt
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