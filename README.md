# Keystone

## Setup Dev Environment

### Pre-requisites

- Ensure docker-compose is installed
- Ensure postgres is installed. We'll use docker, but we need the lib for psycopg
    - `brew install postgresql@14`
- Check nothing else is running on port 5432 (shut down any other postgres instances)
    - Brew might be sneaky and try to run postgres on its own
- Install python 3.11.2 `pyenv install 3.11.2`

### Local install

```shell
git clone git@git.archive.org:webgroup/keystone.git
cd keystone
pyenv local 3.11.2
# in new tab
docker-compose -f docker-compose.yml up postgres
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

### Production-like Docker Container

```shell
git clone git@git.archive.org:webgroup/keystone.git
cd keystone
make run-prod-containers
docker container ls
# get the container ID for web from above
export CONTAINER_ID=id_from_docker_container_ls
docker exec $CONTAINER_ID /opt/keystone/venv/bin/manage.py migrate
docker exec $CONTAINER_ID /opt/keystone/venv/bin/manage.py createaccount 'My account name'
docker exec -it $CONTAINER_ID /opt/keystone/venv/bin/manage.py createsuperuser
docker exec $CONTAINER_ID /opt/keystone/venv/bin/manage.py collectstatic --noinput
```

If you have issues on the `make run-prod-containers` step try running it this way:
`BUILDKIT_PROGRESS=plain make run-prod-containers`

The app will now be running at http://127.0.0.1:12342/admin

## Test in Development
- To test ARCH integration, update the following values in arch/config/config.json:
```shell
"keystoneBaseUrl": "http://host.docker.internal:12342",
"keystonePrivateApiKey": "supersecret",
```
- Test using curl, eg.
``` shell
curl -X POST http://host.docker.internal:12342/private/api/proxy_login -H "Content-Type: application/json" -H "X-API-KEY: supersecret" -d '{"username":"<username>", "password":"<password>"}'
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

## Deploy

Keystone deploys take place in two stages:
- Build and push the Docker containers for the app and nginx
- Run the setup-keystone.yml playbook in ait-ansible

The container building should be done from an Intel/AMD machine for now. In the near 
future we should get it automated in GitLab.

We might want to use different tags (the examples below use the `latest` tag) for QA.

```shell
# Run from project root directory

# Build the web and nginx images
docker build -f Dockerfile -t registry.archive.org/webgroup/keystone/web:latest .
docker build -f dev/nginx/Dockerfile -t registry.archive.org/webgroup/keystone/nginx:latest dev/nginx

# Login to our repository - you may need to set up a personal access token in GitLab
docker login registry.archive.org

# Push new images to the container repository
docker push registry.archive.org/webgroup/keystone/web
docker push registry.archive.org/webgroup/keystone/nginx
```

You can view the container registry here:
https://git.archive.org/webgroup/keystone/container_registry


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
