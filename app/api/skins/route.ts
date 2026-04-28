import { getPaginatedSlice } from '@/shared/api/utils/getPaginatedSlice';
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const lang = req.headers.get("Language") ?? "en";

    const { page, size, ...params } = Object.fromEntries(req.nextUrl.searchParams);

    const dev = [
      {
        id: "1059",
        isLegacy: false,
        contentId: "3d8e32b1-1fa1-4e18-ae30-cdf70effdffd",
        championId: "Annie",
        championKey: "1",
        championName: "Энни",
        name: "Энни из Пандемониума",
        description:
          "Энни переполняют чувства, слишком глубокие для ребенка. И хотя она старается не думать о них, они по-прежнему бурлят и горят в ее сердце. Когда пожар чувств разгорается слишком сильно, Тибберс выражает их вместо Энни, высвобождая ее горе в виде ужасающего пламени.",
        pbe: true,
        image: {
          centered:
            "https://raw.communitydragon.org/pbe/plugins/rcp-be-lol-game-data/global/default/assets/characters/annie/skins/skin59/images/annie_splash_centered_59.skins_annie_skin59.jpg",
          uncentered:
            "https://raw.communitydragon.org/pbe/plugins/rcp-be-lol-game-data/global/default/assets/characters/annie/skins/skin59/images/annie_splash_uncentered_59.skins_annie_skin59.jpg",
          loading:
            "https://raw.communitydragon.org/pbe/plugins/rcp-be-lol-game-data/global/default/assets/characters/annie/skins/skin59/annieloadscreen_59.skins_annie_skin59.jpg",
        },
        rarity: "kEpic",
        chromaPath: null,
        chromas: [],
        skinlines: [
          {
            id: "229",
            name: "Пандемониум",
          },
        ],
        owned: false,
        originName: "Pandemonium Annie",
      },
      {
        id: "203045",
        isLegacy: false,
        contentId: "72e22550-4f6d-4404-acda-4d88dd2866a3",
        championId: "Kindred",
        championKey: "203",
        championName: "Киндред",
        name: "Киндред из Пандемониума",
        description:
          "Даже демонов ждет встреча с Киндред. Овечка дарует им покой, полностью заглушая голод, который терзает их всех. Волк же помогает в последний раз насладиться вихрем эмоций... Но тех, кто согласится, голод будет терзать вечно. Вместе они предлагают демонам последний выбор – ничего или все.",
        pbe: true,
        image: {
          centered:
            "https://raw.communitydragon.org/pbe/plugins/rcp-be-lol-game-data/global/default/assets/characters/kindred/skins/skin45/images/kindred_splash_centered_45.skins_kindred_skin45.jpg",
          uncentered:
            "https://raw.communitydragon.org/pbe/plugins/rcp-be-lol-game-data/global/default/assets/characters/kindred/skins/skin45/images/kindred_splash_uncentered_45.skins_kindred_skin45.jpg",
          loading:
            "https://raw.communitydragon.org/pbe/plugins/rcp-be-lol-game-data/global/default/assets/characters/kindred/skins/skin45/kindredloadscreen_45.skins_kindred_skin45.jpg",
        },
        rarity: "kEpic",
        chromaPath: null,
        chromas: [],
        skinlines: [
          {
            id: "229",
            name: "Пандемониум",
          },
        ],
        owned: false,
        originName: "Pandemonium Kindred",
      },
      {
        id: "35071",
        isLegacy: false,
        contentId: "5d6dc705-c838-4229-aada-9cb4890d29ba",
        championId: "Shaco",
        championKey: "35",
        championName: "Шако",
        name: "Шако из Пандемониума (престижный)",
        description:
          "Не каждому понравится то, как Шако проявляет свои чувства. Извращенная радость, безутешное отчаяние – искаженный вихрь хаоса и комедии. Гротескными гримасами и нарочитыми жестами он будто насмехается над настоящими чувствами.",
        pbe: true,
        image: {
          centered:
            "https://raw.communitydragon.org/pbe/plugins/rcp-be-lol-game-data/global/default/assets/characters/shaco/skins/skin71/images/shaco_splash_centered_71.skins_shaco_skin71.jpg",
          uncentered:
            "https://raw.communitydragon.org/pbe/plugins/rcp-be-lol-game-data/global/default/assets/characters/shaco/skins/skin71/images/shaco_splash_uncentered_71.skins_shaco_skin71.jpg",
          loading:
            "https://raw.communitydragon.org/pbe/plugins/rcp-be-lol-game-data/global/default/assets/characters/shaco/skins/skin71/shacoloadscreen_71.skins_shaco_skin71.jpg",
        },
        rarity: "kMythic",
        chromaPath:
          "https://raw.communitydragon.org/pbe/plugins/rcp-be-lol-game-data/global/default/v1/champion-chroma-images/35/35071.png",
        chromas: [
          {
            id: "35072",
            name: "Пылкость",
            fullName: "Шако из Пандемониума (престижный) – ''Пылкость''",
            contentId: "d6aeefbb-603a-40c7-8265-1403ead7c4a4",
            skinName: "Шако из Пандемониума (престижный)",
            skinContentId: "5d6dc705-c838-4229-aada-9cb4890d29ba",
            championId: "Shaco",
            path: "https://raw.communitydragon.org/pbe/plugins/rcp-be-lol-game-data/global/default/v1/champion-chroma-images/35/35072.png",
            colors: ["#CE1717", "#550000"],
            pbe: true,
          },
        ],
        skinlines: [
          {
            id: "229",
            name: "Пандемониум",
          },
        ],
        owned: false,
        originName: "Prestige Pandemonium Shaco",
      },
      {
        id: "67067",
        isLegacy: false,
        contentId: "9f4065fe-5171-4a1e-92ac-457c4e6d17c6",
        championId: "Vayne",
        championKey: "67",
        championName: "Вейн",
        name: "Проклятая демоном Вейн",
        description:
          "Много лет Вейн преследовала демона, который убил ее родителей, но в итоге сама стала одержимой иным демоном. Теперь от ее взора не укрыться, и ее переполняет темная сила, но ее терзают нескончаемые паранойя и жажда крови. Вейн стала дикой и неудержимой – не ведая о демоне в ее душе, она обратилась в то, что хотела уничтожить.",
        pbe: true,
        image: {
          centered:
            "https://raw.communitydragon.org/pbe/plugins/rcp-be-lol-game-data/global/default/assets/characters/vayne/skins/skin67/images/vayne_splash_centered_67.skins_vayne_skin67.jpg",
          uncentered:
            "https://raw.communitydragon.org/pbe/plugins/rcp-be-lol-game-data/global/default/assets/characters/vayne/skins/skin67/images/vayne_splash_uncentered_67.skins_vayne_skin67.jpg",
          loading:
            "https://raw.communitydragon.org/pbe/plugins/rcp-be-lol-game-data/global/default/assets/characters/vayne/skins/skin67/vayneloadscreen_67.skins_vayne_skin67.jpg",
        },
        rarity: "kLegendary",
        chromaPath:
          "https://raw.communitydragon.org/pbe/plugins/rcp-be-lol-game-data/global/default/v1/champion-chroma-images/67/67067.png",
        chromas: [
          {
            id: "67068",
            name: "Рубин",
            fullName: "Проклятая демоном Вейн – ''Рубин''",
            contentId: "027c4246-2eaf-423e-ad10-7a0474111824",
            skinName: "Проклятая демоном Вейн",
            skinContentId: "9f4065fe-5171-4a1e-92ac-457c4e6d17c6",
            championId: "Vayne",
            path: "https://raw.communitydragon.org/pbe/plugins/rcp-be-lol-game-data/global/default/v1/champion-chroma-images/67/67068.png",
            colors: ["#D33528"],
            pbe: true,
          },
          {
            id: "67069",
            name: "Кошачий глаз",
            fullName: "Проклятая демоном Вейн – ''Кошачий глаз''",
            contentId: "1d006952-d760-4e72-89ea-10da3673a4f0",
            skinName: "Проклятая демоном Вейн",
            skinContentId: "9f4065fe-5171-4a1e-92ac-457c4e6d17c6",
            championId: "Vayne",
            path: "https://raw.communitydragon.org/pbe/plugins/rcp-be-lol-game-data/global/default/v1/champion-chroma-images/67/67069.png",
            colors: ["#FFEE59"],
            pbe: true,
          },
          {
            id: "67070",
            name: "Изумруд",
            fullName: "Проклятая демоном Вейн – ''Изумруд''",
            contentId: "b6c99382-24f1-4c06-9204-6f238f10e437",
            skinName: "Проклятая демоном Вейн",
            skinContentId: "9f4065fe-5171-4a1e-92ac-457c4e6d17c6",
            championId: "Vayne",
            path: "https://raw.communitydragon.org/pbe/plugins/rcp-be-lol-game-data/global/default/v1/champion-chroma-images/67/67070.png",
            colors: ["#2DA130"],
            pbe: true,
          },
          {
            id: "67071",
            name: "Сапфир",
            fullName: "Проклятая демоном Вейн – ''Сапфир''",
            contentId: "de8131d9-463e-4f5b-9714-9984b4b710fb",
            skinName: "Проклятая демоном Вейн",
            skinContentId: "9f4065fe-5171-4a1e-92ac-457c4e6d17c6",
            championId: "Vayne",
            path: "https://raw.communitydragon.org/pbe/plugins/rcp-be-lol-game-data/global/default/v1/champion-chroma-images/67/67071.png",
            colors: ["#2756CE"],
            pbe: true,
          },
          {
            id: "67072",
            name: "Розовый кварц",
            fullName: "Проклятая демоном Вейн – ''Розовый кварц''",
            contentId: "7a3b1d3c-6bd6-454b-a453-7515c95f1e6c",
            skinName: "Проклятая демоном Вейн",
            skinContentId: "9f4065fe-5171-4a1e-92ac-457c4e6d17c6",
            championId: "Vayne",
            path: "https://raw.communitydragon.org/pbe/plugins/rcp-be-lol-game-data/global/default/v1/champion-chroma-images/67/67072.png",
            colors: ["#E58BA5"],
            pbe: true,
          },
          {
            id: "67073",
            name: "Жемчуг",
            fullName: "Проклятая демоном Вейн – ''Жемчуг''",
            contentId: "c99d1f7b-fc02-4ebb-b5e0-9ab987329a84",
            skinName: "Проклятая демоном Вейн",
            skinContentId: "9f4065fe-5171-4a1e-92ac-457c4e6d17c6",
            championId: "Vayne",
            path: "https://raw.communitydragon.org/pbe/plugins/rcp-be-lol-game-data/global/default/v1/champion-chroma-images/67/67073.png",
            colors: ["#ECF9F8"],
            pbe: true,
          },
        ],
        skinlines: [
          {
            id: "229",
            name: "Пандемониум",
          },
        ],
        owned: false,
        originName: "Demoncursed Vayne",
      },
    ] as any;

    const skins = Array.from({ length: 20 })
      .map(() => [...dev])
      .flat();

    return Response.json({
      count: skins.length,
      data: getPaginatedSlice(skins, page, size),
    });
  } catch {
    return Response.json({ code: "ERR_0000" }, { status: 500 });
  }
}
