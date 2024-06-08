import {
  approveBugs,
  depositBugsCall,
  mintBugs,
  withdrawBugs,
  forceWithdrawBugs,
  checkActualUserBugBalance,
} from "@/utils/redstoneHelpers";
import { useEffect, useState } from "react";
import { PlayGamePopup } from "./popup";
import Mintbugs from "@/components/bridge/alerts/mintbugsAlert";
import ApproveBugs from "@/components/bridge/alerts/approveBugsAlert";
import DepositBugAlert from "@/components/bridge/alerts/depositeBugAlert";
import WithdrawBugsAlert from "@/components/bridge/alerts/withdrawBugsAlert";
import ForceWithdrawalAlert from "@/components/bridge/alerts/forceWithdrawalAlert";
import Rules from "./rules";
import { MultiStepLoader } from "@/components/multiStepLoader";
import {
  checkAllowanceOfUser,
  checkBugsBalanceForUser,
} from "@/utils/bridgeHelpers";
import { usePrivy } from "@privy-io/react-auth";

const depositLoadingStates = [
  {
    text: "Transferring Bugs...",
  },
  {
    text: "Deposit request received...",
  },
  {
    text: "Tokens successfully deposited",
  },
  {
    text: "You are now eligible to play",
  },
];

const withdrawLoadingStates = [
  {
    text: "Fetching your Bugs balance...",
  },
  {
    text: "Initiating withdrawal...",
  },
  {
    text: "Withdrawal request received...",
  },
  {
    text: "Tokens successfully withdrawn",
  },
];

const approveLoadingStates = [
  {
    text: "Fetching the user's Bugs balance...",
  },
  {
    text: "Processing contract approval...",
  },
  {
    text: "Tokens approved successfully!",
  },
];

export function BridgeAccordian({ w0 }) {
  const { ready, authenticated } = usePrivy();
  const [isApprove, setIsApprove] = useState(false);
  const [isBugsLocked, setIsBugsLocked] = useState(false);
  const [depositAmount, setDepositAmount] = useState("0");
  const [bridgeAmount, setBridgeAmount] = useState("0");
  const [waitingForApproval, setWaitingForApproval] = useState(false);
  const [isInstructionOpen, setIsInstructionOpen] = useState(true);
  const [bugBalance, setBugBalance] = useState("0");
  const [currentState, setCurrentState] = useState(0);
  const [loading, setLoading] = useState(false);
  const [withdrawLoading, setWithdrawLoading] = useState(false);
  const [withdrawCurrentState, setWithdrawCurrentState] = useState(0);
  const [bugsApprovalAmount, setBugsApprovalAmount] = useState("0");
  const [actualBugBalance, setActualBugBalance] = useState("0");
  const [realoadPage, setReloadPage] = useState(0);
  const [approveLoading, setApproveLoading] = useState(false);
  const [approveCurrentStates, setApproveCurrentStates] = useState(0);

  useEffect(() => {
    if (ready && authenticated && w0?.address !== undefined) {
      if (ready) {
        checkBugsBalanceForUser(w0, setBugBalance);
        checkAllowanceOfUser(w0, setBugsApprovalAmount);
        checkActualUserBugBalance(w0, setActualBugBalance);
      }
    }
  }, [ready, authenticated, w0, realoadPage]);

  return (
    <div>
      {isBugsLocked && <PlayGamePopup isOpen={isBugsLocked} />}

      <Rules
        isInstructionOpen={isInstructionOpen}
        setIsInstructionOpen={setIsInstructionOpen}
      />

      <MultiStepLoader
        loadingStates={depositLoadingStates}
        loading={loading}
        setLoading={setLoading}
        currentState={currentState}
      />

      <MultiStepLoader
        loadingStates={withdrawLoadingStates}
        loading={withdrawLoading}
        setLoading={setWithdrawLoading}
        currentState={withdrawCurrentState}
      />

      <MultiStepLoader
        loadingStates={approveLoadingStates}
        loading={approveLoading}
        setLoading={setApproveLoading}
        currentState={approveCurrentStates}
      />

      <div className="flex gap-4 items-center justify-center">
        <div className="w-20 h-20 rounded-full bg-blue-500 my-4 overflow-hidden border border-green-500">
          <img src="/profile.png" />
        </div>
        <div className="flex flex-col">
          <p>{w0.address.slice(0, 10) + "..."}</p>
          <p className="text-2xl text-[#3FF480]">
            {bugBalance === "0" ? "0" : bugBalance.slice(0, -18)} Bugs
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-4">
        <p className="text-blue-500 mt-5">Step 1: Approve Bugs</p>
        <ApproveBugs
          setReloadPage={setReloadPage}
          approveBugs={approveBugs}
          depositAmount={depositAmount}
          setDepositAmount={setDepositAmount}
          setIsApprove={setIsApprove}
          setWaitingForApproval={setWaitingForApproval}
          w0={w0}
          waitingForApproval={waitingForApproval}
          bugsBalance={bugBalance}
          bugsApprovalAmount={bugsApprovalAmount}
          setBugsApprovalAmount={setBugsApprovalAmount}
          setApproveCurrentStates={setApproveCurrentStates}
          approveCurrentStates={approveCurrentStates}
          setLoading={setApproveLoading}
          loading={approveLoading}
        />

        <DepositBugAlert
          bridgeAmount={bridgeAmount}
          depositBugsCall={depositBugsCall}
          setBridgeAmount={setBridgeAmount}
          setIsBugsLocked={setIsBugsLocked}
          w0={w0}
          loading={loading}
          setLoading={setLoading}
          currentState={currentState}
          setCurrentState={setCurrentState}
          bugsApprovalAmount={bugsApprovalAmount}
          setReloadPage={setReloadPage}
        />
        <p className="text-blue-500 mt-5">Step 2: Deposit Bugs</p>
        {/*<ForceWithdrawalAlert forceWithdrawBugs={forceWithdrawBugs} w0={w0} />*/}
      </div>
      <div className="mt-5">
        <WithdrawBugsAlert
          setReloadPage={setReloadPage}
          w0={w0}
          withdrawBugs={withdrawBugs}
          loading={withdrawLoading}
          setLoading={setWithdrawLoading}
          currentState={withdrawCurrentState}
          setCurrentState={setWithdrawCurrentState}
          actualBugBalance={actualBugBalance}
        />
      </div>
    </div>
  );
}
