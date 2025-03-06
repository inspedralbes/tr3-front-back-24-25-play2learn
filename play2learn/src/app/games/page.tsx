import ClientComponentGames from "@/app/games/ClientComponentGames";

export default async function Page() {
    await new Promise((resolve) => setTimeout(resolve, 10000));
    return <ClientComponentGames selectedLanguage={null}/>;
}
