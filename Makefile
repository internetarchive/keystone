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

install:
	venv/bin/pip-sync requirements-dev.txt
	venv/bin/pip install --no-deps -e .