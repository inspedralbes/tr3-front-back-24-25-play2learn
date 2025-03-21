import WordChain from "./WordChain";

export default function Games() {
    const game = {
        id: 1,
        id_level_language: 1,
        language_level: {
            id: 1,
            language_id: 1,
            language: {
                id: 1,
                name: "English",
            },
            level: "A1",
        },
        uuid: "1234567890",
        password: "123456",
        name: "Game 1",
        n_rounds: 5,
        max_clues: 0,
        max_time: 10,
        max_players: 4,
        participants: [
            {
                id: 1,
                user: {
                    id: 1,
                    name: "User 1",
                    profile_pic: "https://via.placeholder.com/150",
                },
                rol: "host",
                points: 0,
            },
            {
                id: 2,
                user: {
                    id: 2,
                    name: "User 2",
                    profile_pic: "https://via.placeholder.com/150",
                },
                rol: "participant",
                points: 0,
            },
            {
                id: 3,
                user: {
                    id: 3,
                    name: "User 3",
                    profile_pic: "https://via.placeholder.com/150",
                },
                rol: "participant",
                points: 0,
            },
            {
                id: 4,
                user: {
                    id: 4,
                    name: "User 4",
                    profile_pic: "https://via.placeholder.com/150",
                },
                rol: "participant",
                points: 0,
            },
            {
                id: 5,
                user: {
                    id: 5,
                    name: "User 5",
                    profile_pic: "https://via.placeholder.com/150",
                },
                rol: "participant",
                points: 0,
            },
        ],
    };

    return <WordChain participants={game.participants} game={game} />   ;
}