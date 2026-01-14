type Props = {
  user: any;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function ConfirmDeleteModal({
  user,
  onConfirm,
  onCancel,
}: Props) {
  return (
    <div className="modal">
      <p>Are you sure you want to delete {user.email}?</p>
      <button onClick={onConfirm}>Yes</button>
      <button onClick={onCancel}>No</button>
    </div>
  );
}
