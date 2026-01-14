type Props = {
  users: any[];
  onEdit: (user: any) => void;
  onDelete: (user: any) => void;
};

export default function UserTable({ users, onEdit, onDelete }: Props) {
  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Role</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user) => (
          <tr key={user.id}>
            <td>{user.name}</td>
            <td>{user.email}</td>
            <td>{user.role}</td>
            <td>
              <button onClick={() => onEdit(user)}>✏️</button>
              <button onClick={() => onDelete(user)}>🗑️</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
