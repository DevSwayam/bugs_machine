-include .env

.PHONY: all clean deploy help install snapshot format anvil 

DEFAULT_ANVIL_KEY := 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80

help:
	@echo "make deploy [ARGS=....]"

build:; forge build

install:; forge install

# Clean the repo
clean  :; forge clean

all: clean remove install update build

snapshot :; forge snapshot

format :; forge fmt

NETWORK_ARGS := --rpc-url http://localhost:8545 --private-key $(DEFAULT_ANVIL_KEY) --broadcast

# Remove modules
remove :; rm -rf .gitmodules && rm -rf .git/modules/* && rm -rf lib && touch .gitmodules && git add . && git commit -m "modules"

anvil :; anvil -m 'test test test test test test test test test test test junk' --steps-tracing --block-time 1

NETWORK_ARGS := --rpc-url http://localhost:8545 --private-key $(DEFAULT_ANVIL_KEY) --broadcast


# if --network fantom is used then use fantom network config 
ifeq ($(findstring --network redStone,$(ARGS)),--network redStone)
	NETWORK_ARGS := --rpc-url $(REDSTONE_RPC_URL) --private-key $(REDSTONE_DEPLOYER_PRIVATE_KEY) --slow --broadcast -vvvv
endif

ifeq ($(findstring --network inco,$(ARGS)),--network inco)
	NETWORK_ARGS := --rpc-url $(INCO_RPC_URL) --private-key $(INCO_DEPLOYER_PRIVATE_KEY) --slow  --broadcast -vvvv
endif

deploy slotMachine:
	forge script script/DeploySlotMachine.s.sol:DeploySlotMachine $(NETWORK_ARGS)

deploy rng:
	forge script script/DeployRandomNumberGenerator.s.sol:DeployRandomNumberGenerator $(NETWORK_ARGS)

