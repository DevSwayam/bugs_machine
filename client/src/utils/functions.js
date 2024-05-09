export function numChecker(e, setInput) {
    const value = e.target.value;
    const regex = /^[0-9]+$/;
    if ((value.match(regex) && parseInt(value) >= 0) || value === "") {
      setInput(value);
    }
  }
  
  export function win(ring1, ring2, ring3, setPrice) {
    if (ring1 <= 50 && ring2 <= 50 && ring3 <= 50 && ring1 != undefined) {
      setPrice(1);
      // setBalance(balance + (balance * 15))
    } else if (
      ring1 > 50 &&
      ring1 <= 65 &&
      ring2 > 50 &&
      ring2 <= 65 &&
      ring3 > 50 &&
      ring3 <= 65 &&
      ring1 != undefined
    ) {
      setPrice(2);
      // setBalance(balance + (balance * 20))
    } else if (
      ring1 > 65 &&
      ring1 <= 80 &&
      ring2 > 65 &&
      ring2 <= 80 &&
      ring3 > 65 &&
      ring3 <= 80 &&
      ring1 != undefined
    ) {
      setPrice(3);
      // setBalance(balance + (balance * 25))
    } else if (
      ring1 > 80 &&
      ring1 <= 90 &&
      ring2 > 80 &&
      ring2 <= 90 &&
      ring3 > 80 &&
      ring3 <= 90 &&
      ring1 != undefined
    ) {
      setPrice(4);
      // setBalance(balance + (balance * 30))
    } else if (
      ring1 > 90 &&
      ring1 <= 95 &&
      ring2 > 90 &&
      ring2 <= 95 &&
      ring3 > 90 &&
      ring3 <= 95 &&
      ring1 != undefined
    ) {
      setPrice(5);
      // setBalance(balance + (balance * 35))
    } else if (
      ring1 > 95 &&
      ring1 <= 97.5 &&
      ring2 > 95 &&
      ring2 <= 97.5 &&
      ring3 > 95 &&
      ring3 <= 97.5 &&
      ring1 != undefined
    ) {
      setPrice(6);
      // setBalance(balance + (balance * 40))
    } else if (
      ring1 > 97.5 &&
      ring1 <= 100 &&
      ring2 > 97.5 &&
      ring2 <= 100 &&
      ring3 > 97.5 &&
      ring3 <= 100 &&
      ring1 != undefined
    ) {
      setPrice(7);
      // setBalance(balance + jackpot)
      // setJackpot(0)
    } else {
      setPrice(0);
    }
  }
