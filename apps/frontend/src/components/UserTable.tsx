type Props = {
  users: any[];
  onEdit: (user: any) => void;
  onDelete: (user: any) => void;
};

export default function UserTable({ users, onEdit, onDelete }: Props) {
  const getFullName = (user: any) => {
    const name1 = user.name1 || "";
    const name2 = user.name2 || "";
    const lastname1 = user.lastname1 || "";
    const lastname2 = user.lastname2 || "";
    
    const names = [name1, name2].filter(n => n).join(" ");
    const lastnames = [lastname1, lastname2].filter(n => n).join(" ");
    
    return `${names} ${lastnames}`.trim() || "N/A";
  };

  const getRoleDisplay = (user: any) => {
    return user.rol || user.role || "N/A";
  };

  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Degree</th>
          <th>Role</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {users.length === 0 ? (
          <tr>
            <td colSpan={5} style={{ textAlign: "center" }}>
              No users found
            </td>
          </tr>
        ) : (
          users.map((user) => (
            <tr key={user.id}>
              <td>{getFullName(user)}</td>
              <td>{user.email || "N/A"}</td>
              <td>{user.degree || "N/A"}</td>
              <td>{getRoleDisplay(user)}</td>
              <td>
                <button onClick={() => onEdit(user)}>✏️</button>
                <button onClick={() => onDelete(user)}>🗑️</button>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}
