import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import "./ConfirmModal.css";

interface ConfirmModalProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
}

// Segundo paso de una acción delicada (por ejemplo, borrar el progreso).
// El foco empieza en "Cancelar" para que no se confirme por accidente.
const ConfirmModal = ({
  open,
  title,
  message,
  confirmLabel,
  onConfirm,
  onCancel,
}: ConfirmModalProps) => {
  return (
    <Modal open={open} title={title} onClose={onCancel} hideClose>
      <p className="confirm-message">{message}</p>
      <div className="confirm-actions">
        <Button variant="secondary" data-autofocus onClick={onCancel}>
          Cancelar
        </Button>
        <Button variant="primary" onClick={onConfirm}>
          {confirmLabel}
        </Button>
      </div>
    </Modal>
  );
};

export default ConfirmModal;
