type User = {
    id: number;
    name: string;
    email: string;
    role: string;
    avatar: string | null;
    created_at: string;
};

export default function AvatarCircle({ user }: { user: User }) {
    return user.avatar ? (
        <img src={`/storage/${user.avatar}`} alt={user.name} className="h-9 w-9 rounded-full object-cover ring-2 ring-indigo-200" />
    ) : (
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-linear-to-br from-indigo-500 to-purple-600 text-sm font-bold text-white ring-2 ring-indigo-200">
            {user.name.charAt(0).toUpperCase()}
        </div>
    );
}
