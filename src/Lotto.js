// LOTTO.JS
import { Console, MissionUtils } from "@woowacourse/mission-utils";
import MESSAGE from "./view/Message.js";
import CONSTANTS from "./view/Constants.js";

class Lotto {
  #numbers;

  constructor(numbers) {
    this.#validate(numbers);
    this.#numbers = numbers;
    Console.print(`[${numbers.join(", ")}]`);
    return numbers;
  }

  #validate(numbers) {
    if (numbers.length !== CONSTANTS.MAX_NUMBER_LENGTH) {
      throw new Error(MESSAGE.LOTTO_NUMBER_ERROR);
    }

    for (let i = 0; i < numbers.length; i++) {
      if (numbers[i] < 1 || numbers[i] > CONSTANTS.MAX_NUMBER) {
        throw new Error(MESSAGE.LOTTO_NUMBER_RANGE_ERROR);
      }
    }

    let setNumbers = new Set(numbers);

    if (setNumbers.size !== CONSTANTS.MAX_NUMBER_LENGTH) {
      throw new Error(MESSAGE.LOTTO_DUPLICATION_ERROR);
    }
  }

  // TODO: 추가 기능 구현
  static lottoCreate(counts) {
    const lotteries = [];
    for (let count = 0; count < counts; count++) {
      let lotto = this.numberCreate();
      lotteries.push(lotto);
    }
    return lotteries;
  }

  static numberCreate() {
    let num = MissionUtils.Random.pickUniqueNumbersInRange(
      1,
      CONSTANTS.MAX_NUMBER,
      CONSTANTS.MAX_NUMBER_LENGTH
    );
    let lottoNumber = num.sort((a, b) => a - b);
    return lottoNumber;
  }
}

export default Lotto;
