//APP.JS
import { Console } from "@woowacourse/mission-utils";
import MESSAGE from "./view/Message.js";
import CONSTANTS from "./view/Constants.js";
import Lotto from "./Lotto.js";

class App {
  async play() {
    let tickets = await this.buyTicket();
    const lotteries = Lotto.lottoCreate(tickets);
    const computer = lotteries.map((lotto) => new Lotto(lotto));
    Console.print("");
    const user = await this.userLotto();

    this.compareNumbers(computer, user, tickets);
  }

  async buyTicket() {
    while (true) {
      try {
        const cost = await Console.readLineAsync(MESSAGE.COST_PROMPT);
        const tickets = this.validateCost(cost);
        Console.print("");
        Console.print(`${tickets}${MESSAGE.BUY_TICKET_MESSAGE}`);
        return tickets;
      } catch (error) {
        Console.print(MESSAGE.COST_ERROR);
      }
    }
  }

  validateCost(cost) {
    let numCost = Number(cost);
    if (isNaN(numCost) || numCost % CONSTANTS.ONE_TICKET_PRICE !== 0) {
      throw new Error(MESSAGE.COST_ERROR);
    }
    return Math.floor(numCost / CONSTANTS.ONE_TICKET_PRICE);
  }

  async userLotto() {
    let input = await Console.readLineAsync(MESSAGE.WINNING_NUMBER_PROMPT);
    Console.print("");
    const userNumber = input.split(",").map((num) => Number(num));
    this.validateUserNumbers(userNumber);

    let bonusNumber = await Console.readLineAsync(MESSAGE.BONUS_NUMBER_PROMPT);
    Console.print("");
    userNumber.push(Number(bonusNumber));
    return userNumber;
  }

  validateUserNumbers(numbers) {
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

  compareNumbers(computer, user, counts) {
    const winningNumbers = user.slice(0, 6);
    const bonusNumber = user[6];

    let matchCounts = [0, 0, 0, 0, 0];

    computer.forEach((computerNum) => {
      const matchCount = computerNum.filter((num) =>
        winningNumbers.includes(num)
      ).length;

      if (matchCount === 3) matchCounts[0]++;
      else if (matchCount === 4) matchCounts[1]++;
      else if (matchCount === 5) matchCounts[2]++;
      else if (matchCount === 5 && computer.includes(bonusNumber))
        matchCounts[3]++;
      else if (matchCount === 6) matchCounts[4]++;
    });

    this.displayResult(matchCounts, counts);
  }

  displayResult(result, totalTicket) {
    const prize = [5000, 50000, 150000, 30000000, 2000000000];
    let totalPrize = 0;

    const totalCost = totalTicket * CONSTANTS.ONE_TICKET_PRICE;

    result.forEach((count, index) => {
      if (count > 0) totalPrize += prize[index];
    });
    const profitRate = ((totalPrize / totalCost) * 100).toFixed(1);

    Console.print(MESSAGE.RESULT_PROMPT);
    Console.print(MESSAGE.RESULT_DIVIDE_LINE);
    Console.print(`${MESSAGE.RESULT_WINNING_THREE}${result[0]}개`);
    Console.print(`${MESSAGE.RESULT_WINNING_FOUR}${result[1]}개`);
    Console.print(`${MESSAGE.RESULT_WINNING_FIVE}${result[2]}개`);
    Console.print(`${MESSAGE.RESULT_WINNING_FIVE_WITH_BONUS}${result[3]}개`);
    Console.print(`${MESSAGE.RESULT_WINNING_SIX}${result[4]}개`);

    Console.print(`${MESSAGE.RESULT_PROFIT_RATE}${profitRate}%입니다.`);
  }
}

export default App;
