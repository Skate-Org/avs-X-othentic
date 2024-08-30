############################# GLOBAL COMMANDs #############################

############################# HELP MESSAGE #############################
# Make sure the help command stays first, so that it's printed by default when `make` is called without arguments
.PHONY: help tests start-sender start-web start-watcher start-performer clean-process
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
start-sender: ## sender to participate in AVS p2p network
	@echo "Starting the sender..."
	@pm2 start pm2/sender.config.js

start-web: ## web services for metrics and manual log fetching
	@echo "Starting the web services..."
	@pm2 start pm2/web-server.config.js

start-watcher: ## watcher process to collect new log from MessageBox
	@./check_socket.sh # delay to make sure the socket is created
	@echo "Starting the watcher..."
	@pm2 start pm2/watcher.config.js

start-all: build start-sender start-web start-watcher # Build + boots all services in sequence
	@echo "All services started."

clean-process: # Delete all the process and flush the log
	@pm2 flush "Performer Sender" "Performer Watcher" "Performer Web Server"
	@pm2 delete "Performer Sender" "Performer Watcher" "Performer Web Server"
	@echo "pm2 process flushed and deleted"

-----------------------------: ## 
___GLOBAL___: ## 
clean: clean-process clean-build # Clean all build + active processes
	@echo "DONE!"
format: # Format code with prettier
	@npx prettier --write .
