import { useEffect, useState } from "react";
import api from "../../api/axios";
import Admin from "../Admin/Admin";
import "./Admin.css";
export default function TestPage() {
  return <Admin />;
}

interface User {
  id: string;
  name: string;
  email: string;
  rol?: string;
}

// export default function TestPage() {
//   const [users, setUsers] = useState<User[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     api.get("/users")
//       .then(res => setUsers(res.data))
//       .catch(err => console.error(err))
//       .finally(() => setLoading(false));
//   }, []);

//   if (loading) return <p>Loading users...</p>;

//   return (
//     <div style={{ padding: "2rem" }}>
//       <h1>🧪 Test Page - API Gateway</h1>

//       <table border={1} cellPadding={10}>
//         <thead>
//           <tr>
//             <th>Name</th>
//             <th>Email</th>
//             <th>Rol</th>
//           </tr>
//         </thead>
//         <tbody>
//           {users.map(u => (
//             <tr key={u.id}>
//               <td>{u.name}</td>
//               <td>{u.email}</td>
//               <td>{u.rol ?? "-"}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// }
