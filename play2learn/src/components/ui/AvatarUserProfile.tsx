import { useState } from "react";

function AvatarUserProfile({
    name,
    profile_pic
}: {
    name: string;
    profile_pic?: string;
}) {
    return (
        <div className="flex items-center flex-col gap-2">
            <img className="w-10 h-10 rounded-full" src={profile_pic || "https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg"} alt={name} />
            <span>{name}</span>
        </div>
    );
}

export default AvatarUserProfile;