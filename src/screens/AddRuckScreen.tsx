import { RuckForm } from "../components/RuckForm";
import { RuckEntry } from "../types";

type AddRuckScreenProps = {
  onCancel: () => void;
  onSave: (entry: RuckEntry) => void;
};

export function AddRuckScreen({ onCancel, onSave }: AddRuckScreenProps) {
  return (
    <RuckForm
      title="Add Ruck"
      subtitle="Enter the details from your workout."
      submitButtonText="Save Ruck"
      onCancel={onCancel}
      onSubmit={onSave}
    />
  );
}
