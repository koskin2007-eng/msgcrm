import { formatDate, roleLabel } from "../../lib/format";
import type { TeamMember } from "../../lib/types";
import { Badge } from "../ui/Badge";

function statusLabel(status: TeamMember["status"]) {
  const labels: Record<TeamMember["status"], string> = {
    active: "активен",
    invited: "приглашение добавлено",
    blocked: "заблокирован"
  };

  return labels[status];
}

function statusTone(status: TeamMember["status"]) {
  if (status === "active") {
    return "green";
  }

  if (status === "blocked") {
    return "red";
  }

  return "orange";
}

export function TeamTable({ members }: { members: TeamMember[] }) {
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Имя</th>
            <th>Email</th>
            <th>Роль</th>
            <th>Статус</th>
            <th>Добавлен</th>
          </tr>
        </thead>
        <tbody>
          {members.map((member) => (
            <tr key={member.id}>
              <td>{member.name}</td>
              <td>{member.email}</td>
              <td>
                <Badge tone="blue">{roleLabel(member.role)}</Badge>
              </td>
              <td>
                <Badge tone={statusTone(member.status)}>
                  {statusLabel(member.status)}
                </Badge>
              </td>
              <td>{formatDate(member.joinedAt)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
