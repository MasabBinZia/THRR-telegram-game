import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
} from '@/components/ui/drawer';
import { Button } from './ui/button';
import { TransactionButton } from 'thirdweb/react';
import { Frown, Award, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import confetti from 'canvas-confetti';

type DrawerProps = {
  isOpen: boolean;
  onClose: () => void;
  score: number;
  allCorrect: boolean;
  onRestart: () => void;
  claimPrize: any;
};

export default function GameStatsDrawer({
  isOpen,
  onClose,
  score,
  allCorrect,
  onRestart,
  claimPrize,
}: DrawerProps) {
  function onTransactionConfirmed() {
    toast.success("Congratulations! You've won 10 tokens!");
    onClose();
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });

    setTimeout(() => {
      window.location.reload();
    }, 2000);
  }
  function tryAgain() {
    onRestart();
    onClose();
  }

  return (
    <Drawer open={isOpen} onClose={onClose}>
      <DrawerContent className="bg-gradient-to-br border-none from-purple-900 to-blue-900 text-white">
        <DrawerHeader className="border-b border-purple-700 pb-4">
          <div className="flex items-center justify-center mb-4">
            {allCorrect ? (
              <div className="w-48 h-48 overflow-hidden">
                <img
                  src="/chest.gif"
                  alt="Treasure Opening"
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <Frown className="w-16 h-16 text-blue-400" />
            )}
          </div>
          <h2 className="text-3xl font-bold text-center mb-2">
            {allCorrect ? 'Congratulations!' : 'Game Over!'}
          </h2>
          <p className="text-xl text-center text-purple-200">
            {allCorrect
              ? "You've conquered all the riddles!"
              : `Your final score is: ${score}`}
          </p>
        </DrawerHeader>
        <div className="p-6">
          <div className="bg-white/10 rounded-lg p-4 mb-6">
            <h3 className="text-lg font-semibold mb-2 flex items-center">
              <Award className="mr-2 text-yellow-400" />
              {allCorrect ? 'Your Reward' : 'Better Luck Next Time'}
            </h3>
            <p className="text-purple-200">
              {allCorrect
                ? "You've earned 10 tokens for your brilliant performance!"
                : "Keep practicing and you'll master these riddles in no time!"}
            </p>
          </div>
        </div>
        <DrawerFooter className="border-t border-purple-700 pt-4">
          {allCorrect ? (
            <TransactionButton
              transaction={claimPrize}
              onTransactionConfirmed={onTransactionConfirmed}
            >
              Claim Your Prize
            </TransactionButton>
          ) : (
            <Button
              onClick={tryAgain}
              className="bg-yellow-600 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center"
            >
              <RefreshCw className="mr-2" />
              Try Again
            </Button>
          )}
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
