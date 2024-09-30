import React from "react";
import { riddles } from "../riddles";
import {
  ConnectButton,
  TransactionButton,
  useActiveAccount,
  useActiveWallet,
  useDisconnect,
  useReadContract,
} from "thirdweb/react";
import { client } from "../lib/client";
import { inAppWallet } from "thirdweb/wallets";
import { shortenAddress } from "thirdweb/utils";
import { getContract } from "thirdweb";
import { sepolia } from "thirdweb/chains";
import { claimTo, getBalance } from "thirdweb/extensions/erc20";
import { Wallet2 } from "lucide-react";
import { Button } from "./ui/button";
import BlurIn from "./ui/blur-in";

export default function RiddleGame() {
  const account = useActiveAccount();

  const { disconnect } = useDisconnect();

  const contract = getContract({
    client,
    chain: sepolia,
    address: "0x2Ae79AC020752eA1803E3241620a7709fa9D0477",
  });

  const { data: tokenbalance } = useReadContract(getBalance, {
    contract: contract,
    address: account?.address!,
  });
  const wallet = useActiveWallet();
  const [currentRiddle, setCurrentRiddle] = React.useState(0);
  const [score, setScore] = React.useState(0);
  const [timeLeft, setTimeLeft] = React.useState(60);
  const [gameOver, setGameOver] = React.useState(false);
  const [gameStarted, setGameStarted] = React.useState(false);
  const [countDown, setCountDown] = React.useState(3);

  const claimPrize = () => {
    alert("Congratulations! You've won 10 tokens!");
  };

  React.useEffect(() => {
    if (gameStarted && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      setGameOver(true);
    }
  }, [timeLeft, gameStarted]);

  React.useEffect(() => {
    if (countDown > 0) {
      const timer = setTimeout(() => setCountDown(countDown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countDown === 0) {
      setGameStarted(true);
    }
  }, [countDown]);

  const handleAnswer = (answer: string) => {
    if (answer === riddles[currentRiddle].answer) {
      setScore(score + 1);
    }
    if (currentRiddle < riddles.length - 1) {
      setCurrentRiddle(currentRiddle + 1);
    } else {
      setGameOver(true);
    }
  };

  const startGame = () => {
    setCountDown(3);
    setCurrentRiddle(0);
    setScore(0);
    setTimeLeft(65);
    setGameOver(false);
    setGameStarted(true);
  };

  const resetGameState = () => {
    setCurrentRiddle(0);
    setScore(0);
    setTimeLeft(60);
    setGameOver(false);
    setGameStarted(false);
    setCountDown(3);
  };

  const handleDisconnect = async () => {
    await disconnect(wallet!);
    resetGameState();
  };

  const allCorrect = score === riddles.length;

  React.useEffect(() => {
    if (gameOver && allCorrect) {
      claimPrize();
    }
  }, [gameOver, allCorrect]);

  return (
    <div className="h-[60%] flex flex-col justify-center text-center px-2 w-full bg-black/80 rounded-xl border border-transparent">
      {/* <h1 className="pirata-one-regular gradient-text">
        
      </h1> */}
      <BlurIn  word="Treasure Hunt Riddle Race." className="text-4xl pirata-one-regular gradient-text" />
      {!account ? (
        <ConnectButton
          client={client}
          accountAbstraction={{
            chain: sepolia,
            sponsorGas: true,
          }}
          wallets={[
            inAppWallet({
              auth: {
                options: ["telegram", "google", "discord", "email"],
              },
            }),
          ]}
        />
      ) : (
        <div className="text-white flex flex-col justify-center items-center">
          <div>
            <div className="flex flex-col space-y-4">
              <div className="flex justify-between gap-10">
                <p className="flex items-center gap-1">
                  <span>
                    <Wallet2 />
                  </span>{" "}
                  {shortenAddress(account.address)}
                </p>
                <p>Balance: {tokenbalance?.displayValue}</p>
              </div>

              <Button onClick={handleDisconnect}>Disconnect</Button>
            </div>
            <Button onClick={startGame}>Start Game</Button>
          </div>
          {gameStarted && (
            <>
              {countDown > 0 ? (
                <h2>Game starting in {countDown}...</h2>
              ) : !gameOver ? (
                <div>
                  <p className="pirata-one-regular gradient-text text-xl">{riddles[currentRiddle].question}</p>
                  <div className="grid grid-cols-2 gap-2">
                    {riddles[currentRiddle].options.map((option) => (
                      <Button key={option} onClick={() => handleAnswer(option)}>
                        {option}
                      </Button>
                    ))}
                  </div>
                  <div className="flex flex-col space-y-4">
                    <p>Score: {score}</p>
                    <p>Time Left: {timeLeft}s</p>
                  </div>
                </div>
              ) : (
                <div>
                  <h2>Game Over! Your score is: {score}</h2>
                  {allCorrect && (
                    <div>
                      Congratulations! You've won the game!
                      <TransactionButton
                        transaction={() =>
                          claimTo({
                            contract: contract,
                            to: account.address,
                            quantity: "10",
                          })
                        }
                        onTransactionConfirmed={() =>
                          alert("Congratulations! You've won 10 tokens!")
                        }
                      >
                        Claim Prize
                      </TransactionButton>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
