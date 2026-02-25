export default function RoleBadge({ role }: { role: string }) {
    const styles: Record<string, string> = {
        host: 'bg-indigo-100 text-indigo-700',
        user: 'bg-green-100 text-green-700',
        admin: 'bg-red-100 text-red-700',
    };
    return (
        <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${styles[role] ?? 'bg-gray-100 text-gray-700'}`}
        >
            {role}
        </span>
    );
}
