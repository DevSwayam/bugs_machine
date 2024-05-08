## Security Considertations 
    1) Random Number Generator Contract:
        - Only Server should be able to call the random number genration function with proper user address
    
    2) Slot Machine Contract:
        - User should not be able to call the spinSlotMachine function before the previous call get resolved
        - The SlotMachine contract should always have 1000 or more BUGS so that it can provide winning amountif multiple users wins and they have made a call simulatenously.
        - The User should have minimum 100 BUGS to spinSlotMachine
        - The User should have approved at least 100 BUGS to slotMachine contract before calling SpinSlotMachine
        - Only the caller contract which is Interchain Account should be able to call the handle() function 
        - The Owner should be able to redeem the profit from slotMachine
        - The Owner should be able to remove all funds from slotMachine and make it non playable which will act as a play/pause for game
        - What if the bridge fails?
        - What is the user is not an EOA but an smart contract does that affect out protocol?
        - 