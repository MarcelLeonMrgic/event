import { shiftPlans } from "@/lib/shifts";
import ShiftSignupPage from "./ShiftSignupPage";

export default function MakerspaceShiftPage() {
  return <ShiftSignupPage plan={shiftPlans.makerspace} />;
}
