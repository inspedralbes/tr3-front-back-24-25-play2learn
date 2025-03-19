"use client";

import {AuthenticatorContext} from "@/contexts/AuthenticatorContext";
import Link from "next/link"
import {useContext} from "react";
import {useRouter} from "next/navigation";
import {useTranslation} from "@/hooks/useTranslation";

function TranslationGameComponent() {

    const {authUser} = useContext(AuthenticatorContext);
    const router = useRouter();
    const {t} = useTranslation();

    return (
        <div>
            <h1>Juego de traduccion</h1>
        </div>
    )

}

export default TranslationGameComponent;