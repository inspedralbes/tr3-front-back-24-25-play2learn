import { Crown } from "lucide-react";

function AvatarUserProfile({
  name,
  profile_pic,
  pos_name,
  host,
}: {
  name: string;
  profile_pic?: string;
  pos_name?: string;
  host?: boolean;
}) {
  const defaultImage =
    profile_pic ||
    "https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg";

  // Componente de imagen que muestra la Crown si es host.
  const avatarImage = (
    <div className="relative inline-block">
      <img
        className="w-10 h-10 rounded-full"
        src={defaultImage}
        alt={name}
      />
      {host && (
        <Crown className="absolute top-[-16px] left-1/2 transform -translate-x-1/2 w-4 h-4 text-yellow-400" />
      )}
    </div>
  );

  // Layout vertical por defecto.
  if (!pos_name) {
    return (
      <div className="flex flex-col items-center gap-2">
        {avatarImage}
        <span>{name}</span>
      </div>
    );
  }

  if (pos_name === "right") {
    return (
      <div className="flex items-center gap-2">
        {avatarImage}
        <span>{name}</span>
      </div>
    );
  }

  if (pos_name === "left") {
    return (
      <div className="flex items-center gap-2">
        <span>{name}</span>
        {avatarImage}
      </div>
    );
  }

  // Para cualquier otro valor de pos_name, usamos el layout vertical por defecto
  return (
    <div className="flex flex-col items-center gap-2">
      {avatarImage}
      <span>{name}</span>
    </div>
  );
}

export default AvatarUserProfile;