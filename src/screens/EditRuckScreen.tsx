import { RuckForm } from "../components/RuckForm";
import { RuckEntry } from "../types";

type EditRuckScreenProps = {
  ruck: RuckEntry;
  onCancel: () => void;
  onSave: (entry: RuckEntry) => void;
};

export function EditRuckScreen({ ruck, onCancel, onSave }: EditRuckScreenProps) {
  return (
    <RuckForm
      title="Edit Ruck"
      subtitle="Update the details from this workout."
      submitButtonText="Save Changes"
      initialEntry={ruck}
      onCancel={onCancel}
      onSubmit={onSave}
    />
  );
}
