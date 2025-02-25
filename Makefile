
.PHONY: deploy

deploy:
	@fly deploy -c fly.api.toml
	@fly deploy -c fly.ui.toml

proxy:
	@fly redis proxy -o cyborgdev

keys:
	@pnpm dlx dotenv-vault build
	@pnpm dlx dotenv-vault keys | grep production
