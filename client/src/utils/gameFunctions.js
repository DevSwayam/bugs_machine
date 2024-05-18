import { signMessage } from "./helper";

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
  } else {
    setPrice(0);
  }
}

export function stopSpining(setRing1, setRing2, setRing3) {
  setRing1(Math.floor(Math.random() * (100 - 1) + 1));
  setTimeout(function () {
    setRing2(Math.floor(Math.random() * (100 - 1) + 1));
  }, 1000);
  setTimeout(function () {
    setRing3(Math.floor(Math.random() * (100 - 1) + 1));
  }, 2000);
}

export const play = async (
  setStart,
  ring3,
  spin,
  setSpin,
  setRing1,
  setRing2,
  setRing3,
  setPrice,
  w0,
  setisWinner,
  setValue,
  setPopup
) => {
  setStart(true);
  signMessage(w0, setStart, setSpin, setisWinner, setValue, setPopup);
  // spinSlotMachine();
  // console.log(ring3)
  if (ring3 > 1 || !spin) {
    // setRealBet(1);
    setSpin(true);
    setRing1();
    setRing2();
    setRing3();
    // if (input <= balance && input >= 1) {
    //   setRealBet(input);
    //   setSpin(true);
    //   setRing1();
    //   setRing2();
    //   setRing3();
    // } else {
    //   setPrice(10);
    // }
  }
};
