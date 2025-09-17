export default function Admin() {
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold">Admin</h1>
      <p>Use the API <code>/api/v1/admin/*</code> endpoints with a JWT (login via web NextAuth to wire up UI). For now, CRUD is via API; UI scaffolding is intentionally minimal.</p>
      <ul className="list-disc pl-5">
        <li>Create season: POST /api/v1/admin/seasons</li>
        <li>Create event/session: POST /api/v1/admin/events / /admin/sessions</li>
        <li>Override result (with reason): PUT /api/v1/admin/results/:id/override</li>
      </ul>
    </div>
  );
}
