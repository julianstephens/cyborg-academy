
.PHONY: deploy

deploy:
	@fly deploy -c fly.api.toml
	@fly deploy -c fly.ui.toml

proxy:
	@fly redis proxy -o cyborgdev
