############################# GLOBAL COMMANDs #############################

############################# HELP MESSAGE #############################
# Make sure the help command stays first, so that it's printed by default when `make` is called without arguments
.PHONY: help start-all start-dev clean-process
help:
	@grep -E '^[a-zA-Z0-9_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

-----------------------------: ## 
___BUILDs___: ## Build scripts
build: ## build typescript into javascript
	@npx tsc
	@echo "Built to ./dist/"
clean-build: # Delete all the process and flush the log
	@rm -rf dist
	@echo "Build cleaned"

-----------------------------: ## 
___PROCESS___: ## Processes of the performer node
start-all: build ## Boot the validate handler
	@echo "Starting the AVS Task validation server..."
	@pm2 start pm2/web-server.config.js

start-dev: build ## Boot the validate handler
	@echo "Starting the AVS Task validation DEV server..."
	@pm2 start pm2/web-server.dev.config.js

clean-process: # Delete all the process and flush the log
	@pm2 flush "AVS Web API"
	@pm2 delete "AVS Web API"
	@echo "pm2 process flushed and deleted"

-----------------------------: ## 
___GLOBAL___: ## 
clean: clean-process clean-build # Clean all build + active processes
	@echo "DONE!"
format: # Format code with prettier
	@npx prettier --write .
