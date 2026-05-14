import { shiftPlans } from "@/lib/shifts";
import ShiftSignupPage from "../ShiftSignupPage";

export default function ZwilleShiftPage() {
  return <ShiftSignupPage plan={shiftPlans.zwille} />;
}
