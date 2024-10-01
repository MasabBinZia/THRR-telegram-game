import React from 'react';
import { riddles } from '../riddles';
import {
  ConnectButton,
  useActiveAccount,
  useActiveWallet,
  useDisconnect,
  useReadContract,
} from 'thirdweb/react';
import { client } from '../lib/client';
import { inAppWallet } from 'thirdweb/wallets';
import { shortenAddress } from 'thirdweb/utils';
import { getContract } from 'thirdweb';
import { sepolia } from 'thirdweb/chains';
import { claimTo, getBalance } from 'thirdweb/extensions/erc20';
import { Wallet2, Timer, Award } from 'lucide-react';
import { Button } from './ui/button';
import BlurIn from './ui/blur-in';
import GameStatsDrawer from './GameStatsDrawer';

export default function RiddleGame() {
  const account = useActiveAccount();
  const { disconnect } = useDisconnect();
  const contract = getContract({
    client,
    chain: sepolia,
    address: '0x2Ae79AC020752eA1803E3241620a7709fa9D0477',
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
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);

  React.useEffect(() => {
    if (gameStarted && countDown === 0 && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      setGameOver(true);
    }
  }, [timeLeft, gameStarted, countDown]);

  React.useEffect(() => {
    if (gameStarted && countDown > 0) {
      const timer = setTimeout(() => setCountDown(countDown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countDown, gameStarted]);

  React.useEffect(() => {
    if (gameOver) {
      setIsDrawerOpen(true);
    }
  }, [gameOver]);

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
    setTimeLeft(60);
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

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    if (!allCorrect) {
      resetGameState();
    }
  };

  const claimPrize = () => {
    if (account && account.address) {
      return claimTo({
        contract: contract,
        to: account.address,
        quantity: '10',
      });
    }
  };

  const allCorrect = score === riddles.length;

  return (
    <div className="h-[60%] flex flex-col justify-center text-center px-4 w-full bg-gradient-to-br from-purple-900 to-blue-900 rounded-xl border border-purple-500 mx-auto shadow-lg">
      <BlurIn
        word="Treasure Hunt Riddle Race"
        className="text-4xl pirata-one-regular text-yellow-400 mb-6"
      />
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
                options: ['telegram', 'google', 'discord', 'email'],
              },
            }),
          ]}
        />
      ) : (
        <div className="text-white flex flex-col justify-center items-center space-y-6">
          <div className="bg-black/30 p-4 rounded-lg w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <p className="flex items-center gap-2">
                <Wallet2 className="text-yellow-400" />
                <span className="font-mono">
                  {shortenAddress(account.address)}
                </span>
              </p>
              <p className="flex items-center gap-2">
                <Award className="text-yellow-400" />
                <span>{tokenbalance?.displayValue}</span>
              </p>
            </div>
            <Button
              onClick={handleDisconnect}
              variant="outline"
              className="w-full text-black"
            >
              Disconnect
            </Button>
          </div>

          {!gameStarted && !gameOver && (
            <Button
              onClick={startGame}
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-full transition-all duration-300 transform hover:scale-105"
            >
              Start Game
            </Button>
          )}

          {gameStarted && (
            <>
              {countDown > 0 ? (
                <h2 className="text-3xl font-bold text-yellow-400">
                  Game starting in {countDown}...
                </h2>
              ) : !gameOver ? (
                <div className="space-y-6 w-full max-w-md">
                  <p className="pirata-one-regular text-yellow-400 text-2xl bg-black/30 p-4 rounded-lg">
                    {riddles[currentRiddle].question}
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    {riddles[currentRiddle].options.map((option) => (
                      <Button
                        key={option}
                        onClick={() => handleAnswer(option)}
                        className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg transition-all duration-300 transform hover:scale-105"
                      >
                        {option}
                      </Button>
                    ))}
                  </div>
                  <div className="flex justify-between items-center bg-black/30 p-4 rounded-lg">
                    <p className="flex items-center gap-2">
                      <Award className="text-yellow-400" />
                      <span>Score: {score}</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <Timer className="text-yellow-400" />
                      <span>Time Left: {timeLeft}s</span>
                    </p>
                  </div>
                </div>
              ) : null}
            </>
          )}

          <GameStatsDrawer
            isOpen={isDrawerOpen}
            onClose={handleCloseDrawer}
            score={score}
            allCorrect={allCorrect}
            onRestart={resetGameState}
            claimPrize={claimPrize}
          />
        </div>
      )}
    </div>
  );
}
