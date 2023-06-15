PYTHON_VERSION = 3.10

# where's the Makefile running? Valid options: LOCAL, CI
ENV ?= LOCAL
PYTEST_REPORT ?= pytest.xml
PYLINT_REPORT ?= pylint.json

venv:
	python -m venv venv --prompt . && . \
	venv/bin/activate && \
	pip install -U pip setuptools wheel pip-tools

requirements.txt: venv
	venv/bin/pip-compile \
	--resolver=backtracking \
	--generate-hashes \
	--output-file requirements.txt \
	--strip-extras \
	pyproject.toml

requirements-dev.txt: requirements.txt
	echo "--constraint $$(pwd)/requirements.txt" | \
	venv/bin/pip-compile \
	--resolver=backtracking \
	--generate-hashes \
	--output-file requirements-dev.txt \
	--extra dev \
	- \
	pyproject.toml

.PHONY: install
install:
	venv/bin/pip-sync requirements-dev.txt
	venv/bin/pip install --no-deps -e .

.PHONY: test
test:
ifeq ($(ENV),LOCAL)
	@# pass extra params on to pytest: https://stackoverflow.com/a/6273809
	DJANGO_SETTINGS_MODULE=config.settings venv/bin/pytest $(filter-out $@,$(MAKECMDGOALS))
else ifeq ($(ENV),CI)
	DJANGO_SETTINGS_MODULE=config.settings \
	   venv/bin/pytest \
		--junit-xml=$(PYTEST_REPORT) \
		--cov=vault \
		--cov=vault_site \
		--cov-report=xml
endif

.PHONY: lint
lint:
ifeq ($(ENV),LOCAL)
	DJANGO_SETTINGS_MODULE=config.settings venv/bin/pylint keystone config
else ifeq ($(ENV),CI)
	DJANGO_SETTINGS_MODULE=config.settings \
		venv/bin/pylint keystone config \
		--output-format=pylint_gitlab.GitlabCodeClimateReporter \
		--reports=y > $(PYLINT_REPORT)
endif

.PHONY: format
format:
	venv/bin/black .

.PHONY: ck-format
ck-format:
	venv/bin/black --check .