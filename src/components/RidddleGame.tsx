import React from "react";
import { riddles } from "../riddles";
import {
  ConnectButton,
  useActiveAccount,
  useActiveWallet,
  useDisconnect,
} from "thirdweb/react";
import { client } from "../lib/client";
import { inAppWallet } from "thirdweb/wallets";
import { shortenAddress } from "thirdweb/utils";

export default function RiddleGame() {
  const account = useActiveAccount();
  const { disconnect } = useDisconnect();
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
    <div>
      <h1>Treasure Hunt Riddle Race</h1>
      {!account ? (
        <ConnectButton
          client={client}
          wallets={[
            inAppWallet({
              auth: {
                options: ["telegram", "google", "discord"],
              },
            }),
          ]}
        />
      ) : (
        <>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "20px",
            }}
          >
            <div>
              {shortenAddress(account.address)}
              <button onClick={handleDisconnect}>Disconnect</button>
            </div>
            <button
              onClick={startGame}
              style={{
                fontSize: "18px",
                padding: "10px 20px",
                backgroundColor: "#4CAF50",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              {gameStarted ? "Restart Game" : "Start Game"}
            </button>
          </div>
          {gameStarted && (
            <>
              {countDown > 0 ? (
                <h2>Game starting in {countDown}...</h2>
              ) : !gameOver ? (
                <div>
                  <p>{riddles[currentRiddle].question}</p>
                  <div>
                    {riddles[currentRiddle].options.map((option) => (
                      <button key={option} onClick={() => handleAnswer(option)}>
                        {option}
                      </button>
                    ))}
                  </div>
                  <p>Score: {score}</p>
                  <p>Time Left: {timeLeft}s</p>
                </div>
              ) : (
                <div>
                  <h2>Game Over! Your score is: {score}</h2>
                  {allCorrect && <p>Congratulations! You've won the game!</p>}
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}