############################# GLOBAL COMMANDs #############################

############################# HELP MESSAGE #############################
# Make sure the help command stays first, so that it's printed by default when `make` is called without arguments
.PHONY: help start-web start-collect-core start-collect-periphery start-all clean-process
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
start-web: ## Boot the task server
	@echo "Starting the task server..."
	@pm2 start pm2/task-server.config.js

start-collect-core: ## Collector for Kernel + AVS
	@echo "Starting AVS + Kernel collectors..."
	@pm2 start pm2/collect-core.config.js


start-collect-periphery: ## Collector for periphery chains, by group to save resources
	@echo "Starting Periphery chain collectors..."
	@pm2 start pm2/collect-periphery.config.js

start-all: build start-web start-collect-core ## Build + start all services
	@echo "Services are up!"

start-executor-health: build ## Collector for periphery chains, by group to save resources
	@echo "Starting Periphery chain collectors..."
	@pm2 start pm2/executor-health.config.js

clean-executor-health:
	@pm2 flush "Executor Health - Fetch Balance" "Executor Health - Slack Update" "Executor Health - Slack Alert" "Executor Health - Web Server"
	@pm2 delete "Executor Health - Fetch Balance" "Executor Health - Slack Update" "Executor Health - Slack Alert" "Executor Health - Web Server"
	@echo "pm2 executor-health process flushed and deleted"

clean-process: # Delete all the process and flush the log
	@pm2 flush "TaskServer Web" "Collect Kernel" "Collect AVS"
	@pm2 delete "TaskServer Web" "Collect Kernel" "Collect AVS"
	@echo "pm2 core-avs process flushed and deleted"

-----------------------------: ## 
___GLOBAL___: ## 
clean: clean-process clean-build # Clean all build + active processes
	@echo "DONE!"
format: # Format code with prettier
	@npx prettier --write .
